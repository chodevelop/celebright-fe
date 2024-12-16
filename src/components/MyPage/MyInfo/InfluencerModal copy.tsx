import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Divider,
} from "@mui/material";

interface InfluencerModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  onSubmit: (category: string, bannerImage: string | null) => void;
}

const InfluencerModal: React.FC<InfluencerModalProps> = ({
  open,
  onClose,
  username,
  onSubmit,
}) => {
  const [category, setCategory] = useState<string>("여행");
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit(category, bannerImage);
    onClose();
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
            labelId="category-label"
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
          >
            신청하기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InfluencerModal;
