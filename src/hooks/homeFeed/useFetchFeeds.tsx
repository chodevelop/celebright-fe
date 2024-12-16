import { useEffect, useState } from "react";
import axios from "axios";
import { Feed, FeedPrototype } from "../../types/homeFeedType";
import { processFeeds } from "../../util/homeFeedApi";
import { useLike } from "./useLike";
import { useLoggedInUserStore } from "../../store/authStore";

export const useFetchFeeds = (initialFeedType: "all" | "following" = "all") => {
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInUser);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [queue, setQueue] = useState<number[]>([]);
  const { likeStatus, handleLikeClick } = useLike(feeds);
  const limit = 4;
  const [isLoading, setIsLoading] = useState(false);
  const [feedType, setFeedType] = useState<"all" | "following">(initialFeedType);

  // 피드를 불러오는 함수
  const fetchFeeds = async (currentQueue: number[]): Promise<{ processedFeeds: Feed[]; newHasMore: boolean }> => {
    if (currentQueue.length === 0) {
      console.log("queue is empty");
      return { processedFeeds: [], newHasMore: false };
    }

    console.log("fetching feeds", currentQueue);
    setIsLoading(true);
    const endpoint = feedType === "following" ? "getfollowingfeeds" : "getfeeds";

    try {
      const response = await axios.post(`http://localhost:4000/homefeed/${endpoint}`, {
        queue: currentQueue,
        limit,
        userId: loggedInUser?.userId,
      });

      const newFeedsPrototype: FeedPrototype[] = response.data;
      const processedFeeds = await processFeeds(newFeedsPrototype, loggedInUser);

      const newQueue = currentQueue.slice(limit);
      setQueue(newQueue); // 상태 업데이트

      return { processedFeeds, newHasMore: processedFeeds.length >= limit };
    } catch (error) {
      console.error("Error fetching feeds:", error);
      return { processedFeeds: [], newHasMore: false };
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 큐를 설정하는 함수
  const initFeeds = async (): Promise<number[]> => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/homefeed/getFeedsQueue", {
        userId: loggedInUser?.userId,
        userFollowList: loggedInUser?.follow,
      });
      const initQueue = response.data as number[];
      console.log("initial queue", initQueue);
      setQueue(initQueue); // 상태 업데이트
      return initQueue; // 즉시 반환
    } catch (error) {
      console.error("Error initializing feeds:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // 피드를 초기화하는 함수
  const initializeFeeds = async () => {
    const initialQueue = await initFeeds();
    if (initialQueue.length > 0) {
      const { processedFeeds, newHasMore } = await fetchFeeds(initialQueue); // 로컬 queue 사용
      setFeeds(processedFeeds);
      setHasMore(newHasMore);
    }
  };

  // 로그인 상태 및 피드 타입 변경 시 초기 데이터 로드
  useEffect(() => {
    initializeFeeds();
  }, [loggedInUser, feedType]);

  // 추가 데이터 로드
  const fetchMoreFeeds = async () => {
    if (isLoading || !hasMore || queue.length === 0) return;

    const { processedFeeds, newHasMore } = await fetchFeeds(queue);
    setFeeds((prevFeeds) => [...prevFeeds, ...processedFeeds]);
    setHasMore(newHasMore);
  };

  // 좋아요 상태 업데이트
  useEffect(() => {
    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) => {
        if (likeStatus[feed.id] !== undefined) {
          const isLiked = likeStatus[feed.id];
          const updatedLikes = isLiked
            ? feed.likes.includes(loggedInUser!.userId)
              ? feed.likes
              : [...feed.likes, loggedInUser!.userId]
            : feed.likes.filter((id) => id !== loggedInUser?.userId);

          return { ...feed, likes: updatedLikes };
        }
        return feed;
      })
    );
  }, [likeStatus]);

  // 피드 타입 변경
  const changeFeedType = (type: "all" | "following") => {
    setFeedType(type);
    setFeeds([]);
    setQueue([]);
    setHasMore(true);

    initFeeds().then((initQueue) => {
      if (initQueue.length > 0) {
        fetchFeeds(initQueue).then(({ processedFeeds, newHasMore }) => {
          setFeeds(processedFeeds);
          setHasMore(newHasMore);
        });
      }
    });
  };

  return {
    feeds,
    hasMore,
    fetchMoreFeeds,
    isLoading,
    likeStatus,
    handleLikeClick,
    fetchFeeds,
    setFeeds,
    setHasMore,
    changeFeedType,
    queue, // queue 반환
  };
};