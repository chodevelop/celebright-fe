import axios from "axios";

// 멤버십 목록 가져오기
export const fetchMembershipPlans = async (userId: string) => {
  const response = await axios.get(
    `http://localhost:4000/membership/products/${userId}`,
  );
  return response.data;
};

export const updateMembership = async (id: number, formData: FormData) => {
  await axios.patch(
    `http://localhost:4000/membership/products/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

// 이미지 삭제
export const deleteMembershipImage = async (
  productId: number,
  imageUrl: string,
) => {
  return axios.delete(`http://localhost:4000/membership/image`, {
    headers: { "Content-Type": "application/json" },
    data: { productId, imageUrl },
  });
};
