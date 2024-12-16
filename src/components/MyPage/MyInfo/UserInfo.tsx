import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface UserInfoProps {
  username: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  isInfluencer: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ username, aboutMe, profilePicture, isInfluencer }) => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        marginTop: isInfluencer ? "-15%" : "10%" // 배너와 겹치도록 조정
      }}
    >
      <Avatar
        src={profilePicture || ""}
        alt={username || "User"}
        sx={{
          width: 150,
          height: 150,
          border: "5px solid white",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />
    </Box>
    <Typography
      variant="h6"
      fontWeight="bold"
      textAlign="center"
      sx={{ marginTop: 2, marginBottom: 1, color: "#333" }}
    >
      {username || "닉네임 없음"}
    </Typography>
    <Typography variant="body1" color="textSecondary" textAlign="center"
      sx={{
        fontSize: "14px"
      }}
    >
      {aboutMe || "소개가 없습니다."}
    </Typography>
  </>
);

export default UserInfo;
