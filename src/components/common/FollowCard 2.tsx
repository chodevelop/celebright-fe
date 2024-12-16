import React from "react";
import { Box, Avatar, Typography, Chip, Button } from "@mui/material";

interface FollowCardProps {
  follow: any; // follow 데이터 타입 정의 필요
  isSubscribed: boolean; // 가입 여부
  subscriptions: any; // 가입 정보 배열
  onMembershipClick: (influencerId: number) => void;
}

const FollowCard: React.FC<FollowCardProps> = ({
    follow,
    isSubscribed,
    subscriptions,
    onMembershipClick,
  }) => {
    const subscription = subscriptions.find(
        (sub:any) => sub.influencerId === follow.id
      );

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={follow.User.profile_image} alt={follow.User.username} />
          <Box sx={{ marginLeft: 2 }}>
            <Typography variant="h6">{follow.User.username}</Typography>
            <Chip label={follow.category} color="primary"/>
            {isSubscribed && (
            <Typography color="green" sx={{ marginTop: 1 }}>
            가입한 멤버십 : {subscription.productName}
          </Typography>
            )}
          </Box>
        </Box>
        <Button
        variant="contained"
        size="large"
        onClick={() => onMembershipClick(follow.id)}
      >
        멤버십
      </Button>
      </Box>
    );
  };
  

export default FollowCard;
