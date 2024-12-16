/**
 * Navbar.tsx
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/21
 */

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar: React.FC = () => {
  // localStorage에서 사용자 정보 확인
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Celebright
          </RouterLink>
        </Typography>
        <Box>
          {!user && ( // 로그인 상태가 아닐 때만 표시
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                로그인
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                회원가입
              </Button>
            </>
          )}
          {user && ( // 로그인 상태일 때만 표시
            <>
          <Button color="inherit" component={RouterLink} to="/access">
            게시판
          </Button>
              <Button color="inherit" component={RouterLink} to="/room">
                채팅
              </Button>
              <Button color="inherit" component={RouterLink} to="/mypage">
                마이페이지
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;