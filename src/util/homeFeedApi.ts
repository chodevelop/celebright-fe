import { jwtDecode } from "jwt-decode";
import { CurrentLoggedInUser, DecodedAccessToken, Feed, FeedPrototype, Product, UserPrototype } from "../types/homeFeedType";
import axios from "axios";

export const convertToStringArray = (fetchedData: any): string[] => {
  let convertedFetchedData: string[] = [];

  if (!fetchedData || fetchedData === "") return [];

  if (Array.isArray(fetchedData)) {
    convertedFetchedData = fetchedData as string[];
  } else if (typeof fetchedData === 'string') {
    convertedFetchedData = JSON.parse(fetchedData) as string[];
  } else {
    convertedFetchedData = [] as string[];
  }
  return convertedFetchedData;
};

export const fetchUser = async () => {
  try {
    const token = localStorage.getItem("user");
    if (!token) return null;

    const decoded = jwtDecode<DecodedAccessToken>(token);
    // console.log("accessToken으로 사용자 정보를 가져왔습니다:", decoded);

    const response = await axios.post("http://localhost:4000/homefeed/postcurrentloggedinuserinfo",
      { id: decoded.userId },// Body에 보낼 데이터
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } } // 추가 설정: 헤더
    );

    const userPrototypeData: UserPrototype = response.data;
    const currentLoggedInUser = mapToCurrentUser(decoded, userPrototypeData);

    return currentLoggedInUser;
  } catch (error) {
    console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
};

export const convertStringArrayToNumberArray = (stringArray: string[]): number[] => {
  const numberArray = stringArray.map((str) => {
    try {
      const num = parseInt(str);
      // console.log(num)
      return num;
    } catch (error) {
      return -1;//센티널 값 삽입(일반적으로 절대 나올 수 없는 값, 여기서는 0 미만의 정수로 설정)
    }
  }).filter((item) => item > 0);//센티널 값 필터

  return numberArray;
};

export const isProduct = (obj: any): obj is Product => {
  return "id" in obj && "title" in obj && "price" in obj;
};

//역직렬화하면 배열 내부에 있는 값까지 싹 다 객체로 복원될 줄은 몰랐음...json.parse() 성능 확실하구만...
export const convertObjectArrayToProductArray = (objectArray: object[] | string[]): Product[] => {
  const resultArray: Product[] = objectArray.map((obj) => {
    try {
      if (isProduct(obj)) return obj; // 유효한 Product 객체 반환
      // console.warn(`Invalid Product format: ${obj}, using default values.`);
      return null; // 유효하지 않은 값이 들어감을 명시함
    } catch (error) {
      // Handle JSON parsing errors
      console.error(`Failed to parse string: "${obj}". Error: ${error}`);
      return null; // 유효하지 않은 값이 들어감을 명시함
    }
  }).filter((item: Product | null): item is Product => item !== null); // null 제거

  return resultArray;
};

export const postUserIdByInfluencerId = async (influencerId: number): Promise<number | null> => {
  try {
    const response = await axios.post("http://localhost:4000/homefeed/postuseridbyinfluencerid",
      { influencerId: influencerId }
    );
    return response.data?.user_id || null;
  } catch (error) {
    console.error(`Influencer ID ${influencerId}로 User ID를 가져오는 중 오류 발생:`, error);
    return null;
  }
};

export const postUsernameByUserId = async (userId: number): Promise<string | null> => {
  try {
    const response = await axios.post("http://localhost:4000/homefeed/postusernamebyuserid", {
      userId: userId,
    });
    return response.data?.username || null;
  } catch (error) {
    console.error(`User ID ${userId}로 Username을 가져오는 중 오류 발생:`, error);
    return null;
  }
};

export const postProfilePictureByUserId = async (userId: number): Promise<string | null> => {
  try {
    const response = await axios.post("http://localhost:4000/homefeed/postusernamebyuserid", {
      userId: userId,
    });
    return response.data?.profile_picture || null;
  } catch (error) {
    console.error(`User ID ${userId}로 Username을 가져오는 중 오류 발생:`, error);
    return null;
  }
};

export const getMembershipProduct = async (visibilityLevel: number, influencerId: number): Promise<string | null> => {
  try {
    const response = await axios.get("http://localhost:4000/homefeed/getmembershipproduct", { params: { visibilityLevel, influencerId, } });
    return response.data?.name || null;
  } catch (error) {
    console.error(`visibilityLevel ${influencerId} 및 influencerId ${influencerId}로 name을 가져오는 중 오류 발생:`, error);
    return null;
  }
};

// 데이터 변환 함수 분리
export const mapToCurrentUser = (
  decoded: DecodedAccessToken,
  userPrototypeData: UserPrototype
): CurrentLoggedInUser => ({
  ...decoded,
  email: userPrototypeData?.email,
  password: userPrototypeData?.password,
  about_me: userPrototypeData?.about_me,
  profile_picture: userPrototypeData?.profile_picture,
  follow: convertStringArrayToNumberArray(convertToStringArray(userPrototypeData.follow)),
  created_at: userPrototypeData?.created_at,
  modified_at: userPrototypeData?.modified_at,
});

export const processFeeds = async (feedPrototypes: FeedPrototype[], loggedInUser: CurrentLoggedInUser | null): Promise<Feed[]> => {
  if (!feedPrototypes) return [];

  const feeds: Feed[] = [];

  try {
    for (const feedPrototype of feedPrototypes) {
      const feed: Feed = {
        ...feedPrototype,
        images: convertToStringArray(feedPrototype.images),
        products: convertObjectArrayToProductArray(convertToStringArray(feedPrototype.products)),
        visibility_level: feedPrototype.visibility_level || 0,
        likes: convertStringArrayToNumberArray(convertToStringArray(feedPrototype.likes)),
        username: "Unknown", // 추가된 항목: influencerId로 조회 후 userId 알아내서 User 테이블에서 찾아야 함;;
      }

      const feedUserId = await postUserIdByInfluencerId(feed.influencer_id);

      //username 받아오기
      if (feedUserId) {
        const username = await postUsernameByUserId(feedUserId);
        // console.log(`attachUsernameToFeeds username:`, username)
        feed.username = username || "Unknown";
      } else {
        feed.username = "Unknown"; // 기본값
      }

      //profile_picture 받아오기
      if (feedUserId) {
        const profilePicture = await postProfilePictureByUserId(feedUserId);
        feed.profile_picture = profilePicture || undefined; // 반드시 없을 경우 undefined 값이 할당되어야 함! 삭제 금지
      } else {
        feed.profile_picture = undefined; // 반드시 없을 경우 undefined 값이 할당되어야 함! 삭제 금지
      }

      if (feed.visibility_level && feed.influencer_id) {
        const MembershipProductName = await getMembershipProduct(feed.visibility_level, feed.influencer_id);
        feed.membership_name = MembershipProductName || "Unknown";
      } else {
        feed.membership_name = "Unknown";
      }

      feeds.push(feed);
    }
  } catch (error) {
    console.error("피드 데이터를 가져오는 중 오류 발생:", error);
    return [];
  }
  return feeds;
}

// 2안
export const updateFeedLikes = async (feedId: number, stringifiedUpdatedFeedLikes: string[]) => {
  try {
    // 서버에 업데이트된 변경된 데이터를 전송
    const response = await axios.patch(`http://localhost:4000/homefeed/${feedId}/likes`, {
      likes: stringifiedUpdatedFeedLikes,
    });
  } catch (error) {
    console.error("피드의 좋아요 데이터를 업데이트하는 중 오류 발생:", error);
  }
};
