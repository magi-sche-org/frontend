import { Header } from "@/components/Header";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import "@/styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
	const mainTheme = createTheme({
		typography: {
			fontFamily: ["Roboto", '"Noto Sans JP"', '"Helvetica"', "Arial", "sans-serif"].join(",")
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
				{router.asPath === "/" ? (
					<Header />
				) : router.asPath === "/GestPage" ? (
					<SecondaryHeader />
				) : (
					<></>
				)}
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}
