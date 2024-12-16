import React from "react";
import { Box, Card, CardContent, IconButton, Switch, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import BrightIcon from "../../common/BrightIcon";
import { MembershipPlan } from "../../../types/MembershipPlan.type";

const MembershipCard: React.FC<{
  plan: MembershipPlan;
  onToggleStatus: (id: number) => void;
  onEdit: (plan: MembershipPlan) => void;
  hovered: boolean;
  onHover: (id: number | null) => void;
}> = ({ plan, onToggleStatus, onEdit, hovered, onHover }) => {
  return (
    <Box
      sx={{
        // backgroundColor: "red"
      }}
      onMouseEnter={() => onHover(plan.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Card
        sx={{
          position: "relative",
          borderRadius: 3,
          boxShadow: hovered ? 6 : 2,
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          height: "280px",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          background: "linear-gradient(145deg, #f5f7fa, #e4e9f2)",
          filter: plan.is_active ? "none" : "grayscale(100%)",
          opacity: plan.is_active ? 1 : 0.6,
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Switch
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            "& .MuiSwitch-track": {
              backgroundColor: plan.is_active ? "black" : "gray",
            },
          }}
          checked={Boolean(plan.is_active)}
          onChange={() => onToggleStatus(plan.id)}
        />
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 255, 0.1)",
            },
          }}
          onClick={() => onEdit(plan)}
        >
          <Edit />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 1,
            marginTop: 4,
          }}
        >
          {plan.image ? (
            <img
              src={plan.image}
              alt={plan.name || "Membership Image"}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <BrightIcon />
          )}
        </Box>
        <CardContent sx={{ textAlign: "center", paddingBottom: "15px" }}>
          <Typography sx={{
            fontSize: "14px",
            fontWeight: 600
          }
          }>
            {plan.name}
          </Typography>
        </CardContent>
        <Box sx={{ flex: 1, textAlign: "left", marginBottom: "10px" }}>
          {plan.accumulatedBenefits?.length > 0 ? (
            plan.accumulatedBenefits.map((benefit, index) => (
              <Typography key={index} sx={{ textAlign: "center", fontSize: "0.8rem" }}>
                ✔️ {benefit}
              </Typography>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "#888" }}>
              혜택 정보가 없습니다.
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: "center", marginTop: "auto", paddingTop: 2 }}>
          <Typography sx={{ fontWeight: "bold", color: "#444", fontSize: "16px" }}>
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
              minimumFractionDigits: 0,
            }).format(plan.price)}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default MembershipCard;
