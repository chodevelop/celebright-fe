import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { User } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import Banner from "./MyInfo/Banner";
import UserInfo from "./MyInfo/UserInfo";
import InfluencerButton from "./MyInfo/InfluencerButton";
import InfluencerModal from "./MyInfo/InfluencerModal";
import {
  exitInfluencer,
  fetchUserInfo,
  registerInfluencer,
} from "../../util/myPageApi"; // API 함수 가져오기
import { logout } from "../../api/requests/authApi";
import { useLoggedInUserStore } from "../../store/authStore";

interface MyInfoProps {
  user: User | null;
  setUser: (user: User | null) => void; // 사용자 데이터 업데이트
  setIsEditing: (isEditing: boolean) => void;
}

const MyInfo: React.FC<MyInfoProps> = ({ user, setUser, setIsEditing }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLoggedInUser } = useLoggedInUserStore(); // 로그인 상태 전역 관리

  // 사용자 데이터 갱신 함수
  const refreshUserData = async () => {
    if (!user?.id) return;
    try {
      const updatedUser = await fetchUserInfo(String(user.id));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // 인플루언서 신청 처리
  const handleInfluencerSubmit = async (
    category: string,
    bannerImage: string | null
  ) => {
    const newInfluencer = {
      user_id: user?.id,
      follower: [],
      banner_picture: bannerImage || "https://source.unsplash.com/random",
      category,
    };

    try {
      setLoading(true);
      await registerInfluencer(newInfluencer);
      console.log("Influencer registered successfully");
      await refreshUserData();
    } catch (error) {
      console.error("Failed to register influencer:", error);
      alert("인플루언서 신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 인플루언서 탈퇴 처리
  const handleExitInfluencer = async (influencerId: number | undefined) => {
    if (!influencerId) {
      console.error("Invalid influencer ID");
      return;
    }
    try {
      setLoading(true);
      await exitInfluencer(influencerId);
      console.log("Influencer deleted successfully");
      await refreshUserData();
    } catch (error) {
      console.error("Failed to delete influencer:", error);
      alert("인플루언서 탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setLoggedInUser(null);
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const isInfluencer = Boolean(user?.influencer?.banner_picture);

  return (
    <Box
      sx={{
        position: "relative",
      }}>
      <Card sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "18px",
        boxShadow: "none"
      }}>
        <Banner bannerPicture={user?.influencer?.banner_picture || null} />
        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,
            paddingTop: isInfluencer ? 6 : 3,
            paddingBottom: 6,
            padding: "0px 10%",
          }}
        >
          <UserInfo
            username={user?.username || "Unknown"}
            aboutMe={user?.about_me || ""}
            profilePicture={user?.profile_picture || ""}
            isInfluencer={isInfluencer}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3%",
              gap: 1
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "프로필 편집"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "로그아웃"}
            </Button>
          </Box>

        </CardContent>
        {!isInfluencer && (
          <InfluencerButton onClick={() => setIsModalOpen(true)} />
        )}
        {isInfluencer && (
          <Button
            onClick={() => handleExitInfluencer(user?.influencer?.id)}
            disabled={loading}
            variant="text"
            color="primary"


            sx={{ margin: 2, marginLeft: "6%" }}
          >
            {loading ? <CircularProgress size={24} /> : "인플루언서 탈퇴"}
          </Button>
        )}
      </Card>
      <InfluencerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        username={user?.username || "Unknown"}
        userId={user?.id || 0} // userId를 전달
      />
    </Box>
  );
};

export default MyInfo;
