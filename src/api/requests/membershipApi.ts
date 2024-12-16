import axios from "axios";

export const fetchProducts = async (influencerId: number) => {
  const response = await axios.get(
    `http://localhost:4000/membership/allproducts/${influencerId}`
  );
  return response.data;
};

export const fetchUserSubscription = async (userId: string, influencerId: number) => {
  const response = await axios.get(
    `http://localhost:4000/membership/subscriptions/${userId}`
  );
  return response.data.find((sub: any) => sub.product.influencer_id === influencerId);
};
