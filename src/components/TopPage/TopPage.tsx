import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { Button } from "../Button";
import { EventList } from "./EventList";
export const TopPage = () => {
  return (
    <Box
      sx={{
        background: "#006A71",
        // 100vhにするとスクロール出来てしまうのが問題だが（ヘッダーのサイズがあるため）
        // 良い感じの指定の仕方が欲しい
        height: "100vh",
        width: "100%",
        padding: "0 30px",
        flexFlow: "column",
      }}
      display="flex"
    >
      <Box marginTop={"3rem"} display="flex" justifyContent="center">
        <Image
          src={"/images/schedule.png"}
          alt={"scheduleを考える女性の画像"}
          height={300}
          width={300}
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Button text="イベントを作成する" isPrimary={false} onClick={() => {}} />
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
