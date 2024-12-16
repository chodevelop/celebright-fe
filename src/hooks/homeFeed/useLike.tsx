import { useEffect, useState } from "react";
import { Feed, LikeStatus } from "../../types/homeFeedType";
import { updateFeedLikes } from "../../util/homeFeedApi";
import { useLoggedInUserStore, useLoginAlertStore } from "../../store/authStore";

export const useLike = (
  feeds: Feed[],
  initialStatus: LikeStatus = {}
) => {
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInUser);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>(initialStatus); //로그인된 유저가 피드에 노출된 인플루언서의 팔로워 여부를 저장하는 state
  const setOpenLoginAlert = useLoginAlertStore((state) => state.setOpenLoginAlert);

  const handleLikeClick = async (feed: Feed) => {
    try {
      if (!loggedInUser?.userId) {
        console.error("로그인된 사용자가 없습니다.");
        setOpenLoginAlert(true);
        return;
      }

      // 현재 feed.id에 대한 좋아요 상태를 토글
      const updatedLikeStatus = {
        ...likeStatus,
        [feed.id]: !likeStatus[feed.id], // 현재 값을 반전시킴
      };

      // 상태 업데이트
      setLikeStatus(updatedLikeStatus);

      // feed.likes 배열 업데이트
      const updatedFeedLikes = feed.likes.includes(loggedInUser.userId)
        ? feed.likes.filter((id) => id !== loggedInUser.userId) // 1. loggedInUser.userId가 있을 경우 제거
        : [...feed.likes, loggedInUser.userId]; // 2. 없을 경우 추가

      // 3. 배열 내부 숫자를 문자열로 변환
      const stringifiedUpdatedFeedLikes = updatedFeedLikes.map((id) => id.toString());
      // 서버에 업데이트된 데이터 전송
      await updateFeedLikes(feed.id, stringifiedUpdatedFeedLikes);
    } catch (error) {
      console.error("handleLikeClick error:", error);
    }
  };

  useEffect(() => {
    const updatedLikeStatus = feeds.reduce((acc, feed) => {
      acc[feed.id] =
        loggedInUser?.userId ? //loggedInUser 정보가 유효한지 확인
          feed.likes.includes(loggedInUser.userId) : //user 정보가 유효하면 likeStatus 정상적으로 받아옴
          false; //user 정보가 유효하지 않으면 likeStatus 싹 다 false로 설정
      return acc;
    }, { ...likeStatus });
    console.log("updatedLikeStatus:", updatedLikeStatus); //콘솔로그로 찍어보기
    setLikeStatus(updatedLikeStatus);
  }, [feeds.length]);

  return { likeStatus, handleLikeClick };
}