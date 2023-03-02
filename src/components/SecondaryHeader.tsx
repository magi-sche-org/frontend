import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/system";
import Head from "next/head";
import { getUserInfo } from "@/libraries/userInfo";
import { login, revokeToken } from "@/libraries/authorization";
import LogoutIcon from "@mui/icons-material/Logout";
import { FC, useState } from "react";

export const SecondaryHeader: FC = () => {
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
          content="#006A71"
        />
      </Head>
      <AppBar
        position="static"
        sx={{ backgroundColor: "primary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Toolbar sx={{ xs: "flex" }}>
            <IconButton edge="start" size="large" disabled>
              <AccountCircle sx={{ color: "primary.main" }} />
            </IconButton>
            <Typography
              variant="h5"
              sx={{ mx: "auto", fontFamily: "robots", fontWeight: "bold" }}
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
                <LogoutIcon />
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
