import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  Divider,
} from "@mui/material";
import { applyInfluencer, checkPendingApplication } from "../../../util/myPageApi";

interface InfluencerModalProps {
  open: boolean;
  onClose: () => void;
  userId: number; // 유저 ID
  username: string; // 유저 닉네임
}

const InfluencerModal: React.FC<InfluencerModalProps> = ({
  open,
  onClose,
  username,
  userId, // userId를 Props로 받음
}) => {
  const [category, setCategory] = useState<string>("여행");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [isPending, setIsPending] = useState(false); // 펜딩 상태 확인

  useEffect(() => {
    if (open) {
      fetchPendingStatus();
    }
  }, [open]);

  const fetchPendingStatus = async () => {
    try {
      setLoading(true);
      const isPendingApplication = await checkPendingApplication(userId);
      setIsPending(isPendingApplication);
    } catch (error) {
      console.error("Error checking pending application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await applyInfluencer({
        user_id: userId, // API 요청에 userId 포함
        category,
        banner_picture: bannerImage || "http://picsum.photos/600/200", // 미입력 시 기본 이미지 사용
      });
      alert("인플루언서 신청이 완료되었습니다.");
      onClose(); // 신청 완료 후 모달 닫기
    } catch (error) {
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="influencer-modal-title"
      aria-describedby="influencer-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="influencer-modal-title"
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textAlign: "center",
            color: "primary.main",
          }}
        >
          인플루언서 신청
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {isPending ? (
          <Typography
            variant="subtitle1"
            sx={{
              color: "warning.main",
              textAlign: "center",
              fontWeight: "bold",
              mt: 2,
            }}
          >
            승인 대기 중입니다. 관리자의 승인을 기다려주세요.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              닉네임:{" "}
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                {username}
              </Typography>
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                카테고리
              </Typography>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
              >
                <MenuItem value="여행">여행</MenuItem>
                <MenuItem value="패션">패션</MenuItem>
                <MenuItem value="음식">음식</MenuItem>
                <MenuItem value="뷰티">뷰티</MenuItem>
                <MenuItem value="음악">음악</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="배너 이미지 링크"
              value={bannerImage || ""}
              onChange={(e) => setBannerImage(e.target.value)}
              placeholder="미입력 시 기본 배너 이미지 사용"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClose}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                disabled={loading} // 로딩 중 비활성화
              >
                취소
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                disabled={loading} // 로딩 중 비활성화
              >
                {loading ? "신청 중..." : "신청하기"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default InfluencerModal;
