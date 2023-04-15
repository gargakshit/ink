import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { getRandomCollection, getRandomInk, getRandomUser } from "@/lib/db";

export default function LuckyPage() {
  return (
    <Head>
      <title>Lucky | Ink</title>
    </Head>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const showCollection = Math.random() >= 0.5;
  if (showCollection) {
    const slug = await getRandomCollection();
    return {
      redirect: {
        destination: `/collection/${slug[0].slug}`,
        permanent: false,
      },
    };
  }

  const showUser = Math.random() >= 0.7;
  if (showUser) {
    const slug = await getRandomUser();
    return {
      redirect: {
        destination: `/user/${slug[0].slug}`,
        permanent: false,
      },
    };
  }

  const slug = await getRandomInk();
  return {
    redirect: {
      destination: `/ink/${slug[0].slug}`,
      permanent: false,
    },
  };
};
