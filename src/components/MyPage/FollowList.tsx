import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { Follow, Subscription } from "../../types/myPage";
import { useParams } from "react-router-dom";
import FollowModal from "./FollowModal";
import { fetchUserFollowings, fetchUserSubscriptions } from "../../util/myPageApi";
import FollowCardList from "./FollowCardList";

const FollowList: React.FC = () => {
  const [follows, setFollows] = useState<Follow[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<number | null>(
    null
  );
  const [modalType, setModalType] = useState<"membership" | "profile" | null>(null);
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const [followsData, subscriptionsData] = await Promise.all([
          fetchUserFollowings(userId),
          fetchUserSubscriptions(userId),
        ]);
        setFollows(followsData);
        setSubscriptions(subscriptionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleOpenModal = (influencerId: number, type: "membership" | "profile") => {
    setSelectedInfluencerId(influencerId);
    setModalType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInfluencerId(null);
    setModalType(null);
  };

  const handleSubscriptionUpdate = async () => {
    if (!userId) return;
    try {
      const updatedSubscriptions = await fetchUserSubscriptions(userId);
      setSubscriptions(updatedSubscriptions);
    } catch (error) {
      console.error("Error updating subscriptions:", error);
    }
    handleCloseModal();
  };

  if (follows.length === 0) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          팔로우한 인플루언서가 없습니다.
        </Typography>
      </Container>
    );
  }

  return (

    <Box
      sx={{
        padding: "0px 36px",
        marginBottom: "5%",
        marginTop: "5%",
      }}
    >
      <FollowCardList
        follows={follows}
        subscriptions={subscriptions}
        onMembershipClick={(influencerId) =>
          handleOpenModal(influencerId, "membership")
        }
        onCardClick={(influencerId) => handleOpenModal(influencerId, "profile")}
      />
      <FollowModal
        open={openModal}
        modalType={modalType}
        influencerId={selectedInfluencerId}
        onClose={handleCloseModal}
        onSubscriptionUpdate={handleSubscriptionUpdate}
      />
    </Box>

  );
};

export default FollowList;
