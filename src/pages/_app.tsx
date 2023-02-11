import { Header } from "@/components/Header";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import "@/styles/globals.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";

export default function App({ Component, pageProps }: AppProps) {
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
          {router.asPath.indexOf("guest") === 1 ? <SecondaryHeader /> : <></>}
          <Component {...pageProps} />
          <CssBaseline />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
