import { useState, useEffect, useCallback } from "react";
import MyInfo from "../components/MyPage/MyInfo";
import { useUserStore } from "../store/userStore";
import { fetchUserInfo } from "../util/myPageApi";
import MyMenu from "../components/MyPage/MyMenu";
import { Outlet } from "react-router-dom";
import EditProfileForm from "../components/MyPage/EditProfileForm";
import Notification from "../components/common/Notification"; // Notification 컴포넌트 import
import { getUserId } from "../util/getUser";

const MyPage = () => {
  const { user, setUser } = useUserStore();
  const [userId, setUserId] = useState<string | null>(getUserId); // 초기값 설정
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  // Notification 상태 추가
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({ open: true, message, severity });
  };

  const fetchData = useCallback(async () => {
    if (!userId) {
      console.error("No user ID found");
      setUser(null);
      return;
    }

    try {
      const userInfo = await fetchUserInfo(userId);
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
    }
  }, [userId, setUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      style={{
        margin: "0 5%",
        marginTop: "32px",
        marginBottom: "32px",
        backgroundColor: "white",
        border: "none",
        borderRadius: "18px",
        boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 29px 0px",
      }}
    >
      {!isEditing ? (
        <>
          <MyInfo
            user={user}
            setUser={setUser}
            setIsEditing={setIsEditing} // 수정 모드 전환 함수 전달
          />
          <MyMenu user={user} userId={userId || ""} />
          <Outlet key={userId} />
        </>
      ) : (
        <EditProfileForm
          user={user}
          setUser={setUser}
          setIsEditing={setIsEditing}
          refreshUserData={fetchData} // 수정 완료 후 데이터를 다시 가져오는 함수 전달
          showNotification={showNotification} // 알림 표시 함수 전달
        />
      )}
      {/* Notification 컴포넌트 추가 */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </div>
  );
};

export default MyPage;
