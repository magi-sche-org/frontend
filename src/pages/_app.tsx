import { Header } from "@/components/Header";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import "@/styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect, useRef } from "react";
import Head from "next/head";
import { theme } from "@/theme/theme";

export default function App({ Component, pageProps }: AppProps) {
  const init = useRef(false);
  useEffect(() => {
    if (typeof window !== "object" || init.current) return;
    init.current = true;
  }, []);

  const router = useRouter();

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
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          {router.asPath === "/" && <Header />}
          {(router.asPath.indexOf("guest") === 1 ||
            router.asPath.indexOf("detail") === 1) && <SecondaryHeader />}
          <Component {...pageProps} />
          <CssBaseline />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
