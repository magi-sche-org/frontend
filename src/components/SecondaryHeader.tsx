import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/system";
import Head from "next/head";
import { Button, Stack } from "@mui/material";
import Image from "next/image";

export const SecondaryHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Head>
        <meta name='theme-color' content='#006A71' />
      </Head>
      <AppBar
        position='static'
        sx={{ backgroundColor: "primary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction='row' justifyContent='space-around'>
            <IconButton edge='start' size='large' disabled>
              <AccountCircle sx={{ color: "primary.main" }} />
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
              <AccountCircle />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
    </>
  );
};
