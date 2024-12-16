import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BrightIcon from "../../common/BrightIcon";

interface InfluencerButtonProps {
  onClick: () => void;
}

const InfluencerButton: React.FC<InfluencerButtonProps> = ({ onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      textAlign={hover ? "left" : "center"}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: hover ? "center" : "center",
        width: hover ? "180px" : "50px",
        height: "50px",
        backgroundColor: hover ? "primary.main" : "none",
        color: "white",
        borderRadius: "25px",
        transition: "width 0.3s ease, background-color 0.3s ease",
        cursor: "pointer",
        boxShadow: hover ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
        padding: hover ? "0 10px" : "0",
      }}
    >
      <BrightIcon />
      {hover && (
        <Typography
          variant="button"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            marginLeft: 1,
          }}
        >
          인플루언서 되기
        </Typography>
      )}
    </Box>
  );
};

export default InfluencerButton;