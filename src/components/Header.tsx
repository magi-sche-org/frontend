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
import {login, reset} from "@/libraries/authorization";
import {getUserInfo} from "@/libraries/userInfo";

export const Header = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		if(getUserInfo()){
			void reset();
		}else{
			login();
		}
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "#FFFFDD", color: "black", height: "62px" }}
		>
			<Toolbar sx={{ margin: "0 auto", width: "100%", alignItems: "center" }}>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					マジスケ
				</Typography>
				<div>
					<IconButton size="large" onClick={handleMenu} color="inherit">
						<AccountCircle />
					</IconButton>
				</div>
			</Toolbar>
		</AppBar>
	);
};
