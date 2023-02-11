import { Header } from "@/components/Header";
import { mockEventList } from "@/components/TopPage/data";
import "@/styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // データ無かったら適当なのを入れておく
  useEffect(() => {
    if (!localStorage.getItem("event-list")) {
      localStorage.setItem("event-list", JSON.stringify(mockEventList));
    }
  }, []);
  const mainTheme = createTheme({
    typography: {
      fontFamily: [
        "Roboto",
        '"Noto Sans JP"',
        '"Helvetica"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
    palette: {
      primary: {
        main: "#006A71",
        light: "#46989F",
      },
      secondary: {
        main: "#FFFFDD",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={mainTheme}>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
