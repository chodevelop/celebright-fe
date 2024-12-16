import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { fetchFollow, fetchInfluencer } from "../../util/myPageApi";
import { getUserId } from "../../util/getUser";
import { CheckCircle } from "@mui/icons-material";

interface User {
  username: string;
  profile_picture?: string;
  about_me?: string;
}

interface Influencer {
  id: string;
  banner_picture?: string;
  category?: string;
  User: User;
  follower: string[];
}

interface UserProfileProps {
  influencerId: string;
  onFollowStatusChange?: (influencerId: string, isFollowing: boolean) => void; // 선택적 prop
}


const UserProfile: React.FC<UserProfileProps> = ({
  influencerId,
  onFollowStatusChange,
}) => {
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 사용자 ID 가져오기
  useEffect(() => {
    const currentUserId = getUserId();
    setUserId(currentUserId);
  }, []);

  // 인플루언서 데이터 가져오기
  const fetchAndSetInfluencer = useCallback(async () => {
    try {
      const data = await fetchInfluencer(influencerId);
      setInfluencer(data);

      // 팔로우 상태 업데이트
      if (userId) {
        setIsFollowing(data?.follower.includes(userId));
      }
    } catch (error) {
      console.error("Failed to fetch influencer:", error);
    }
  }, [influencerId, userId]);

  useEffect(() => {
    fetchAndSetInfluencer();
  }, [fetchAndSetInfluencer]);

  // 팔로우 상태 토글
  const handleFollowToggle = async () => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const updatedIsFollowing = await fetchFollow(userId, influencerId);
      setIsFollowing(updatedIsFollowing);

      // onFollowStatusChange가 존재할 경우에만 호출
      onFollowStatusChange?.(influencerId, updatedIsFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  return (
    // <Container

    //   maxWidth="md"
    //   sx={{

    //     backgroundImage: `url(${influencer?.banner_picture || ""})`,
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundRepeat: "no-repeat",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     padding: 4,
    //     position: "relative",
    //   }}
    // >
    //   <Card
    //     sx={{
    //       width: "100%",
    //       backgroundColor: "red",
    //       // backgroundColor: "rgba(255, 255, 255, 0.85)", // 반투명 카드 배경
    //       borderRadius: 4,
    //       boxShadow: 3,
    //       padding: 3,
    //     }}
    //   >
    //     <CardContent>
    //       <Grid container spacing={4} alignItems="center">
    //         {/* 프로필 이미지 */}
    //         <Grid
    //           item
    //           xs={12}
    //           sm={4}
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Avatar
    //             src={influencer?.User?.profile_picture || ""}
    //             alt={influencer?.User?.username || "User"}
    //             sx={{
    //               width: 150,
    //               height: 150,
    //               boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    //             }}
    //           />
    //         </Grid>

    //         {/* 유저 정보 및 버튼 */}
    //         <Grid item xs={12} sm={8}>
    //           <Typography
    //             variant="h5"
    //             fontWeight="bold"
    //             sx={{ marginBottom: 1 }}
    //           >
    //             {influencer?.User?.username || "닉네임 없음"}
    //           </Typography>
    //           <Typography
    //             variant="body1"
    //             color="textSecondary"
    //             sx={{ marginBottom: 2 }}
    //           >
    //             {influencer?.User?.about_me || "소개가 없습니다."}
    //           </Typography>

    //           <Stack direction="row" spacing={2} alignItems="center">
    //             <Chip
    //               label={influencer?.category || "카테고리 없음"}
    //               color="primary"
    //               size="medium"
    //             />
    //             {/* 팔로우/언팔로우 버튼 */}
    //             {userId && (
    //               <Button
    //                 variant="outlined"
    //                 color={isFollowing ? "secondary" : "primary"}
    //                 onClick={handleFollowToggle}
    //                 sx={{ textTransform: "none", fontWeight: "bold" }}
    //               >
    //                 {isFollowing ? "언팔로우" : "팔로우"}
    //               </Button>
    //             )}
    //           </Stack>
    //         </Grid>
    //       </Grid>
    //     </CardContent>
    //   </Card>
    // </Container>


    <Card
      sx={{

        width: "100%",
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 배경 이미지 */}
      <Box
        sx={{
          height: 150,
          backgroundImage: `url(${influencer?.banner_picture || 'https://via.placeholder.com/400x120'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <CardContent sx={{ textAlign: 'center', paddingTop: 4 }}>
        {/* 프로필 이미지 */}
        <Avatar
          src={influencer?.User?.profile_picture || 'https://via.placeholder.com/120'}
          alt={influencer?.User?.username || 'User'}
          sx={{
            width: 120,
            height: 120,
            margin: '-90px auto 10px',
            marginBottom: "5%",
            backgroundColor: "white",
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            border: '3px solid white',
          }}
        />

        {/* 유저 이름 */}
        <Typography variant="h6" fontWeight="bold">
          {influencer?.User?.username || '닉네임 없음'}
        </Typography>

        {/* 유저 소개 */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {influencer?.User?.about_me || '소개가 없습니다.'}
        </Typography>

        <Chip
          sx={{
            position: "absolute",
            zIndex: 2,
            right: "5%",
            top: "50%",
          }}
          variant="outlined" label={influencer?.category || '카테고리 없음'} color="primary" />
        {userId && (
          <Button
            variant={isFollowing ? "contained" : "outlined"}
            // color={isFollowing ? 'secondary' : 'primary'}
            color="primary"
            onClick={handleFollowToggle}
            sx={{
              textTransform: 'none',
              borderRadius: "16px",
              width: "85%"
            }}
          >
            {isFollowing ? '언팔로우' : '팔로우'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
