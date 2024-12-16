import React from "react";
import { Box, Grid } from "@mui/material";
import { Follow, Subscription } from "../../types/myPage";
import FollowCard from "../common/FollowCard";
import NewFollowCard from "../common/NewFollowCard";

interface FollowCardListProps {
  follows: Follow[];
  subscriptions: Subscription[];
  onMembershipClick: (influencerId: number) => void;
  onCardClick: (influencerId: number) => void;
}

const FollowCardList: React.FC<FollowCardListProps> = ({
  follows,
  subscriptions,
  onMembershipClick,
  onCardClick,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
    }}
  >
    {follows.map((follow, index) => {
      const isSubscribed = subscriptions.some(
        (sub) => sub.influencerId === follow.id
      );

      return (

        <Box
          sx={{
            width: "48%",
            margin: "1%"
          }}
        >
          <NewFollowCard
            follow={follow}
            isSubscribed={isSubscribed}
            subscriptions={subscriptions}
            onMembershipClick={onMembershipClick}
            onCardClick={onCardClick}
          />
        </Box>
      );
    })}
  </Box>
);

export default FollowCardList;
