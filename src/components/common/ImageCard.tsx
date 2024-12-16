import { Box } from "@mui/material";

interface ImageCardProps {
  imageUrl: string;
  overlayContent: React.ReactNode;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, overlayContent }) => (
  <Box
    sx={{
      position: "relative",
      width: "100%",
      paddingBottom: "100%",
      overflow: "hidden",
      borderRadius: 2,
      "&:hover img": {
        filter: "brightness(0.7)",
      },
      "&:hover .overlay": {
        opacity: 1,
      },
    }}
  >
    <Box
      component="img"
      src={imageUrl}
      alt="Image"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "filter 0.3s ease",
        filter: "brightness(1)",
      }}
    />
    <Box
      className="overlay"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.3s ease",
      }}
    >
      {overlayContent}
    </Box>
  </Box>
);
