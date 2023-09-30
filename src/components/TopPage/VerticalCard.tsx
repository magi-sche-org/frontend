import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button } from "@mui/material";
import { Stack } from "@mui/system";

type Props = {
  isUp: boolean;
  onClick: (isUp: boolean) => void;
};

export const VerticalCard = ({ isUp, onClick }: Props) => {
  return (
    <Stack
      sx={{
        borderRadius: 2,
        borderColor: "primary.main",
        bgcolor: "white",
      }}
    >
      <Button
        onClick={() => {
          onClick(isUp);
        }}
      >
        {isUp ? (
          <KeyboardArrowUpIcon fontSize="small" />
        ) : (
          <KeyboardArrowDownIcon fontSize="small" />
        )}
      </Button>
    </Stack>
  );
};
