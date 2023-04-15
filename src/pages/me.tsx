import React from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getUserSlug } from "@/lib/db";

export default function MePage() {
  return <h1>Me!</h1>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const slug = await getUserSlug(session.user!.email!);
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
      destination: `/user/${slug.slug}`,
      permanent: false,
    },
  };
};
