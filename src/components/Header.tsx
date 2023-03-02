import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { login, revokeToken } from "@/libraries/authorization";
import { getUserInfo } from "@/libraries/userInfo";
import { Button, Container } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { Stack } from "@mui/system";

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (getUserInfo()) {
      void revokeToken();
    } else {
      login();
    }
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Head>
        <meta name='theme-color' content='#FFFFDD' />
      </Head>
      <AppBar
        position='static'
        sx={{ backgroundColor: "secondary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction='row' justifyContent='space-around'>
            <IconButton edge='start' size='large' disabled>
              <AccountCircle sx={{ color: "secondary.main" }} />
            </IconButton>
            <Button>
              <Image
                src={"/images/logo.png"}
                alt={"logo"}
                height={40}
                width={200}
                style={{ objectFit: "contain" }}
              />
            </Button>
            <IconButton edge='end' size='large' color='inherit' onClick={handleMenu}>
              <AccountCircle sx={{ color: "black" }} />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
    </>
  );
};
