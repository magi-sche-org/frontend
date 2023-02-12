import { Header } from "@/components/Header";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import "@/styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import {useEffect, useRef} from "react";
import {fetchToken} from "@/libraries/token";

export default function App({ Component, pageProps }: AppProps) {
  const init = useRef(false);
  useEffect(() => {
    if (typeof window !== "object" || init.current) return;
    init.current = true;
    if (localStorage.getItem("go_token")) return;
    (async()=>{
      await fetchToken();
    })();
  }, []);
  const mainTheme = createTheme({
    typography: {
      fontFamily: ['"Noto Sans"', '"Helvetica"', "Arial"].join(",")
    },
    palette: {
      primary: {
        main: "#006A71",
        light: "#46989F"
      },
      secondary: {
        main: "#FFFFDD"
      }
    }
  });

  const router = useRouter();

  return (
    <>
      <ThemeProvider theme={mainTheme}>
        <SnackbarProvider>
          {router.asPath === "/" ? <Header /> : <></>}
          {router.asPath.indexOf("guest") === 1 || router.asPath.indexOf("detail") === 1 ? (
            <SecondaryHeader />
          ) : (
            <></>
          )}
          <Component {...pageProps} />
          <CssBaseline />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
