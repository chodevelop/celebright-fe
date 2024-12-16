import { tryParseJson } from "../../util/tryParseJson";
import axiosInstance from "../client/index";

export const feedWrite = async (formData: FormData) => {
  try {
    const res = await axiosInstance.post("/feed", formData);

    return res;
  } catch (error) {
    console.error("Error uploading product", error);
    alert("Failed to upload product");
  }
};
export const feedUpdate = async (id: string, formData: FormData) => {
  try {
    const res = await axiosInstance.patch(`/feed/${id}`, formData);
    return res;
  } catch (error) {
    console.error("Error uploading product", error);
    alert("Failed to upload product");
  }
};
export const feedGet = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/feed/${id}`);
    const newRes = {
      ...res.data,
      images:
        typeof res.data.images === "string"
          ? tryParseJson(res.data.images) // tryParseJson을 통해 처리
          // : res.data.images,
          : res.data.images //데이터 자체가 있는지 확인
            ? res.data.images //있으면그대로
            : [], //없으면 빈 배열(0 처리)
      likes:
        typeof res.data.likes === "string"
          ? tryParseJson(res.data.likes)
          // : res.data.likes,
          : res.data.likes //데이터 자체가 있는지 확인
            ? res.data.likes //있으면그대로
            : [], //없으면 빈 배열(0 처리)
      products:
        typeof res.data.products === "string"
          ? tryParseJson(res.data.products)
          // : res.data.products,
          : res.data.products //데이터 자체가 있는지 확인
            ? res.data.products //있으면그대로
            : [], //없으면 빈 배열(0 처리)
    };
    console.log(newRes, "newRes");

    return newRes;
  } catch (error) {
    console.error("Error getting feed data:", error);
    alert("Failed to get feed data");
    return null; // 에러 발생 시 null을 반환하거나 적절한 값을 반환하도록 처리
  }
};
export const feedDelete = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/feed/${id}`);
    return res;
  } catch (err) {
    console.error(err);
  }
};
export const feedLikes = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/feed/likes/${id}`);
    return res;
  } catch (err) {
    console.error(err);
    alert("로그인유효만료");
  }
};
