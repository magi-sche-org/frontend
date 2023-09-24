import { Typography } from "@mui/material";
import { ReactNode } from "react";

type props = {
  children: ReactNode;
};

export const PageTitle = ({ children }: props) => {
  return (
    <Typography variant="h5" sx={{ textAlign: "center" }}>
      {children}
    </Typography>
  );
};
