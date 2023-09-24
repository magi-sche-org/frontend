import "@/styles/globals.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";

import { Header } from "@/components/Header/Header";
import { theme } from "@/theme/theme";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const headerType = (() => {
    if (router.asPath === "/") {
      return "secondary";
    }
    if (router.asPath.match(/\/callback/)) {
      return undefined;
    }
    return "primary";
  })();

  return (
    <>
      <Head>
        <title>Magi-Sche</title>
        <meta
          name="description"
          content="カレンダーを見ながら簡単にスケジュール調整出来るアプリ。Magi-Sche"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Quicksand&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          {headerType && <Header type={headerType} />}
          <Component {...pageProps} />
          <CssBaseline />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
