import { Header } from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

if (process.env.NODE_ENV === "development") {
  // dynamic import でファイルを読み込んで MSW を有効にする
  const MockServer = () =>
    import("../mocks/browser").then((mo) => {
      mo.worker.start();
    });
  MockServer();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
