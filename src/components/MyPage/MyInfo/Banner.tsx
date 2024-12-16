import React from "react";
import { Box } from "@mui/material";

interface BannerProps {
  bannerPicture: string | null;
}

const Banner: React.FC<BannerProps> = ({ bannerPicture }) => {
  if (!bannerPicture) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "200px", // 배너 높이를 적당히 설정
        backgroundImage: `url(${bannerPicture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
        },
      }}
    />
  );
};

export default Banner;
