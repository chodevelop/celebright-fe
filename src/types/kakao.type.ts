declare global {
    interface Window {
      Kakao: {
        init: (key: string) => void;
        isInitialized: () => boolean;
        Auth: {
          login: () => Promise<{ access_token: string }>;
          authorize: (options: { redirectUri: string }) => void; // authorize 메서드 추가
        };
      };
    }
  }
  
  export {};