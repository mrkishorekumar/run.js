import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RunJS.in : Free Online Javascript Complier</title>

        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="M R Kishore Kumar" />
        <meta name="keywords" content="runjs" />
        <meta
          name="description"
          content="Our intuitive JavaScript Online Compiler allows you to write and run JavaScript code directly in your web browser."
        />
        <meta property="og:url" content="https://runjs.rigial.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="JavaScript Online Compiler & Interpreter"
        />
        <meta
          property="og:description"
          content="Our intuitive JavaScript Online Compiler allows you to write and run JavaScript code directly in your web browser."
        />
        <meta
          property="og:image"
          content="https://runjs.rigial.com/runjs.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
