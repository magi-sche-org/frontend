import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "../Button";
import { EventList } from "./EventList";
export const TopPage = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        background: "#006A71",
        // vhにするとスクロール出来てしまうのが問題だが（ヘッダーのサイズがあるため）
        // 良い感じの指定の仕方が欲しい
        height: "120vh",
        width: "100%",
        padding: "0 30px",
        flexFlow: "column",
      }}
      display="flex"
    >
      <Box
        margin={"3rem 0"}
        display="flex"
        sx={{
          flexFlow: "column",
        }}
      >
        <Typography
          color={"white"}
          sx={{
            fontSize: 14,
          }}
          textAlign="center"
        >
          カレンダーを見ながら簡単にスケジュール調整出来るアプリ。
          <br />
          マジックスケジュール
        </Typography>
        <Box display="flex" justifyContent="center">
          <Image
            src={"/images/schedule.png"}
            alt={"scheduleを考える女性の画像"}
            height={200}
            width={300}
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
      <Button
        text="イベントを作成する"
        isPrimary={false}
        onClick={() => {
          router.push("/create");
        }}
      />
      <Box marginTop={"20px"}>
        <Typography
          color={"white"}
          sx={{ fontSize: 16, fontWeight: "bold" }}
          gutterBottom
        >
          イベント一覧
        </Typography>
        <EventList />
      </Box>
    </Box>
  );
};
