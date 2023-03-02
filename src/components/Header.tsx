import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { login, revokeToken } from "@/libraries/authorization";
import { getUserInfo } from "@/libraries/userInfo";
import { Button, Container } from "@mui/material";
import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // booleanとして認識させたいためlint避ける
  // rome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
  const [isLogin, setIsLogin] = useState(getUserInfo() && true);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (getUserInfo()) {
      revokeToken().then(() => setIsLogin(false));
    } else {
      login();
    }
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#FFFFDD"
        />
      </Head>
      <AppBar
        position="static"
        sx={{ backgroundColor: "secondary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Toolbar sx={{ xs: "flex" }}>
            <IconButton edge="start" size="large" disabled>
              <AccountCircle sx={{ color: "secondary.main" }} />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                mx: "auto",
                color: "black",
                fontFamily: "robots",
                fontWeight: "bold",
              }}
            >
              Magi-Sche
            </Typography>
            <IconButton
              edge="end"
              size="large"
              color="inherit"
              onClick={handleMenu}
            >
              {isLogin ? (
                <>
                  <LogoutIcon sx={{ color: "black" }} />
                </>
              ) : (
                <AccountCircle sx={{ color: "black" }} />
              )}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
