import React from "react";
import { Grid } from "@mui/material";
import MembershipCard from "./MembershipCard";
import { MembershipPlan } from "../../../types/MembershipPlan.type";

const MembershipList: React.FC<{
  plans: MembershipPlan[];
  onToggleStatus: (id: number) => void;
  onEdit: (plan: MembershipPlan) => void;
  hoveredPlanId: number | null;
  setHoveredPlanId: (id: number | null) => void;
}> = ({ plans, onToggleStatus, onEdit, hoveredPlanId, setHoveredPlanId }) => {
  return (
    <Grid container spacing={3}>
      {plans.map((plan) => (
        <Grid item xs={12} sm={6} md={4} key={plan.id}>
          <MembershipCard
            plan={plan}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            hovered={hoveredPlanId === plan.id}
            onHover={setHoveredPlanId}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default MembershipList;
