// FeedPrototype 정의: DB에 저장되어있는 형태 그대로 모델에서 사용하는 데이터 필드
export interface FeedPrototype {
    id: number;
    influencer_id: number;
    content?: string | null;
    images?: string | null; // images는 JSON 배열
    products?: string | null; // products는 객체 배열
    visibility_level?: number | null;
    likes?: string | null; // 좋아요 목록
    created_at: Date;
    modified_at: Date;
}

export interface Product {
    img: string; // 제품 이미지 URL
    title: string; // 제품 이름
    link: string; // 제품 상세 페이지 링크
}

// is_current_user_likes_it 삭제!!
// 홈 피드에서 사용하는 Feed에서 쓰는 가공된 정보
export interface Feed {
    id: number; //피드 고유 아이디
    influencer_id: number;
    content?: string | null;
    images: string[];
    products: Product[];
    visibility_level: number;
    likes: number[];
    created_at?: Date,
    modified_at?: Date
    username: string; // 추가된 항목: influencerId로 조회 후 userId 알아내서 User 테이블에서 찾아야 함;;
    profile_picture?: string | null; //게시물 띄우기 위해 피드 정보에 포함되어야 함
    membership_name?: string;
}

//AccessToken Decode 시 얻을 수 있는 원시 정보
export interface DecodedAccessToken {
    userId: number;
    influencerId?: number;
    username: string;
    exp: number;
    iat: number;
}

// 홈 피드에서 사용하는 엑세스 토큰 값을 기반으로 구성하는 CurrentLoggedInUser에서 쓰는 가공된 정보
export interface CurrentLoggedInUser {
    userId: number;
    influencerId?: number;
    username: string;
    exp: number;
    iat: number;
    email?: string;
    password?: string;
    about_me?: string | null;
    profile_picture?: string | null;
    follow: number[];
    created_at?: Date;
    modified_at?: Date;
}

// UserPrototype 정의: DB에 저장되어있는 원시값의 타입 정보
export interface UserPrototype {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    about_me?: string;
    profile_picture?: string;
    follow?: string; // JSON 형태로 저장되는 팔로잉 정보
    created_at?: Date;
    modified_at?: Date;
}

export interface InfluencerPrototype {
    id: number;
    user_id: number;
    follower?: string; // JSON 형태로 저장되는 팔로워 정보
    banner_picture?: string;
    category?: string;
    created_at: Date;
    modified_at: Date;
}

// //피드에서 인플루언서 팔로잉 여부를 판단해 저장하는 State 선언을 위해 만들었음
// export interface FollowingStatus {
//     [key: number]: boolean; // 숫자 키에 대해 boolean 타입의 값을 가짐
// }

// 피드에서 인플루언서 팔로잉 여부를 판단해 저장하는 State 선언을 위해 만들었음
export interface FollowingStatus {
    [key: number]: number; // 숫자 키에 대해 number 타입의 값을 가짐 (0: 언팔로우, 1: 팔로우)
}

//피드에서 인플루언서 팔로잉 여부를 판단해 저장하는 State 선언을 위해 만들었음
export interface LikeStatus {
    [key: number]: boolean; // 숫자 키에 대해 boolean 타입의 값을 가짐
}

// //피드에서 인플루언서 팔로잉 여부를 판단해 저장하는 State 선언을 위해 만들었음
// export interface LikeStatus extends FollowingStatus { }