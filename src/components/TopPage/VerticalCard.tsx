import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button } from "@mui/material";
import { Stack } from "@mui/system";

type props = {
  isUp: boolean;
  onClick: (isUp: boolean) => void;
};

export const VerticalCard = ({ isUp, onClick }: props) => {
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
