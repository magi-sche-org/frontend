import { Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageTitle: FC<Props> = ({ children }) => {
  return (
    <Typography variant="h5" sx={{ textAlign: "center" }}>
      {children}
    </Typography>
  );
};
