import { Box, Button, Container, Typography } from "@mui/material";
import ChatPage from "../components/Feed/Modal/FeedModal";
import { useModal } from "../hooks/useModal";
import { Link } from "react-router-dom";
import HomeFeed from "../components/Home/HomeFeed";

const Main = () => {
  const { open: openFeedModal } = useModal(ChatPage);
  return (
    <>
      <HomeFeed />
    </>
  );
};

export default Main;
