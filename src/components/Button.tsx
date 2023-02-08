import { Button as MUIButton } from "@mui/material";
import { FC } from "react";

type ButtonProps = {
  text: string;
  isPrimary: boolean;
  onClick: () => void;
};
export const Button: FC<ButtonProps> = ({ text, isPrimary, onClick }) => {
  return (
    <MUIButton
      fullWidth
      variant="outlined"
      sx={{
        background: isPrimary ? "#006A71" : "white",
        padding: "12px",
        color: isPrimary ? "white" : "black",
      }}
      onClick={onClick}
    >
      {text}
    </MUIButton>
  );
};
