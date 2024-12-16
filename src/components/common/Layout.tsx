import { Container, Typography, Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import NewNavbar from "./newNavbar";
import Recombar from "./recombar";

const Layout: React.FC = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        width: "80%",
      }}
    >
      {/* 네브바 */}
      <Box
        sx={{
          width: "20%",

          // backgroundColor: "#f7f7f7",
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
          // padding: "16px",
          // margin: "0px"
        }}

      // MuiContainer-root={
      //   {
      //     Padding: "0px"
      //   }
      // }
      >
        <NewNavbar />
      </Box>

      {/* 컴포넌트들 */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0px",
          margin: "0px",
        }}
      >
        <Outlet />
      </Box>

      {/* 오른편 추천 바*/}
      <Box

        sx={{
          width: "30%",

        }}
      >
        <Recombar />
      </Box>

    </Container>
  );
};

export default Layout;
