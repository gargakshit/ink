import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </SessionProvider>
  );
}
