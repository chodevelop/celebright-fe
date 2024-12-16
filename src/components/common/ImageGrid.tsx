import { Box } from "@mui/material";
import { ImageCard } from "./ImageCard";
import { useModal } from "../../hooks/useModal";
import ChatPage from "../Feed/Modal/FeedModal";

interface ImageGridProps {
  items: { id: string; imageUrl: string; overlayContent: JSX.Element }[];
}

export const ImageGrid: React.FC<ImageGridProps> = ({ items }) => {
  const { open: openModal } = useModal(ChatPage);

  const handleCardClick = (id: string) => {
    sessionStorage.setItem("page", id); // 선택된 아이템 ID 저장
    openModal(); // 모달 열기
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
        marginTop: 2,
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item.id)}
          style={{ cursor: "pointer" }} // 클릭 가능하게 설정
        >
          <ImageCard
            imageUrl={item.imageUrl}
            overlayContent={item.overlayContent}
          />
        </div>
      ))}
    </Box>
  );
};
