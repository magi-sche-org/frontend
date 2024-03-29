import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { Stack } from "@mui/system";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import * as React from "react";
import { useState } from "react";

import { Login } from "@/components/login";
import { useUser } from "@/hooks/user";

type Props = {
  type?: "primary" | "secondary";
};

export const Header: FC<Props> = ({ type = "primary" }) => {
  const router = useRouter();
  const [loginModalActive, setLoginModalActive] = useState(false);
  const { user, logout } = useUser();
  const handleMenu = (): void => {
    if (!user?.isRegistered) {
      setLoginModalActive(true);
    } else {
      logout();
    }
  };
  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={type === "primary" ? "#006A71" : "#FFFFDD"}
        />
      </Head>
      <AppBar
        position="static"
        sx={{ backgroundColor: `${type}.main`, boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container maxWidth="md">
          <Stack direction="row" justifyContent="space-around">
            <IconButton edge="start" size="large" disabled>
              <AccountCircle sx={{ color: `${type}.main` }} />
            </IconButton>
            <Button onClick={() => void router.push("/")}>
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
                <LogoutIcon
                  sx={{ color: type === "primary" ? "white" : "black" }}
                />
              ) : (
                <AccountCircle
                  sx={{ color: type === "primary" ? "white" : "black" }}
                />
              )}
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
      {loginModalActive && <Login onClose={() => setLoginModalActive(false)} />}
    </>
  );
};
