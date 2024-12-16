import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchUserLikes } from "../../util/myPageApi";
import { imageParse } from "../../util/imageParse";
import { useFetchData } from "../../hooks/useFetchData";
import { ImageGrid } from "../common/ImageGrid";
import BrightIcon from "../common/BrightIcon";

const LikeList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  // const { data: likes, error } = useFetchData(fetchUserLikes, userId);
  const { data: likes, error } = useFetchData(fetchUserLikes, userId);

  if (error) {
    return <Typography variant="body1">Error loading likes</Typography>;
  }

  // 데이터가 없는 경우 처리
  if (!likes || likes.length === 0) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          좋아요 한 게시물이 없습니다.
        </Typography>
      </Container>
    );
  }

  // 데이터가 있는 경우 처리
  const items = likes.map((like) => ({
    id: like.id,
    imageUrl: imageParse(like.images),
    overlayContent: (
      <>
        <Box sx={{
          padding: 1, borderRadius: 1,
          display: "flex",
          alignItems: "center",
        }}>
          <BrightIcon
          />
          <Typography variant="h6">
            {JSON.parse(like.likes).length}
          </Typography>
        </Box>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2, // 최대 2줄로 제한
            fontSize: "10px",
          }}
        >{like.content}</Typography>
      </>
    ),
  }));

  return (
    <Box
      sx={{
        padding: "0px 36px",
        marginBottom: "5%",
      }}
    >
      <ImageGrid items={items} />
    </Box>
    // <Container maxWidth="md" sx={{ marginTop: 4 }}>
    //   <ImageGrid items={items} />
    // </Container>
  );
};

export default LikeList;
