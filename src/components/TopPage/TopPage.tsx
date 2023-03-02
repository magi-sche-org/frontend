import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "../Button";
import { EventList } from "./EventList";
import ListButton from "./ListButton";

export const TopPage = () => {
  const router = useRouter();
  return (
    <Box sx={{ bgcolor: "primary.main" }}>
      <Container maxWidth='sm'>
        <Box
          sx={{
            backgroundColor: "primary.main",
            // vhにするとスクロール出来てしまうのが問題だが（ヘッダーのサイズがあるため）
            // 良い感じの指定の仕方が欲しい
            height: "120vh",
            width: "100%",
            padding: "0 30px",
            flexFlow: "column"
          }}
          display='flex'
        >
          <Box
            margin={"3rem 0"}
            display='flex'
            sx={{
              flexFlow: "column"
            }}
          >
            <Typography variant='body1' sx={{ color: "white", textAlign: "center" }}>
              カレンダーを見ながら簡単に
              <br />
              スケジュール調整出来るアプリ。
              <br />
              マジックスケジュール
            </Typography>
            <Box display='flex' justifyContent='center' sx={{ mt: 1 }}>
              <Image
                src={"/images/schedule.png"}
                alt={"scheduleを考える女性の画像"}
                height={200}
                width={300}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>
          <ListButton text='イベントを作成する' page='./create' />
          <Box sx={{ mt: 2 }}>
            <Typography variant='body1' sx={{ fontWeight: "bold", color: "white" }} gutterBottom>
              イベント一覧
            </Typography>
            <EventList />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
