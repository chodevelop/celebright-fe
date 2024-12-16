import React from "react";
import { Snackbar, Alert } from "@mui/material";

type SeverityType = "success" | "error" | "custom";

const Notification: React.FC<{
  open: boolean;
  message: string;
  severity: SeverityType;
  onClose: () => void;
}> = ({ open, message, severity, onClose }) => {
  const getCustomAlert = () => {
    if (severity === "custom") {
      return (
        <Alert
          onClose={onClose}
          icon={null} // 아이콘을 숨기거나 커스텀 가능
          sx={{
            backgroundColor: "#c39fe2", // 커스텀 배경색
            color: "black", // 텍스트 색상
            // fontWeight: "bold",
            "& .MuiAlert-icon": {
              // 아이콘 색상 변경
              color: "black",
            },
          }}
        >
          {message}
        </Alert>
      );
    }
    return (
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    ); // 기본 유형
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // 오른쪽 하단 위치 설정
    >
      {getCustomAlert()}
    </Snackbar>
  );
};

export default Notification;
