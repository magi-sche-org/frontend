import { Typography } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageTitle = ({ children }: Props) => {
  return (
    <Typography variant="h5" sx={{ textAlign: "center" }}>
      {children}
    </Typography>
  );
};
