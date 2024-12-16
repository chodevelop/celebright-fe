import React from "react";
import { Box, Typography, Popover } from "@mui/material";
import FollowButton from "./FollowButton"
import SeeProfileButton from "./SeeProfileButton";
import { Feed } from "../../types/homeFeedType";

interface ProfilePopoverProps {
  anchorEl: HTMLElement | null;
  currentFeed: Feed | null; // Feed 타입 그대로 사용
  onClose: () => void;
  isFollowing: number; // 현재 팔로우 상태
  onToggleFollow: () => void; // 팔로우 상태를 변경하는 함수
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({ anchorEl, currentFeed, onClose, isFollowing, onToggleFollow }) => {
  if (!currentFeed) return null; // currentFeed가 없으면 렌더링하지 않음
  const open = Boolean(anchorEl && currentFeed);

  const handleUsernameClick = () => {
    console.log("Username clicked");
    console.log(`ProfilePopover: `, currentFeed)
    // 링크 이동이나 다른 동작 추가 가능
  };

  return (<>
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      slots={{
        paper: Box, // Paper 역할을 Box로 커스터마이징
      }}
      slotProps={{
        paper: {
          sx: {
            position: "relative",
            padding: "7px 15px 7px 20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
            overflow: "visible",
            display: "inline-flex", // 내용물에 맞게 크기 조정
            flexDirection: "column", // 수직 정렬
            alignItems: "center", // 가로 중앙 정렬
            justifyContent: "center", // 세로 중앙 정렬
            boxSizing: "border-box", // 패딩 포함 크기 계산
            // border: "1px solid rgba(0, 0, 0, 0.2)", // 테두리 추가
            outline: "none", // 포커스 스타일 제거
            "&::before": {
              content: '""',
              position: "absolute",
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "10px 10px 10px 0", // 삼각형 크기 조정
              borderColor: "transparent #f9f9f9 transparent transparent", // 삼각형 색상
              left: "-10px", // 삼각형 위치 조정 (프로필 방향)
              top: "50%",
              transform: "translateY(-50%)",
            },
          }
        }
      }}
    >

      <Box
        sx={{
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* 유저명과 계정명 */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            noWrap
            sx={{
              cursor: "pointer", // 클릭 가능하게 보이도록 포인터 스타일 추가
              "&:hover": {
                textDecoration: "underline", // 호버 시 강조 효과
              },
            }}
            onClick={handleUsernameClick} // 클릭 이벤트 추가
          >
            {currentFeed.username}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            @{currentFeed?.username?.toLowerCase() || "Unknown"}
          </Typography>
          {/* 버튼 그룹 */}
          <Box sx={{ display: "flex", gap: "8px", paddingTop: "10px" }}>
            <SeeProfileButton />
            <FollowButton
              isFollowing={isFollowing}
              onToggleFollow={onToggleFollow}
            />
          </Box>
        </Box>
      </Box>
    </Popover >
  </>
  );
};

export default ProfilePopover;


