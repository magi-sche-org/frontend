import { Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  children: React.ReactNode;
};

export const PageTitle: FC<Props> = ({ children }) => {
  return (
    <Typography variant="h5" sx={{ textAlign: "center" }}>
      {children}
    </Typography>
  );
};
