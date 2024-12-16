import { create, StateCreator } from 'zustand';

// FeedState 인터페이스 정의 (User 관련 제거)
interface FeedState {
  feed: boolean | null;
  setFeed: (feed: boolean | null) => void; // feed 상태를 업데이트하는 함수
}

// 상태 관리 로직
const createFeedApiCallStore: StateCreator<FeedState> = (set) => ({
  feed: null, // 초기 상태는 null
  setFeed: (feed) => set({ feed }), // feed 상태 업데이트
});

// Zustand 스토어 생성
export const useFeedStore = create<FeedState>(createFeedApiCallStore);
