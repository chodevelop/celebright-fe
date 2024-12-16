import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Container,
  Paper,
  IconButton,
  Button, // ADDED: Import IconButton
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { getUserId } from "../util/getUser";
import axios from "axios";
import Notification from "../components/common/Notification";
import ChatPage from "../components/Feed/Modal/FeedModal";
import { useModal } from "../hooks/useModal";
import socket from "../util/socket_noti";

interface NotificationType {
  id: number;
  username: string;
  createdAt: string;
  feedId: number;
  isDeleting?: boolean; // ADDED: 삭제 애니메이션을 위한 상태
  isLiveNotification?: boolean; // 실시간 알림 여부
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationMessage, setNotificationMessage] = useState(""); // 알림 메시지 상태
  const [notificationOpen, setNotificationOpen] = useState(false); // 알림 열림 상태
  const [notificationSeverity, setNotificationSeverity] = useState<
    "success" | "error"
  >("success"); // 알림 유형 상태
  const userId = getUserId();
  const { open: openFeedModal } = useModal(ChatPage);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime(); // 시간 차이 (밀리초)
    const diffSec = Math.floor(diffMs / 1000); // 초 단위
    const diffMin = Math.floor(diffSec / 60); // 분 단위
    const diffHour = Math.floor(diffMin / 60); // 시간 단위
    const diffDay = Math.floor(diffHour / 24); // 일 단위

    if (diffDay > 0) return `${diffDay}일 전`;
    if (diffHour > 0) return `${diffHour}시간 전`;
    if (diffMin > 0) return `${diffMin}분 전`;
    return `방금 전`;
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/noti/${userId}`,
        );
        console.log(response.data);
        if (response.data.success) {
          const processedNotifications = response.data.data.map(
            (notification: any) => ({
              id: notification.id,
              feedId: notification.feed_id,
              username:
                notification.feed?.influencer?.user?.username || "알 수 없음",
              createdAt: getRelativeTime(notification.created_at),
            }),
          );
          setNotifications(processedNotifications);
        }
      } catch (error) {
        console.error("알림 가져오기 실패", error);
      }
    };
    getNotifications();

    // 실시간 알림 수신

    socket.on("new_notification", (data) => {
      console.log("실시간 알림 수신:", data);
      setNotifications((prev) => [
        {
          id: Date.now(), // 임시 ID
          feedId: data.feedId,
          username: data.influencerName, // 알림 메시지에서 유저 이름 추출 가능
          createdAt: "방금 전", // 실시간 알림은 항상 "방금 전"으로 표시
          isLiveNotification: true, // 실시간 알림 여부
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new_notification"); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, [userId]);

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await axios.delete(`http://localhost:4000/noti/${notificationId}`);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((noti) => noti.id !== notificationId),
      );
      // 성공 알림 설정
      setNotificationSeverity("success");
      setNotificationMessage("알림이 읽음 처리되었습니다.");
      setNotificationOpen(true);
    } catch (error) {
      console.error("알림 삭제 실패", error);
      // 실패 알림 설정
      setNotificationSeverity("error");
      setNotificationMessage("알림 처리 중 오류가 발생했습니다.");
      setNotificationOpen(true);
    }
  };
  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: '36px',

        borderRadius: '18px',
        boxShadow: 'rgba(153, 129, 172, 0.3) 0px 7px 29px 0px',

        margin: '0 5%',
        marginTop: '32px',
        minHeight: '81vh',
      }}
    >


      {/* 알림 리스트 */}
      <Box
      // sx={{ width: "100%" }}
      >
        <List>
          {notifications.map((notification) => (
            <Paper
              elevation={2}
              key={notification.id}
              sx={{
                mb: 2,
                borderRadius: "20px",
                overflow: "hidden",
                bgcolor: notification.isLiveNotification
                  ? "primary.light" // 실시간 알림일 경우 색상
                  : "background.paper", // 기존 알림일 경우 색상
              }}
            >
              <ListItem
                sx={{

                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  p: 1,
                  borderRadius: "350px",

                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteNotification(notification.id)}
                    sx={{
                      "&:hover": {
                        color: "#4bcd00", // 호버 시 초록색으로 변경
                      },
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar
                  sx={{
                    margin: "auto 0",
                    height: "100%",

                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "primary.main",
                      color: "white",
                      fontSize: "12px",
                      marginLeft: "10%",

                    }}
                  >
                    New!
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "none",
                        marginLeft: "10px",
                      }}
                      onClick={() => {
                        console.log(notification.feedId);
                        sessionStorage.setItem("page", `${notification.feedId}`);
                        openFeedModal();
                      }}
                    >
                      @{notification.username}

                    </button>
                  }
                  secondary={`${notification.createdAt} | 새로운 게시글이 작성되었습니다.`}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{
                    marginLeft: "10px",
                    variant: "body2",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            </Paper>
          ))}
          {notifications.length === 0 && (
            <Box
              sx={{
                marginLeft: "10px",
                textAlign: "center",
                py: 3,
                color: "text.secondary",
              }}
            >
              <Typography variant="body1">새로운 알림이 없습니다.</Typography>
            </Box>
          )}
        </List>
        <Notification
          open={notificationOpen}
          message={notificationMessage}
          severity={notificationSeverity}
          onClose={handleNotificationClose}
        />
      </Box>

    </Box>


  );
};

export default NotificationPage;
