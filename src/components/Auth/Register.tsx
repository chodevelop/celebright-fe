/**
 * Register.tsx
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/21
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Grow,
} from "@mui/material";

const API_URL = `http://localhost:4000`;

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    about_me: "",
    image_url: "", //임시 입력
    // profile_picture: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isEmailInputDisabled, setIsEmailInputDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");

    if (email) {
      setForm((prev) => ({ ...prev, email }));
      setIsEmailInputDisabled(true);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const passwordsMatch = form.password === form.confirmPassword;


  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profile_picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, password: value }));

    if (!showConfirmPassword && value.length > 0) {
      setShowConfirmPassword(true);
    } else if (showConfirmPassword && value.length === 0) {
      setShowConfirmPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 기본 유효성 검사
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.password.length < 8) {
      setMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "회원가입에 실패했습니다.");
      } else {
        setMessage("회원가입이 완료되었습니다!");
        setTimeout(() => navigate("/login"), 2000); // 2초 후 로그인 페이지로 이동
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        margin: "0 5%",
        marginTop: "32px",
        marginBottom: "32px",
        backgroundColor: "white",
        border: "none",
        borderRadius: "18px",
        boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 29px 0px",
      }}
    >

      <Box sx={{
        padding: "0 32px",
        textAlign: "center",
        marginTop: "40px",
        marginBottom: "40px"
      }}>
        <Typography variant="h4" gutterBottom color="primary">
          회원가입
        </Typography>
        <Grow in>
          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: "20px", }}>
              <TextField
                name="email"
                label="이메일"
                variant="outlined"
                fullWidth
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                disabled={isEmailInputDisabled}
                margin="normal"
                required
                autoComplete="off"
                error={touched.email && !form.email} // 입력이 없으면 에러 상태
                helperText={touched.email && !form.email ? "이메일을 입력해주세요." : " "} // 에러 메시지 표시
                sx={{
                  marginTop: "2px",
                  backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                }}
              />
              <TextField
                name="username"
                label="유저명"
                variant="outlined"
                fullWidth
                value={form.username}
                onChange={handleChange}
                onBlur={() => handleBlur("username")}
                margin="normal"
                required
                autoComplete="off"
                error={touched.username && !form.username} // 입력이 없으면 에러 상태
                helperText={touched.username && !form.username ? `유저명을 입력해주세요.` : " "} // 에러 메시지 표시
                sx={{
                  marginTop: "2px",
                  backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                }}
              />
              <TextField
                name="password"
                label="비밀번호"
                type="password"
                variant="outlined"
                fullWidth
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                margin="normal"
                required
                error={touched.password && !!(!form.password || (form.confirmPassword && form.password !== form.confirmPassword))}
                helperText={
                  touched.password && !form.password
                    ? "비밀번호를 입력해주세요."
                    : form.confirmPassword && form.password !== form.confirmPassword
                      ? "비밀번호가 일치하지 않습니다."
                      : " "
                }
                sx={{
                  marginTop: "2px",
                  backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                  marginBottom: 0,
                }}
              />
              {/* 비밀번호 확인란 - 조건부 렌더링 */}
              <Box
                sx={{
                  maxHeight: form.password ? "100px" : 0,// 높이를 동적으로 조정
                  opacity: form.password ? 1 : 0, // 투명도 효과 추가
                  overflow: "hidden", // 넘치는 내용 숨김
                  transition: "max-height 0.7s ease-in-out, min-height 0.7s ease-in-out, opacity 0.7s ease-in-out", // 부드러운 전환
                  margin: 0,
                  border: 0,
                  padding: 0,
                  backgroundColor: "transparent"
                }}
              >
                <TextField
                  name="confirmPassword"
                  label="비밀번호 확인"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  margin="normal"
                  required
                  error={touched.confirmPassword && !!(!form.confirmPassword || (form.password && form.password !== form.confirmPassword))}
                  helperText={
                    touched.confirmPassword && !form.confirmPassword
                      ? "비밀번호 확인을 입력해주세요."
                      : form.password && form.password !== form.confirmPassword
                        ? "비밀번호가 일치하지 않습니다."
                        : " "
                  }
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                  }}
                />
              </Box>
              <TextField
                name="about_me"
                label="간단소개"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={form.about_me}
                onChange={handleChange}
                margin="normal"
                autoComplete="off"
                helperText={" "}
                sx={{
                  marginTop: "2px",
                  backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                }}
              />

              {/* 임시 입력란 */}
              <TextField
                name="image_url"
                label="이미지 URL"
                variant="outlined"
                fullWidth
                value={form.image_url}
                onChange={handleChange}
                margin="normal"
                autoComplete="off"
                placeholder="임시 입력란입니다."
                helperText={" "}
                sx={{
                  marginTop: "2px",
                  backgroundColor: "transparent", // 텍스트 필드 배경 투명화
                }}
              />
              {/* <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <Button variant="contained" component="label" sx={{ marginRight: "10px" }}>
              프로필 사진 업로드
              <input type="file" hidden onChange={handleProfilePictureChange} />
            </Button>
            {form.profile_picture && (
              <Avatar src={form.profile_picture} sx={{ width: 56, height: 56 }} />
            )}
          </Box> */}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "회원가입"}
            </Button>
          </form>
        </Grow>
        {message && (
          <Typography
            variant="body2"
            color={message.includes("완료") ? "success.main" : "error"}
            sx={{ marginTop: "20px" }}
          >
            {message}
          </Typography>
        )}

      </Box>
    </Box>
  );
};

export default Register;