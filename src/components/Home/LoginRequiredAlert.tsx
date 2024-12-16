import React from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoggedInUserStore, useLoginAlertStore } from "../../store/authStore";

const LoginRequiredAlert: React.FC = () => {
  const loggedInUser = useLoggedInUserStore((state) => state.loggedInUser);
  const openLoginAlert = useLoginAlertStore((state) => state.openLoginAlert);
  const setOpenLoginAlert = useLoginAlertStore((state) => state.setOpenLoginAlert);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenLoginAlert(false); // 알림 닫기
  };

  const handleNavigate = () => {
    setOpenLoginAlert(false); // 알림 닫기
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <div>
      <Snackbar
        open={openLoginAlert && !loggedInUser}
        onClose={handleClose} // 닫기 동작
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // 알림 위치 설정
      >
        <Alert
          severity="warning"
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          로그인 페이지로 이동하려면 아래 버튼을 클릭하세요!
          <Button
            color="inherit"
            size="small"
            onClick={handleNavigate}
            sx={{
              marginLeft: "16px",
              backgroundColor: "white",
              color: "black",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            이동
          </Button>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginRequiredAlert;