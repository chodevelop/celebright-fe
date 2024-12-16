import React from "react";
import { Grid } from "@mui/material";
import MembershipProductCard from "../../common/MembershipProductCard";
import { MembershipProduct } from "../../../types/membershipProduct";

interface MembershipProductListProps {
  products: MembershipProduct[];
  selectedProduct: number | null;
  userSubscription: MembershipProduct | null;
  onSelect: (id: number) => void;
}

const MembershipProductList: React.FC<MembershipProductListProps> = ({
  products,
  selectedProduct,
  userSubscription,
  onSelect,
}) => (
  <Grid container spacing={2} justifyContent="center" alignItems="stretch">
    {products.map((product) => (
      <Grid item xs={12} sm={6} md={4} key={product.id}>
        <MembershipProductCard
          product={product}
          selectedProduct={selectedProduct}
          onSelect={onSelect}
          isUserSubscribed={userSubscription?.id === product.id}
        />
      </Grid>
    ))}
  </Grid>
);

export default MembershipProductList;
