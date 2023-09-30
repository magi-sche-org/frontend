import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import type { FC } from "react";

type Props = {
  text: string;
  page: string;
};

const ListButton: FC<Props> = ({ text, page }) => {
  const router = useRouter();
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
          void router.push(`${page}`);
        }}
        sx={{ p: 2.5 }}
      >
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          {text}
        </Typography>
      </Button>
    </Stack>
  );
};

export { ListButton };
