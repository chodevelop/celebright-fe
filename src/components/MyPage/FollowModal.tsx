import React from "react";
import { Modal, Backdrop, Fade, Box } from "@mui/material";
import MembershipTab from "./MembershipTab";
import UserProfile from "../MyPage/UserProfile";

interface FollowModalProps {
  open: boolean;
  modalType: "membership" | "profile" | null;
  influencerId: number | null;
  onClose: () => void;
  onSubscriptionUpdate?: () => void;
  onFollowStatusChange?: (influencerId: string, isFollowing: boolean) => void; // 새로 추가
}

const FollowModal: React.FC<FollowModalProps> = ({
  open,
  modalType,
  influencerId,
  onClose,
  onSubscriptionUpdate = () => { }, // 기본값 설정
  onFollowStatusChange = () => { }, // 기본값 설정
}) => (
  <Modal
    open={open}
    onClose={onClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={open}>
      <Box
        sx={{

          position: "absolute",
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
          width: modalType === "membership" ? "50vw" : "25vw",
          maxWidth: modalType === "membership" ? "1200px" : null,
          height: "auto",
          bgcolor: modalType === "membership" ? "background.paper" : null,
          boxShadow: 24,
          borderRadius: "12px",
          padding: modalType === "membership" ? 4 : "0px",
          outline: "none",

          display: "flex",         // Flexbox 사용
          justifyContent: "center", // 가로 방향 가운데 정렬
          alignItems: "center",     // 세로 방향 가운데 정렬

        }}
      >
        {modalType === "membership" && influencerId && (
          <MembershipTab
            influencerId={influencerId}
            onSubscriptionUpdate={onSubscriptionUpdate}
          />
        )}
        {modalType === "profile" && influencerId && (
          <UserProfile
            influencerId={influencerId.toString()}
            onFollowStatusChange={onFollowStatusChange} // Prop 전달
          />
        )}
      </Box>
    </Fade>
  </Modal>
);

export default FollowModal;
