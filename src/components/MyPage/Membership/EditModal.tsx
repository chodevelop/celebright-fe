import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { MembershipPlan } from "../../../types/MembershipPlan.type";
import {
  CloudUpload as CloudUploadIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { deleteMembershipImage } from "../../../util/membershipApi";

interface EditModalProps {
  openDialog: boolean;
  onClose: () => void;
  selectedLevel: number | null;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number | null>>;
  onSave: (formData: FormData) => Promise<void>;
  currentPlan: MembershipPlan | null;
  setCurrentPlan: React.Dispatch<React.SetStateAction<MembershipPlan | null>>;
  plans: MembershipPlan[]; // 정확한 타입 정의 필요
}

// 파일 입력 스타일링을 위한 시각적으로 숨겨진 input
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditModal: React.FC<EditModalProps> = ({
  openDialog,
  onClose,
  selectedLevel,
  currentPlan,
  setSelectedLevel,
  onSave,
  plans,
  setCurrentPlan,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 이미지 파일 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 미리보기 URL
  const [isDragging, setIsDragging] = useState(false);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  useEffect(() => {
    if (currentPlan?.image && !isImageDeleted) {
      setImagePreview(currentPlan.image); // 기존 이미지 URL 설정
    }
  }, [currentPlan, isImageDeleted]);

  const handleDialogClose = () => {
    onClose();
    setCurrentPlan(null);
    setSelectedLevel(null);
    setSelectedImage(null);
    setImagePreview(null);
    setIsImageDeleted(false);
  };

  const handleSave = async () => {
    if (!currentPlan) return;

    try {
      if (isImageDeleted && currentPlan.image && currentPlan.id) {
        await deleteMembershipImage(currentPlan.id, currentPlan.image);
      }
      const formData = new FormData();
      formData.append("name", currentPlan.name);
      formData.append("price", currentPlan.price.toString());
      formData.append("benefits", currentPlan.benefits.join(","));
      formData.append("level", (selectedLevel || 0).toString());

      if (selectedImage) {
        formData.append("image", selectedImage); // 이미지 파일 추가
      } else if (isImageDeleted) {
        formData.append("imageUrl", "true"); // 이미지 삭제 상태 전달
      }

      await onSave(formData); // 서버로 데이터 전송
      handleDialogClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // 미리보기 URL 생성
      setIsImageDeleted(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageDeleted(false); // 새 이미지 업로드 시 삭제 상태 초기화
    }
  };
  const handleFileRemove = async () => {
    setIsImageDeleted(true);
    setImagePreview(null);
    setSelectedImage(null);
  };
  return (
    <Dialog open={openDialog} onClose={onClose}>
      <DialogTitle>멤버십 수정</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="이름"
          value={currentPlan?.name || ""}
          onChange={(e) =>
            setCurrentPlan((prev) =>
              prev ? { ...prev, name: e.target.value } : null,
            )
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="가격"
          type="number"
          value={currentPlan?.price || ""}
          onChange={(e) =>
            setCurrentPlan((prev) =>
              prev ? { ...prev, price: parseFloat(e.target.value) } : null,
            )
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="혜택"
          value={(currentPlan?.benefits || []).join(",")}
          onChange={(e) =>
            setCurrentPlan((prev) =>
              prev
                ? {
                    ...prev,
                    benefits: e.target.value.split(",").map((b) => b),
                  }
                : null,
            )
          }
          multiline
          rows={3}
        />
        <FormControl fullWidth margin="normal">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px dashed",
              borderColor: isDragging ? "primary.main" : "grey.300",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              backgroundColor: isDragging ? "action.hover" : "inherit",
              transition: "background-color 0.2s",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 이미지 미리보기 또는 업로드 버튼 */}
            {imagePreview ? (
              <Box sx={{ position: "relative", width: "100%", maxHeight: 200 }}>
                <img
                  src={imagePreview}
                  alt="미리보기"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                  onClick={handleFileRemove}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                  이미지를 업로드하세요
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  PNG, JPG 형식의 파일을 선택해주세요
                </Typography>
              </>
            )}

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: imagePreview ? 2 : 0 }}
            >
              파일 선택
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>취소</Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={!currentPlan?.name || currentPlan.price <= 0}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
