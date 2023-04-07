import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { newInk } from "@/lib/db";

export default function CreatePage() {
  return (
    <>
      <Head>
        <title>Create | Ink</title>
      </Head>
      <h3>Awaiting something new...</h3>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const slug = await newInk(session);

  if (!slug) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/ink/${slug}`,
      permanent: false,
    },
  };
}
