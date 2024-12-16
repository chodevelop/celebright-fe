import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { User } from "../../store/userStore";
import { fetchUserModify } from "../../util/myPageApi";

interface EditProfileFormProps {
  user: User | null;
  setUser: (user: User | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  refreshUserData: () => void; // 데이터 새로고침 함수
  showNotification: (message: string, severity: "success" | "error") => void; // 알림 표시 함수
}
// 숨겨진 파일 입력 스타일
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
const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  setUser,
  setIsEditing,
  refreshUserData,
  showNotification,
}) => {
  const [username, setUsername] = useState(user?.username || "");
  const [aboutMe, setAboutMe] = useState(user?.about_me || "");
  const [category, setCategory] = useState(
    user?.influencer?.category || "여행",
  ); // 기본값 "여행"
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(
    null,
  );
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    user?.influencer?.banner_picture || null,
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profile_picture || null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false); // 배너 이미지 드래그 상태 추가

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("about_me", aboutMe);

      if (selectedImage) {
        formData.append("profile_picture", selectedImage);
      } else {
        formData.append("existingProfilePicture", user?.profile_picture || ""); // 기존 이미지 경로
        formData.append("isNewProfilePicture", "true"); // 이미지 삭제 플래그
      }
      if (user.influencer) {
        // 인플루언서일 때만 배너 이미지와 카테고리 처리
        formData.append("category", category);

        if (selectedBannerImage) {
          formData.append("banner_picture", selectedBannerImage);
        } else if (bannerImagePreview === null) {
          // 배너 이미지가 완전히 삭제된 경우
          formData.append("isNewBannerPicture", "true");
        }
        const influencerData = {
          category: category,
          banner_picture: selectedBannerImage ? selectedBannerImage.name : null,
        };
        formData.append("influencer", JSON.stringify(influencerData)); // `influencer` 객체 포함
      }
      await fetchUserModify(String(user.id), formData);

      // 성공 알림 표시
      showNotification("회원 정보가 성공적으로 수정되었습니다!", "success");

      await refreshUserData(); // 최신 데이터 가져오기
      setIsEditing(false); // 수정 모드 종료
    } catch (error) {
      console.error("회원정보 수정 중 오류 발생:", error);
      // 실패 알림 표시
      showNotification("회원 정보 수정 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedBannerImage(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };
  // 배너 이미지 드래그 앤 드랍 핸들러
  const handleBannerDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingBanner(true);
  };

  const handleBannerDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingBanner(false);
  };

  const handleBannerDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingBanner(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedBannerImage(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };
  const handleBannerFileRemove = () => {
    setSelectedBannerImage(null);
    setBannerImagePreview(null);
  };

  return (
    <Box
      sx={{
        margin: "0 5%",
        marginTop: "32px",
        marginBottom: "32px",
        border: "none",
        // borderRadius: "18px",
        // boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 29px 0px",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* 닉네임 입력 */}
        <TextField
          label="닉네임"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {/* 소개 입력 */}
        <TextField
          label="소개"
          variant="outlined"
          multiline
          rows={4}
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
        {/* 배너 이미지 URL 및 카테고리 선택 */}
        {user?.influencer && user.influencer.id && (
          <>
            <FormControl fullWidth>
              <InputLabel id="category-select-label"
                sx={{
                  backgroundColor: "white",
                  padding: "0 1.5 %"
                }}
              >카테고리</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="여행">여행</MenuItem>
                <MenuItem value="패션">패션</MenuItem>
                <MenuItem value="음식">음식</MenuItem>
                <MenuItem value="뷰티">뷰티</MenuItem>
                <MenuItem value="음악">음악</MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px dashed",
                borderColor: "grey.300",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
              }}
              onDragOver={handleBannerDragOver}
              onDragLeave={handleBannerDragLeave}
              onDrop={handleBannerDrop}
            >
              {bannerImagePreview ? (
                <Box
                  sx={{ position: "relative", width: "100%", maxHeight: 200 }}
                >
                  <img
                    src={bannerImagePreview}
                    alt="Banner Preview"
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
                    onClick={handleBannerFileRemove}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    배너 이미지를 업로드하세요
                  </Typography>
                </>
              )}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                파일 선택
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                />
              </Button>
            </Box>
            {/* 카테고리 */}
          </>
        )}
        {/* 프로필 이미지 */}
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
          {imagePreview ? (
            <Box sx={{ position: "relative", width: "100%", maxHeight: 200 }}>
              <img
                src={imagePreview}
                alt="Profile Preview"
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
                프로필 이미지를 업로드하세요
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
        {/* 버튼 */}
        <Box sx={{
          display: "flex", gap: 1,
          justifyContent: "flex-end"
        }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
          >
            취소
          </Button>
        </Box>
      </Box>

    </Box>
    // <Container maxWidth="sm" sx={{ marginTop: 4 }}>
    //   <Box
    //     component="form"
    //     sx={{
    //       display: "flex",
    //       flexDirection: "column",
    //       gap: 2,
    //     }}
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       handleSubmit();
    //     }}
    //   >
    //     {/* 닉네임 입력 */}
    //     <TextField
    //       label="닉네임"
    //       variant="outlined"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       required
    //     />
    //     {/* 소개 입력 */}
    //     <TextField
    //       label="소개"
    //       variant="outlined"
    //       multiline
    //       rows={4}
    //       value={aboutMe}
    //       onChange={(e) => setAboutMe(e.target.value)}
    //     />
    //     {/* 배너 이미지 URL 및 카테고리 선택 */}
    //     {user?.influencer && user.influencer.id && (
    //       <>
    //         <FormControl fullWidth>
    //           <InputLabel id="category-select-label">카테고리</InputLabel>
    //           <Select
    //             labelId="category-select-label"
    //             value={category}
    //             onChange={(e) => setCategory(e.target.value)}
    //           >
    //             <MenuItem value="여행">여행</MenuItem>
    //             <MenuItem value="패션">패션</MenuItem>
    //             <MenuItem value="음식">음식</MenuItem>
    //             <MenuItem value="뷰티">뷰티</MenuItem>
    //             <MenuItem value="음악">음악</MenuItem>
    //           </Select>
    //         </FormControl>
    //         <Box
    //           sx={{
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //             border: "2px dashed",
    //             borderColor: "grey.300",
    //             borderRadius: 2,
    //             p: 3,
    //             textAlign: "center",
    //           }}
    //           onDragOver={handleBannerDragOver}
    //           onDragLeave={handleBannerDragLeave}
    //           onDrop={handleBannerDrop}
    //         >
    //           {bannerImagePreview ? (
    //             <Box
    //               sx={{ position: "relative", width: "100%", maxHeight: 200 }}
    //             >
    //               <img
    //                 src={bannerImagePreview}
    //                 alt="Banner Preview"
    //                 style={{
    //                   width: "100%",
    //                   maxHeight: "200px",
    //                   objectFit: "contain",
    //                   borderRadius: 8,
    //                 }}
    //               />
    //               <IconButton
    //                 color="error"
    //                 sx={{
    //                   position: "absolute",
    //                   top: 0,
    //                   right: 0,
    //                 }}
    //                 onClick={handleBannerFileRemove}
    //               >
    //                 <DeleteIcon />
    //               </IconButton>
    //             </Box>
    //           ) : (
    //             <>
    //               <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
    //               <Typography
    //                 variant="h6"
    //                 color="text.secondary"
    //                 sx={{ mt: 2 }}
    //               >
    //                 배너 이미지를 업로드하세요
    //               </Typography>
    //             </>
    //           )}
    //           <Button
    //             component="label"
    //             variant="contained"
    //             startIcon={<CloudUploadIcon />}
    //           >
    //             파일 선택
    //             <VisuallyHiddenInput
    //               type="file"
    //               accept="image/*"
    //               onChange={handleBannerFileChange}
    //             />
    //           </Button>
    //         </Box>
    //         {/* 카테고리 */}
    //       </>
    //     )}
    //     {/* 프로필 이미지 */}
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         border: "2px dashed",
    //         borderColor: isDragging ? "primary.main" : "grey.300",
    //         borderRadius: 2,
    //         p: 3,
    //         textAlign: "center",
    //         backgroundColor: isDragging ? "action.hover" : "inherit",
    //         transition: "background-color 0.2s",
    //       }}
    //       onDragOver={handleDragOver}
    //       onDragLeave={handleDragLeave}
    //       onDrop={handleDrop}
    //     >
    //       {imagePreview ? (
    //         <Box sx={{ position: "relative", width: "100%", maxHeight: 200 }}>
    //           <img
    //             src={imagePreview}
    //             alt="Profile Preview"
    //             style={{
    //               width: "100%",
    //               maxHeight: "200px",
    //               objectFit: "contain",
    //               borderRadius: 8,
    //             }}
    //           />
    //           <IconButton
    //             color="error"
    //             sx={{
    //               position: "absolute",
    //               top: 0,
    //               right: 0,
    //             }}
    //             onClick={handleFileRemove}
    //           >
    //             <DeleteIcon />
    //           </IconButton>
    //         </Box>
    //       ) : (
    //         <>
    //           <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
    //           <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
    //             프로필 이미지를 업로드하세요
    //           </Typography>
    //         </>
    //       )}
    //       <Button
    //         component="label"
    //         variant="contained"
    //         startIcon={<CloudUploadIcon />}
    //         sx={{ mt: imagePreview ? 2 : 0 }}
    //       >
    //         파일 선택
    //         <VisuallyHiddenInput
    //           type="file"
    //           accept="image/*"
    //           onChange={handleFileChange}
    //         />
    //       </Button>
    //     </Box>
    //     {/* 버튼 */}
    //     <Box sx={{ display: "flex", gap: 2 }}>
    //       <Button
    //         type="submit"
    //         variant="contained"
    //         color="primary"
    //         disabled={isLoading}
    //       >
    //         {isLoading ? "저장 중..." : "저장"}
    //       </Button>
    //       <Button
    //         variant="outlined"
    //         color="secondary"
    //         onClick={() => setIsEditing(false)}
    //         disabled={isLoading}
    //       >
    //         취소
    //       </Button>
    //     </Box>
    //   </Box>
    // </Container>
  );
};

export default EditProfileForm;
