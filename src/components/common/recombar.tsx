import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import { fetchInfluencers } from "../../util/myPageApi";
import { getUserId } from "../../util/getUser";
import FollowModal from "../MyPage/FollowModal";
import { useLoggedInUserStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import socket from "../../util/socket_noti";

interface User {
  username: string;
  profile_picture?: string;
  id: string;
}

interface Influencer {
  banner_picture?: string;
  id: string;
  user_id: string;
  User: User;
  follower: string[];
  category?: string;
}

interface Notification {
  feedId: string;
  influencerId: string;
  message: string;
}

const Recombar = () => {
  const [popularInfluencers, setPopularInfluencers] = useState<Influencer[]>(
    [],
  );
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"membership" | "profile" | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { loggedInUser } = useLoggedInUserStore((state) => state);
  const [userId, setUserId] = useState<string | null>(() => getUserId());
  const navigate = useNavigate();

  // 인플루언서 데이터 가져오기
  useEffect(() => {
    const fetchAndSetInfluencers = async () => {
      try {
        setUserId(getUserId());
        const influencers: Influencer[] = await fetchInfluencers();

        const filteredInfluencers = influencers.filter(
          (influencer) =>
            influencer.User.id !== userId && influencer.banner_picture,
        );

        const sortedInfluencers = filteredInfluencers
          .map((influencer) => ({
            ...influencer,
            follower: Array.isArray(influencer.follower)
              ? influencer.follower
              : JSON.parse(influencer.follower || "[]"),
          }))
          .sort((a, b) => b.follower.length - a.follower.length)
          .slice(0, 5);

        setPopularInfluencers(sortedInfluencers);
      } catch (error) {
        console.error("Failed to fetch influencers:", error);
      }
    };
    fetchAndSetInfluencers();
  }, [refreshKey, userId, loggedInUser]);

  // 팔로우 상태 변경 처리
  const handleFollowStatusChange = useCallback(
    (influencerId: string, isFollowing: boolean) => {
      setPopularInfluencers((prevInfluencers) =>
        prevInfluencers.map((influencer) =>
          influencer.id === influencerId
            ? {
                ...influencer,
                follower: isFollowing
                  ? [...influencer.follower, userId || ""]
                  : influencer.follower.filter((id) => id !== userId),
              }
            : influencer,
        ),
      );

      // 상태를 강제로 새로고침
      setRefreshKey((prevKey) => prevKey + 1);
    },
    [userId, loggedInUser],
  );

  const handleOpenModal = (id: string, type: "membership" | "profile") => {
    setSelectedInfluencerId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfluencerId(null);
    setModalType(null);
  };

  const handleTestNotification = () => {
    if (loggedInUser && loggedInUser.influencerId) {
      socket.emit("test_notification", {
        influencerId: loggedInUser.influencerId,
        message: "Test notification from " + loggedInUser.username,
        feedId: "test_feed_id",
      });
      console.log("테스트 알림 발송");
    }
  };

  return (
    <>
      <Box
        textAlign="center"
        sx={{
          position: "sticky",
          top: "32px",
          padding: "36px",
          marginTop: "32px",
          backgroundColor: "white",
          borderRadius: "18px",
          boxShadow: "rgba(153, 129, 172, 0.2) 0px 7px 18px 0px",
        }}
      >
        {/* 알림 테스트 버튼을 우상단 끝에 조그맣게 위치 */}
        <Button
          onClick={handleTestNotification}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "5px 10px",
            fontSize: "12px",
            color: "white",
            backgroundColor: "white",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease", // 부드러운 색상 전환
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "violet"; // 호버 시 색상
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white"; // 원래 색상
          }}
        >
          Test Noti
        </Button>
        <Typography
          sx={{
            fontSize: "16px",
            color: "gray",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          나의 계정
        </Typography>

        {/* 로그인한 사용자의 정보 표시 */}
        <List>
          <ListItem
            sx={{
              padding: "8px 0",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!loggedInUser) {
                navigate("/login"); // 로그인 페이지로 이동
              } else {
                navigate(`/mypage/`); // 마이페이지로 이동
              }
            }}
          >
            <ListItemAvatar>
              <Avatar src={loggedInUser?.profile_picture || ""} />
            </ListItemAvatar>
            <ListItemText
              primary={loggedInUser ? loggedInUser.username : "로그인해주세요"}
              secondary={
                loggedInUser ? loggedInUser.email : "계정을 로그인하세요"
              }
            />
          </ListItem>
        </List>

        <Typography
          sx={{
            fontSize: "16px",
            color: "gray",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          회원님을 위한 추천
        </Typography>
        <List>
          {popularInfluencers.map((influencer, index) => (
            <ListItem
              key={index}
              sx={{
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => handleOpenModal(influencer.id, "profile")}
            >
              <ListItemAvatar>
                <Avatar
                  src={influencer.User?.profile_picture || ""}
                  alt={influencer.User?.username || "Unknown"}
                />
              </ListItemAvatar>
              <ListItemText
                primary={influencer.User?.username || "Unknown"}
                secondary={influencer.category || "카테고리 없음"}
              />
              {userId && influencer.follower.includes(String(userId)) ? (
                <Chip
                  variant="filled"
                  label="팔로잉"
                  color="primary"
                  size="medium"
                />
              ) : (
                <Chip
                  variant="outlined"
                  label="팔로우"
                  color="primary"
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollowStatusChange(influencer.id, true);
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* FollowModal 컴포넌트 */}
      <FollowModal
        open={isModalOpen}
        modalType={modalType}
        influencerId={
          selectedInfluencerId ? parseInt(selectedInfluencerId, 10) : null
        }
        onClose={handleCloseModal}
        onFollowStatusChange={handleFollowStatusChange}
      />
    </>
  );
};

export default Recombar;
