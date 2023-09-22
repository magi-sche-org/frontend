import * as React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Button, Container } from "@mui/material";
import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import Image from "next/image";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { Login } from "@/components/login";
import { useUser } from "@/hooks/user";

type props = {
  type?: "primary" | "secondary";
};

export const Header = ({ type = "primary" }: props) => {
  const router = useRouter();
  const [loginModalActive, setLoginModalActive] = useState(false);
  const { user, logout } = useUser();
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!user?.isRegistered) {
      setLoginModalActive(true);
    } else {
      logout();
    }
  };
  return (
    <>
      <Head>
        <meta name="theme-color" content="#FFFFDD" />
      </Head>
      <AppBar
        position="static"
        sx={{ backgroundColor: `${type}.main`, boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction="row" justifyContent="space-around">
            <IconButton edge="start" size="large" disabled>
              <AccountCircle sx={{ color: `${type}.main` }} />
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
              {user?.isRegistered ? (
                <LogoutIcon sx={{ color: "black" }} />
              ) : (
                <AccountCircle sx={{ color: "black" }} />
              )}
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
      {loginModalActive && <Login onClose={() => setLoginModalActive(false)} />}
    </>
  );
};
