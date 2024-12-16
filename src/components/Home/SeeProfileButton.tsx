import React from "react";
import { Box, Button } from "@mui/material";

const SeeProfileButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      size="small"
      sx={{
        position: "relative",
        width: "75px",
        height: "24px",
        background: "linear-gradient(180deg, #9252E7 33.82%, #FF3CE5 100%)", // 전체 그라데이션 처리
        borderRadius: "12px",
        boxShadow: "none", // Hover 상태에서도 boxShadow 제거
        "&:hover": {
          boxShadow: "none", // Hover 상태에서도 boxShadow 제거
        },
        "&:active": {
          boxShadow: "none", // 클릭 상태에서도 boxShadow 제거
        },
      }}
      // onClick={

      // }
      >
      <Box sx={{
        position: "absolute",
        top: 1,
        left: 1,
        width: "73px",
        height: "22px",
        background: "rgba(249, 249, 249, 1)", // 전체 그라데이션 처리
        borderRadius: "12px",
        "&:hover": {
          background: "rgba(249, 249, 249, 0.9)", // 글씨 배경 톤다운
        },
        "&:active": {
          background: "rgba(249, 249, 249, 0.7)", // 글씨 배경 톤다운
        },
      }}>
        <Box sx={{
          justifyContent: "center",
          textAlign: "center",
          color: "transparent",
          background: "linear-gradient(180deg, #9252E7 33.82%, #FF3CE5 100%)", // 전체 그라데이션 처리
          backgroundClip: "text",
          WebkitBackgroundClip: "text"
        }}>
          프로필 보기
        </Box>
      </Box>
    </Button>
  );
};

export default SeeProfileButton;