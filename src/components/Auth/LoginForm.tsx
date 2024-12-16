/**
 * Login.tsx
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/21
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  login,
  kakaoSocialLogin,
  googleSocialLogin,
} from "../../api/requests/authApi";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Grow,
  Box,
} from "@mui/material";
import { ReactComponent as GoogleSignin } from "../../assets/googleSignin.svg";
import KakaoSignin from "../../assets/kakaoSignin.png";
import { logout } from "../../api/requests/authApi";

const LoginForm: React.FC = () => {
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();// 백엔드로 로그아웃 요청 보내기
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    }
    performLogout();
  }, []);

  const [formValue, setFormValue] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const SOCIAL_LOGIN_BUTTON_SIZE = {
    width: 183,
    height: 45,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const userData = await login(formValue.email, formValue.password);
      if (userData) {
        navigate("/");
        console.log(userData);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "로그인에 실패했습니다.");
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

      <Box
        maxWidth="md"
        sx={{
          padding: "0 32px",
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "40px"
        }}
      >

        <Typography variant="h4" gutterBottom color="primary">
          로그인
        </Typography>
        <Grow in>
          <form onSubmit={handleLogin}>
            <TextField
              name="email"
              label="이메일"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formValue.email}
              onChange={handleChange}
            />
            <TextField
              name="password"
              label="비밀번호"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formValue.password}
              onChange={handleChange}
            />
            {message && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "10px" }}
              >
                {message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ marginTop: "20px" }}
            >
              {loading ? <CircularProgress size={24} /> : "로그인"}
            </Button>
          </form>
        </Grow>
        <Grow in>
          <Typography variant="body1" sx={{ margin: "20px 0" }}>
            또는
          </Typography>
        </Grow>
        <Grow in>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                onClick={googleSocialLogin}
                sx={{
                  padding: 0, // 기본 패딩 제거
                  minWidth: "auto", // 최소 너비 제거
                  display: "inline-flex", // SVG 크기에 맞추기
                }}
              >
                <GoogleSignin
                  style={{
                    width: SOCIAL_LOGIN_BUTTON_SIZE.width,
                    height: SOCIAL_LOGIN_BUTTON_SIZE.height,
                  }}
                />
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={kakaoSocialLogin}
                style={{
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  alignContent: "center",
                }}
              >
                <img
                  src={KakaoSignin}
                  alt="이미지 버튼"
                  style={{
                    width: SOCIAL_LOGIN_BUTTON_SIZE.width,
                    height: SOCIAL_LOGIN_BUTTON_SIZE.height,
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </Grow>
        <Grow in>
          <Typography variant="body1" sx={{ margin: "25px 0" }}>
            ...아직 회원이 아니신가요?
          </Typography>
        </Grow>
        <Grow in>
          <Grid item>
            <Button
              component="a"
              onClick={() => {
                setTimeout(() => navigate("/register"), 250); // 250ms 후 이동
              }}
              style={{
                padding: 0,
                border: "none",
                background: "none",
                cursor: "pointer",
                alignContent: "center",
                fontSize: "1.2em",
                textDecoration: "underline", // 밑줄
                textDecorationThickness: "1px", // 밑줄 두께
                textUnderlineOffset: "0.3em", // 밑줄과 텍스트 간격
                fontWeight: "bold", // 굵게
              }}
            >
              <span>지금 회원가입하세요✨</span>
            </Button>
          </Grid>
        </Grow>
      </Box>

    </Box>

  );
};

export default LoginForm;
