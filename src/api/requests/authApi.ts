import { getUserId } from "../../util/getUser";
import socket from "../../util/socket_noti";
import axiosInstance from "../client/index";

type AckResponse = {
  status: string;
};

socket.on("connect", () => {
  console.log("Socket connected successfully!");
  const userId = getUserId(); // 사용자 ID 가져오기
  if (userId) {
    console.log("Registering user on initial connection...");
    socket.emit("register", userId, (ack: AckResponse) => {
      console.log("Initial registration acknowledged:", ack, userId);
    });
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("reconnect", () => {
  const userId = getUserId();
  if (userId) {
    console.log("Socket reconnected. Re-registering user...");
    socket.emit("register", userId, (ack: AckResponse) => {
      console.log("Re-registration acknowledged:", ack, userId);
    });
  }
});

const REACT_APP_BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "DEFAULT_REACT_APP_BACKEND_URL";
const backendAuth = `${REACT_APP_BACKEND_URL}/auth`;

export const logout = async () => {
  try {
    localStorage.removeItem("user");
    
    socket.disconnect();

    // 로그아웃 요청 전송
    const response = await axiosInstance.post(
      "/auth/logout",
      {},
      { withCredentials: true },
    );
    console.log(`Logout response: `, response.data);
  } catch (error: any) {
    console.error("로그아웃 API 호출 실패:", error);

    // 에러 응답 확인
    if (error.response) {
      console.error("서버 응답 에러:", error.response.data);
    } else if (error.request) {
      console.error("요청이 서버에 도달하지 못함:", error.request);
    } else {
      console.error("로그아웃 요청 설정 중 에러 발생:", error.message);
    }
    // 에러를 다시 던져 호출하는 쪽에서 처리할 수 있도록 함
    throw new Error("로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    // 로그아웃 요청 전송
    const response = await axiosInstance.post("/auth/signup", {
      username,
      email,
      password,
    });
    console.log(`Logout response: `, response.data);
    return response.data;
  } catch (error: any) {
    console.error("회원가입 API 호출 실패:", error);

    // 에러 응답 확인
    if (error.response) {
      console.error("서버 응답 에러:", error.response.data);
    } else if (error.request) {
      console.error("요청이 서버에 도달하지 못함:", error.request);
    } else {
      console.error("회원가입 요청 설정 중 에러 발생:", error.message);
    }
    // 에러를 다시 던져 호출하는 쪽에서 처리할 수 있도록 함
    throw new Error("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

export const login = async (email: string, password: string) => {
  try {
    // 로그인 요청 전송
    const response = await axiosInstance.post(
      "/auth/signin",
      { email, password },
      { withCredentials: true },
    );
    console.log(`Login response: `, response.data);

    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    // 로그인 후 사용자 id를 소켓 서버에 등록 - 클라이언트 백엔드 간의 소켓 연결 활성화
    const userId = getUserId();
    if (userId) {
      socket.emit("register", userId, (ack: AckResponse) => {
        console.log("Socket register event acknowledged:", ack, userId);
      });
    } else {
      console.error("Failed to extract userId from accessToken.");
    }
    return response.data;
  } catch (error: any) {
    console.error("로그인 API 호출 실패:", error);

    // 에러 응답 확인
    if (error.response) {
      console.error("서버 응답 에러:", error.response.data);
    } else if (error.request) {
      console.error("요청이 서버에 도달하지 못함:", error.request);
    } else {
      console.error("회원가입 요청 설정 중 에러 발생:", error.message);
    }
    // 에러를 다시 던져 호출하는 쪽에서 처리할 수 있도록 함
    throw new Error("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

export const kakaoSocialLogin = () => {
  window.location.href = `${backendAuth}/signin/kakao/`;
  return true;
};

export const googleSocialLogin = () => {
  window.location.href = `${backendAuth}/signin/google`;
  return true;
};
