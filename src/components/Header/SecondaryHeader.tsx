import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/system";
import Head from "next/head";
import { getUserInfo } from "@/libraries/userInfo";
import { login, revokeToken } from "@/libraries/authorization";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import type { MouseEvent, FC } from "react";
import { Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export const SecondaryHeader: FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(!!getUserInfo());
  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    if (getUserInfo()) {
      revokeToken().then(() => setIsLogin(false));
    } else {
      login();
    }
  };
  return (
    <>
      <Head>
        <meta name="theme-color" content="#006A71" />
      </Head>
      <AppBar
        position="static"
        sx={{ backgroundColor: "primary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction="row" justifyContent="space-around">
            <IconButton edge="start" size="large" disabled>
              <AccountCircle sx={{ color: "primary.main" }} />
            </IconButton>
            <Button onClick={() => router.push("/")}>
              <Image
                src={"/images/logo.png"}
                alt={"logo"}
                height={40}
                width={200}
                style={{ objectFit: "contain" }}
              />
            </Button>
            <IconButton
              edge="end"
              size="large"
              color="inherit"
              onClick={handleMenu}
            >
              {isLogin ? (
                <LogoutIcon />
              ) : (
                <AccountCircle sx={{ color: "white" }} />
              )}
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
    </>
  );
};
