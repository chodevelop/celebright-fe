import React, { useEffect, useState } from "react";
import { Container, Button, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { MembershipProduct } from "../../types/membershipProduct";
import { fetchProducts, fetchUserSubscription } from "../../api/requests/membershipApi";
import MembershipProductList from "./Membership/MembershipProductList";
import LoadingSpinner from "../common/LodingSpinner";

interface MembershipTabProps {
  influencerId: number;
  onSubscriptionUpdate: () => void;
}

const MembershipTab: React.FC<MembershipTabProps> = ({
  influencerId,
  onSubscriptionUpdate,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const [products, setProducts] = useState<MembershipProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [userSubscription, setUserSubscription] = useState<MembershipProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, subscription] = await Promise.all([
          fetchProducts(influencerId),
          fetchUserSubscription(userId!, influencerId),
        ]);
        setProducts(productsData);
        if (subscription) {
          const { id, name, price, benefits } = subscription.product;
          setUserSubscription({ id, name, price, benefits });
          setSelectedProduct(id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (influencerId) loadData();
  }, [influencerId, userId]);

  const handleSubscription = () => {
    if (!selectedProduct) {
      alert("상품을 선택하세요.");
      return;
    }

    const selectedProductDetails = products.find(
      (product) => product.id === selectedProduct
    );
    if (!selectedProductDetails) {
      alert("선택한 상품 정보를 찾을 수 없습니다.");
      return;
    }

    navigate("/payment", {
      state: {
        productId: selectedProductDetails.id,
        value: selectedProductDetails.price,
        orderName: selectedProductDetails.name,
        userId,
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md" sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <MembershipProductList
        products={products}
        selectedProduct={selectedProduct}
        userSubscription={userSubscription}
        onSelect={setSelectedProduct}
      />
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubscription}
          disabled={selectedProduct === null || userSubscription?.id === selectedProduct}
          sx={{ padding: "12px 32px", borderRadius: "8px" }}
        >
          {userSubscription?.id === selectedProduct ? "구독하기" : "변경하기"}
        </Button>
      </Box>
    </Container>
  );
};

export default MembershipTab;
