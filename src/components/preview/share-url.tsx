import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import {
  Container,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import type { FC } from "react";

import { Button as CButton } from "@/components/Button";

const ModalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  border: "0.5px solid",
  borderRadius: 5,
  boxShadow: 10,
  p: 1,
  py: 5,
};

type DisplayShareURLModalProps = { isOpen: boolean; shareURL: string };
const DisplayShareURLModal: FC<DisplayShareURLModalProps> = ({
  isOpen,
  shareURL,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const copyTextToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        enqueueSnackbar("URLをコピーしました", {
          autoHideDuration: 2000,
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("URLのコピーに失敗しました", {
          autoHideDuration: 2000,
          variant: "error",
        });
      });
  };
  return (
    <Modal open={isOpen}>
      <Container maxWidth="xs" sx={{ ...ModalStyle }}>
        <Stack direction="column" sx={{ mx: 8 }}>
          <Typography
            variant="h6"
            noWrap={true}
            sx={{ textAlign: "center", mb: 4 }}
          >
            イベントを作成しました
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center", mb: 1.5 }}>
            共有URL
          </Typography>
          <TextField
            variant="standard"
            InputProps={{
              startAdornment: (
                <IconButton
                  onClick={() => {
                    copyTextToClipboard(shareURL);
                  }}
                >
                  <ContentCopyOutlinedIcon />
                </IconButton>
              ),
            }}
            sx={{ mb: 4 }}
            value={shareURL}
          />
          <Stack spacing={2} sx={{ mb: 2 }}>
            {" "}
            <CButton
              text="トップに戻る"
              isPrimary={true}
              onClick={() => {
                void router.push("/");
              }}
            />{" "}
            <CButton
              text="イベントを確認"
              isPrimary={false}
              onClick={() => {
                void router.push(shareURL.replace("guest", "detail"));
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Modal>
  );
};

export { DisplayShareURLModal };
