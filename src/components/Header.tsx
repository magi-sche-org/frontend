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
import { Container } from "@mui/material";

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static' sx={{ backgroundColor: "secondary.main", boxShadow: 0, px: 2 }}>
      <Container disableGutters>
        <Toolbar sx={{ xs: "flex" }}>
          <IconButton edge='start' size='large' disabled>
            <AccountCircle sx={{ color: "secondary.main" }} />
          </IconButton>
          <Typography variant='h6' sx={{ mx: "auto", color: "black" }}>
            Magi-Sche
          </Typography>
          <IconButton
            edge='end'
            size='large'
            onClick={handleMenu}
            color='inherit'
            sx={{ color: "black" }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
