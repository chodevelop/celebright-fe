import React from "react";
import { Box, Avatar, Typography, Chip, Button, CardContent, Card } from "@mui/material";

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
  const subscription = subscriptions.find(
    (sub) => sub.influencerId === follow.id
  );

  return (
    <Box
      onClick={() => onCardClick(follow.id)} // 카드 클릭 이벤트
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        borderRadius: "16px",
        cursor: "pointer", // 카드 클릭 가능
        marginTop: "10px",
        "&:hover": { boxShadow: "0 4px 8px rgba(211, 151, 248, 0.336)" },
      }}
    >
      <Card
        sx={{
          minHeight: '300px', // 고정된 최소 높이 설정
          overflow: "visible",
          paddingTop: '25px',
          padding: "0 10px",
          borderRadius: '16px',
          height: "320px",
          // maxWidth: '360px',
          position: 'relative',
          boxShadow: 2,
          textAlign: 'center',
          width: "100%",
        }}
      >

        <Avatar
          src={follow.User.profile_picture || ""} alt={follow.User.username}
          sx={{
            width: 130,
            height: 130,
            marginTop: "20px",
            left: '50%',
            transform: 'translateX(-50%)',
            border: '4px solid white',
            zIndex: 1,
          }}
        />

        {isSubscribed && subscription ?

          <Chip
            onClick={(e) => {
              e.stopPropagation(); // 부모 클릭 이벤트 중단
              onMembershipClick(follow.id);
            }}

            label={isSubscribed && subscription ? "구독중: " + subscription.productName : null}
            color="primary"
            sx={{
              position: 'absolute',
              top: '-10px',
              right: '8px',
              borderRadius: '8px',
              zIndex: 2,
            }}
          />
          : null}

        <Chip
          label={follow.category || "미정"}
          variant="outlined"
          color="primary"
          sx={{
            position: "absolute",
            right: "10%",
            top: "52%",
            backgroundColor: "white",
            zIndex: "2",
            fontWeight: 'bold',
            borderRadius: '16px',
          }}
        />
        <CardContent>
          <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', mb: 1
          }}>
            <Typography
              fontSize="16px"
              color="#303030dd"
              fontWeight="bold">
              {follow.User.username}
            </Typography>


          </Box>


          <Box
            sx={{
              height: '40px',
              marginBottom: "10px"
            }}
          >

            <Typography variant="body2"
              sx={{
                color: "#6c6c6c",
                textAlign: "left",
                padding: "0 10px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,       // 원하는 최대 줄 수 (예: 2줄)
                overflow: "hidden",       // 넘치는 내용 숨기기
                textOverflow: "ellipsis", // 넘치는 부분을 ...으로 표시
              }}
            >
              {follow.User.about_me}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation(); // 부모 클릭 이벤트 중단
              onMembershipClick(follow.id);
            }}
          >

            {isSubscribed && subscription ? "멤버십 변경" : "멤버쉽 가입"}

          </Button>

        </CardContent>
      </Card>


    </Box >
  );
};

export default FollowCard;
