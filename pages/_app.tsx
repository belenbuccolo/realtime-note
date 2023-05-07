import Head from "next/head";
import "../style.css";
import type { AppProps } from "next/app";

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap"
          rel="stylesheet"
        />
        <title>Note</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default CustomApp;
