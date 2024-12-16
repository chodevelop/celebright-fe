import { useEffect, useState } from "react";
import { fetchUser } from "../../util/homeFeedApi";
import { CurrentLoggedInUser } from "../../types/homeFeedType";
import { useLoggedInUserStore } from "../../store/authStore";

export const useInitializeUser = () => {
  // const [loggedInUser, setLoggedInUser] = useState<CurrentLoggedInUser | null>(null); // 로그인 사용자
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInUser);
  const setLoggedInUser = useLoggedInUserStore((state) => state.setLoggedInUser);
  // console.log(loggedInUser, "1111");
  
  //맨 처음 사용자 정보 및 초기 피드를 불러오는 함수
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const user = await fetchUser() || null; // 사용자 정보 불러오기
        setLoggedInUser(user);
      } catch (error) {
        console.error("사용자 정보 초기화 중 오류 발생:", error);
        setLoggedInUser(null);
      }
    };
    initializeApp(); // 사용자 정보 초기화 함수 실행
  }, []);


  
  return { loggedInUser, setLoggedInUser };
};