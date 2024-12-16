import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import MembershipList from "./MembershipList";
import Notification from "../../common/Notification";
import EditModal from "./EditModal";
import { MembershipPlan } from "../../../types/MembershipPlan.type";
import { toggleProductStatus } from "../../../util/myPageApi";
import {
  fetchMembershipPlans,
  updateMembership,
} from "../../../util/membershipApi";

const ManageMembership: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPlanId, setHoveredPlanId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Modal state
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Accumulated benefits calculation
  const calculateAccumulatedBenefits = useCallback(
    (plans: MembershipPlan[]) => {
      return plans.map((plan, index) => {
        const accumulatedBenefits = plans
          .slice(0, index + 1)
          .flatMap((p) => p.benefits);

        return {
          ...plan,
          accumulatedBenefits: [...new Set(accumulatedBenefits)],
        };
      });
    },
    [],
  );

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) {
        throw new Error("Invalid user ID");
      }
      const products = await fetchMembershipPlans(userId);

      const sortedPlans = products.sort(
        (a: MembershipPlan, b: MembershipPlan) => a.level - b.level,
      );

      const plansWithAccumulatedBenefits =
        calculateAccumulatedBenefits(sortedPlans);

      setPlans(plansWithAccumulatedBenefits);
    } catch (error) {
      setError("Failed to fetch plans.");
    } finally {
      setLoading(false);
    }
  }, [userId, calculateAccumulatedBenefits]);

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleProductStatus(id);
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === id ? { ...plan, is_active: !plan.is_active } : plan,
        ),
      );
      setNotification({
        open: true,
        message: "상태가 성공적으로 변경되었습니다!",
        severity: "success",
      });
    } catch {
      setNotification({
        open: true,
        message: "상태 업데이트에 실패했습니다.",
        severity: "error",
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleEdit = (plan: MembershipPlan) => {
    setCurrentPlan(plan);
    setSelectedLevel(plan.level);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentPlan(null);
    setSelectedLevel(null);
  };

  const handleSaveChanges = async (formData: FormData) => {
    try {
      if (currentPlan?.id) {
        await updateMembership(currentPlan.id, formData);
        setNotification({
          open: true,
          message: "Membership updated successfully!",
          severity: "success",
        });
        setNotification({
          open: true,
          message: "New membership added successfully!",
          severity: "success",
        });
      }
      fetchPlans();
    } catch (error) {
      console.error("Error saving membership:", error);
      setNotification({
        open: true,
        message: "Failed to save membership.",
        severity: "error",
      });
    } finally {
      handleDialogClose();
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <MembershipList
        plans={plans}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
        hoveredPlanId={hoveredPlanId}
        setHoveredPlanId={setHoveredPlanId}
      />
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
      <EditModal
        openDialog={openDialog}
        onClose={handleDialogClose}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        onSave={handleSaveChanges}
        currentPlan={currentPlan}
        setCurrentPlan={setCurrentPlan}
        plans={plans}
      />
    </Box>
  );
};

export default ManageMembership;
