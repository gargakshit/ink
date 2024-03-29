import { NextUIProvider, createTheme } from "@nextui-org/react";
import type { AppProps } from "next/app";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const theme = createTheme({
    type: "dark",
    theme: {
      colors: {
        background: "#121212",
        backgroundAlpha: "#121212cc",
        primary: "#5eead4",
        primaryDark: "#5eead4",
        primaryLight: "#134e4a",
        primaryLightHover: "#115e59",
        primaryLightActive: "#115e59",
        primaryLightContrast: "#5eead4",
      },
      radii: { lg: "4px" },
    },
  });

  useEffect(() => {
    import("topbar").then(({ default: topbar }) => {
      Router.events.on("routeChangeStart", () => topbar.show(72));
      Router.events.on("routeChangeComplete", () => topbar.hide());
      Router.events.on("routeChangeError", () => topbar.hide());
    });
  }, [Router]);

  return (
    <SessionProvider session={session}>
      <NextUIProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </SessionProvider>
  );
}
