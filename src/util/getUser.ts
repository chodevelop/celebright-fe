export const getUserId = () => {
  try {
    // 로컬스토리지에서 user 데이터 가져오기
    const user = localStorage.getItem("user");
    if (!user) {
      throw new Error("No user data found in localStorage");
    }

    // JSON 파싱
    const parsedUser = JSON.parse(user);
    const token = parsedUser.accessToken;

    if (!token) {
      throw new Error("Access token not found");
    }

    // JWT 디코딩
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    const parsedPayload = JSON.parse(jsonPayload);

    // userId 반환
    return parsedPayload.userId;
  } catch (error: any) {
    console.error("Error extracting userId from JWT:", error.message);
    return null; // 오류가 발생한 경우 null 반환
  }
};
