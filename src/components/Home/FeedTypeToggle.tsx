import React, { useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { useLoggedInUserStore } from "../../store/authStore";

interface FeedTypeToggleProps {
  onFeedTypeChange: (type: "all" | "following") => void;
}

const ToggleContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 25,
  left: "46%",
  transform: "translateX(-50%)",
  zIndex: 100,
  margin: "0 auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px 0",
  opacity: 0.2, // 기본 반투명
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1, // 마우스 오버 시 불투명
  },
}));

const ToggleWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: "18px", // 홈 피드 카드와 일치하는 borderRadius
  padding: "6px",
  gap: "8px",
  width: "280px",
  boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 18px 0px", // 홈 피드 카드와 유사한 그림자
}));

const ToggleItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "disabled",
})<{ active?: boolean; disabled?: boolean }>(({ theme, active, disabled }) => ({
  padding: "8px 16px",
  borderRadius: "18px", // 홈 피드 카드와 일치하는 borderRadius
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.3s ease",
  backgroundColor: active ? "#A88EFF" : "transparent", // 보라색 계열 조정
  color: active ? "white" : disabled ? "#E0E0E0" : "#A88EFF",
  fontWeight: "bold",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: active ? "#A88EFF" : disabled ? "transparent" : "#E0E0E0", // 호버 상태 색상 조정
  },
}));

const FeedTypeToggle: React.FC<FeedTypeToggleProps> = ({
  onFeedTypeChange,
}) => {
  const [feedType, setFeedType] = useState<"all" | "following">("all");
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInUser);

  const handleFeedTypeChange = (newFeedType: "all" | "following") => {
    if (newFeedType === "following" && !loggedInUser) {
      return;
    }
    setFeedType(newFeedType);
    onFeedTypeChange(newFeedType);
  };

  return (
    <ToggleContainer>
      <ToggleWrapper>
        <ToggleItem
          active={feedType === "all"}
          onClick={() => handleFeedTypeChange("all")}
        >
          전체 피드
        </ToggleItem>
        <ToggleItem
          active={feedType === "following"}
          disabled={!loggedInUser}
          onClick={() => handleFeedTypeChange("following")}
        >
          팔로우 피드
        </ToggleItem>
      </ToggleWrapper>
    </ToggleContainer>
  );
};

export default FeedTypeToggle;
