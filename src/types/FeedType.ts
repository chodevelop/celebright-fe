export type ProductsProps = {
  img: string;
  link: string;
  title: string;
};
export interface Feed {
  content: string;
  id: number;
  images: string[]; // images는 string[] 배열
  influencer_id: number;
  likes: string[];
  products: ProductsProps[]; // products의 타입은 실제 데이터에 맞게 정의
  visibility_level: number;
  influencer: string;
  influencerImg?: string;
}
