import React from "react";
import { Card, CardContent, Typography, Box, CardActionArea, Stack } from "@mui/material";
import { MembershipProduct } from "../../types/membershipProduct";

interface MembershipProductCardProps {
  product: MembershipProduct;
  selectedProduct: number | null;
  onSelect: (productId: number) => void;
  isUserSubscribed: boolean; // 사용자 가입 여부
}

const MembershipProductCard: React.FC<MembershipProductCardProps> = ({
  product,
  selectedProduct,
  onSelect,
  isUserSubscribed,
}) => {
  const benefitsArray = Array.isArray(product.benefits)
    ? product.benefits
    : (product.benefits || "").split(",");

  return (
    <Card
      sx={{

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: 2,
        borderRadius: "12px",
        border: isUserSubscribed
          ? "3px solid #9C27B0"
          : selectedProduct === product.id
            ? "2px solid #000000"
            : "1px solid #e0e0e0",
        boxShadow: isUserSubscribed
          ? "0 4px 12px rgba(156, 39, 176, 0.3)"
          : selectedProduct === product.id
            ? "0 4px 12px rgba(98, 0, 234, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: isUserSubscribed ? "#f3e5f5" : "white",
        cursor: isUserSubscribed ? "not-allowed" : "pointer",
        opacity: isUserSubscribed ? 0.7 : 1,
      }}
    >
      <CardActionArea
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        onClick={() => !isUserSubscribed && onSelect(product.id)}
        disabled={isUserSubscribed}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack spacing={1} sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: isUserSubscribed
                  ? "#9C27B0"
                  : selectedProduct === product.id
                    ? "#6200ea"
                    : "#333",
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: "#757575" }}
            >
              {product.price.toLocaleString()}원
            </Typography>
          </Stack>
          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            {benefitsArray.map((benefit, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  lineHeight: 1.5,
                  color: "#424242",
                  marginBottom: "4px",
                }}
              >
                - {benefit.trim()}
              </Typography>
            ))}
          </Box>
          {isUserSubscribed && (
            <Box
              sx={{
                textAlign: "center",
                padding: "4px 8px",
                backgroundColor: "#9C27B0",
                color: "white",
                borderRadius: "8px",
                marginTop: 2,
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                현재 가입 중
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MembershipProductCard;
