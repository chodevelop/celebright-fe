import React from "react";
import { Box, Avatar, Typography, Chip, Button, CardContent, Card } from "@mui/material";
import { log } from "console";
import { useInitializeUser } from "../../hooks/homeFeed/useInitializeUser";

interface FollowCardProps {
  follow: {
    id: number;
    User: {
      username: string; profile_image?: string;
      profile_picture?: string;
      about_me?: string;
    };
    category?: string;
  };
  isSubscribed: boolean;
  subscriptions: { influencerId: number; productName: string }[];
  onMembershipClick: (influencerId: number) => void;
  onCardClick: (influencerId: number) => void;
}


const FollowCard: React.FC<FollowCardProps> = ({
  follow,
  isSubscribed,
  subscriptions,
  onMembershipClick,
  onCardClick,
}) => {
  const { loggedInUser } = useInitializeUser(); // 사용자 정보
  const subscription = subscriptions.find(
    (sub) => sub.influencerId === follow.id
  );

  return (
    <Box
      onClick={() => onCardClick(follow.id)} // 카드 클릭 이벤트
      sx={{
        // backgroundColor: "red",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer", // 카드 클릭 가능
        "&:hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar src={follow.User.profile_image || ""} alt={follow.User.username} />
        <Box sx={{
          width: "50%",
          marginLeft: 2,
          display: "flex",
          whiteSpace: "nowrap",
          flexDirection: "row"
        }}>
          <Typography sx={{
            color: "#474747",
            fontSize: "16px",
            fontWeight: "bold",
            marginRight: "15%",
          }}>{follow.User.username}</Typography>
          <Chip label={follow.category || "미정"} color="primary" size="small" variant="outlined" />
        </Box>
        {isSubscribed && subscription && (
          <Typography color="green" sx={{ marginTop: 1 }}>
            가입한 멤버십 : {subscription.productName}
          </Typography>
        )}
      </Box>
      {loggedInUser &&
        <Button
        variant="contained"
        size="small"
        sx={{
          right: "5px",
          borderRadius: "50px"
        }}
        onClick={(e) => {
          e.stopPropagation(); // 부모 클릭 이벤트 중단
          onMembershipClick(follow.id);
        }}
        >
        멤버십
      </Button>
      }
    </Box>

  );
};

export default FollowCard;
