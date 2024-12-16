import axios from "axios";

export const fetchNotifications = async (userId: number) => {
  const response = await axios.get(
    `http://localhost:4000/notification/${userId}`,
  );
  return response.data;
};

// 알림 읽음 상태 업데이트
export const markNotificationAsRead = async (notificationId: number) => {
  const response = await axios.patch(
    `http://localhost:4000/notification/${notificationId}/read`,
  );
  return response.data;
};
