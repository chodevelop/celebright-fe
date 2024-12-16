import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
  Modal,
  CircularProgress,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfilePopover from "./ProfilePopover";
import FollowButton from "./FollowButton";
import LikesButton from "./LikesButton";
import defaultProfile from "../../assets/defaultProfile.png";
import LoginRequiredAlert from "./LoginRequiredAlert";
import { Feed } from "../../types/homeFeedType";
import { useInitializeUser } from "../../hooks/homeFeed/useInitializeUser";
import { useFetchFeeds } from "../../hooks/homeFeed/useFetchFeeds";
import { useFollow } from "../../hooks/homeFeed/useFollowingStatus";
import { useModal } from "../../hooks/useModal";
import ChatPage from "../Feed/Modal/FeedModal";
import FollowModal from "../MyPage/FollowModal";
import FeedTypeToggle from "./FeedTypeToggle";

interface HomeFeedProps extends BoxProps { }

const HomeFeed: React.FC<HomeFeedProps> = () => {
  const [modalType, setModalType] = useState<"membership" | "profile" | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<
    string | null
  >(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [feedType, setFeedType] = useState<"all" | "following">("all");

  const handleFeedTypeChange = (type: "all" | "following") => {
    if (type === "following" && !loggedInUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    changeFeedType(type);
    window.scrollTo(0, 0); // 스크롤 맨 위로 올리기
  };

  const handleOpenModal = (id: string, type: "membership" | "profile") => {
    setSelectedInfluencerId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfluencerId(null);
    setModalType(null);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const { open: openFeedModal } = useModal(ChatPage);
  const { loggedInUser } = useInitializeUser(); // 사용자 정보
  const { feeds, hasMore, fetchMoreFeeds, isLoading, likeStatus, handleLikeClick, fetchFeeds, setFeeds, setHasMore, changeFeedType, queue } = useFetchFeeds("all"); // 피드 정보
  const { followingStatus, toggleIsFollowingInfluencer } = useFollow(feeds);

  // Popover 관련 상태
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);

  useEffect(() => {
    // 페이지 로드 시 스크롤 위치 초기화
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchInitialFeeds = async () => {
      const { processedFeeds, newHasMore } = await fetchFeeds(queue);
      setFeeds(processedFeeds);
      setHasMore(newHasMore);
    }
    fetchInitialFeeds();
  }, [loggedInUser, feedType]);

  useEffect(() => {
    if (loggedInUser) {
      const fetchInitialFeeds = async () => {
        const { processedFeeds, newHasMore } = await fetchFeeds(queue);
        setFeeds(processedFeeds);
        setHasMore(newHasMore);
      }
      fetchInitialFeeds();
    }
  }, [loggedInUser]);

  const handleImageClick = (
    event: React.MouseEvent<HTMLElement>,
    feed: Feed,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeed(feed); // 선택된 feed 초기화
  };

  const handlePopoverClose = () => {
    setSelectedFeed(null); // 선택된 feed 초기화
    setAnchorEl(null);
  };

  const visibleRange = (visibilityLevel: number) => {
    switch (visibilityLevel) {
      case 3:
        return "멤버십 공개";
      case 2:
        return "팔로워 공개";
      case 1:
        return "전체 공개";
      default:
        return "공개 범위 미설정";
    }
  };

  const dateFormate = (input: any) => {
    const date = new Date(input);
    const formattedDate = `${date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} ${date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
    return formattedDate;
  };

  return (
    <>
      <LoginRequiredAlert />
      <FeedTypeToggle onFeedTypeChange={handleFeedTypeChange} />
      {isLoading && feeds.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={feeds.length}
          next={fetchMoreFeeds}
          hasMore={hasMore}
          loader={isLoading && <Typography>로딩 중...</Typography>}
          endMessage={<Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress />
          </Box>}
          scrollThreshold={0.8}
        >
          <Box
            style={{
              padding: "10% 5%",
              paddingTop: "32px",
            }}
          >
            {feeds.map((feed) => (
              <Card
                key={feed.id + Math.random()}
                style={{
                  marginBottom: "20px",
                  padding: "36px",
                  border: "none",
                  borderRadius: "18px",
                  boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 18px 0px",
                }}
                sx={{
                  position: "relative",
                }}
              >
                {/* 프로필 아이콘 (좌상단) */}
                <Box
                  sx={{
                    backgroundColor: "white",
                    paddingRight: "12px",
                    paddingBottom: "12px",
                    display: "flex",
                  }}
                >
                  <Avatar
                    src={feed.profile_picture || defaultProfile}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "2px solid #A88EFF", // 테두리 추가
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleOpenModal(String(feed.influencer_id), "profile");
                    }}
                  />
                  <Box sx={{ marginLeft: "12px" }}>
                    <Box
                      sx={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}
                    >
                      {feed.username}
                    </Box>
                    <Box sx={{ fontSize: "14px", color: "#888" }}>
                      {dateFormate(feed.modified_at)}
                    </Box>
                  </Box>
                </Box>
                {/* 게시물 이미지 */}
                <CardMedia
                  component="img"
                  image={feed.images[0]} //문자열로 가져오므로 JSON Parse로 문자열 -> 배열로 전환해야 함!(중요!!!!)
                  alt={`${feed.username}의 게시물`}
                  style={{
                    minHeight: "100px",
                    borderRadius: "8px",
                    marginBottom: "0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    sessionStorage.setItem("page", `${feed.id}`);
                    console.log(feed.id);
                    openFeedModal();
                  }}
                />
                {/* 게시물 내용 */}
                <CardContent
                  sx={{
                    padding: "16px 0px 0px 0px",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={1.5}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-start" // 두 요소를 양 끝에 배치
                      alignItems="center" // 세로 정렬
                      gap={0.5}
                    >
                      <LikesButton
                        isLiking={likeStatus[feed.id]}
                        onToggleLike={() => handleLikeClick(feed)} // 상태 변경 함수 전달
                      />
                      <Typography
                        variant="body1"
                        color="textPrimary"
                        style={{
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {feed.likes?.length || 0} Brights
                      </Typography>
                    </Box>
                    <FollowButton
                      isFollowing={followingStatus[feed.influencer_id] || 0}
                      onToggleFollow={() => toggleIsFollowingInfluencer(feed)} // 상태 변경 함수 전달
                    />
                  </Box>
                  <Typography variant="body1" marginTop="8px">
                    <span style={{ color: "primary", fontWeight: "bold" }}>
                      {feed.username}
                    </span>
                    {"    "}
                    {feed.content}
                  </Typography>
                  <Typography
                    variant="body1"
                    marginBottom="8px"
                    color="textDisabled"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      sessionStorage.setItem("page", `${feed.id}`);
                      console.log(feed.id);
                      openFeedModal();
                    }}
                  >
                    {"댓글 보기..."}
                  </Typography>
                </CardContent>
                {/* 댓글 입력 */}
                {/* {loggedInUser &&
                  <Box display="flex" alignItems="center" gap="8px" marginTop="0">
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="댓글 달기..."
                    variant="standard"
                    sx={{
                      "& .MuiInput-underline:before": {
                        // borderBottom: "none", // 기본 밑줄 스타일 제거
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none", // 포커스 시 밑줄 스타일 제거
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none", // 호버 시 밑줄 스타일 제거
                      },
                    }}
                    />
                  <Button variant="outlined" color="primary" size="small">
                    전송
                  </Button>
                </Box>
                  } */}
              </Card>
            ))}
            <FollowModal
              open={isModalOpen}
              modalType={modalType}
              influencerId={Number(selectedInfluencerId) || null}
              onClose={handleCloseModal}
            />
            <Modal
              open={!!selectedImage}
              onClose={handleCloseImageModal}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={selectedImage || ""}
                // src={selectedImage && selectedImage.trim() !== '' ? selectedImage : 'http://picsum.photos/300/300'}
                alt="large image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "http://picsum.photos/300/300";
                }}
                style={{ maxWidth: "90%", maxHeight: "90%" }}
              />
            </Modal>
          </Box>
        </InfiniteScroll>
      )}
      {selectedFeed && anchorEl && (
        <ProfilePopover
          anchorEl={anchorEl}
          currentFeed={selectedFeed}
          onClose={handlePopoverClose}
          isFollowing={followingStatus[selectedFeed.influencer_id] || 0}
          onToggleFollow={() => toggleIsFollowingInfluencer(selectedFeed)} // 상태 변경 함수 전달
        />
      )}
    </>
  );
};

export default HomeFeed;
