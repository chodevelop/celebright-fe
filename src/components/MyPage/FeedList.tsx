import React from "react";
import { Box, colors, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchUserFeeds } from "../../util/myPageApi";
import { imageParse } from "../../util/imageParse";
import { useFetchData } from "../../hooks/useFetchData";
import { ImageGrid } from "../common/ImageGrid";
import BrightIcon from "../common/BrightIcon";

const FeedList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: feeds, error } = useFetchData(fetchUserFeeds, userId);

  if (error) {
    return <Typography variant="body1">Error loading feeds</Typography>;
  }

  if (feeds && Array.isArray(feeds) && feeds.length > 0) {
    console.log("feeds: ", feeds)
    const items = feeds.map((feed) => ({
      id: feed.id,
      imageUrl: imageParse(feed.images),
      overlayContent: (
        <>
          <Box sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            padding: 1,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
          }}>
            <BrightIcon />
            <Typography align="center" variant="h6"

            >{feed.likes ? feed.likes.length : 0}</Typography>
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
          >{feed.content}</Typography>
        </>
      ),
    } 
  ));

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
  } else {
    return (<Typography variant="h6" color="textSecondary">
      작성한 피드가 없습니다.
    </Typography>)
  }
};

export default FeedList;
