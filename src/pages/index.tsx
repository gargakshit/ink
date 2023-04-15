import Head from "next/head";
import { Container, Grid, Loading, Spacer } from "@nextui-org/react";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { type DBResult, type exploreInks, getRecentlyEdited } from "@/lib/db";
import InkCard from "@/components/InkCard";
import { useEffect, useState } from "react";

interface Props {
  recentlyEdited: DBResult<typeof getRecentlyEdited> | null | undefined;
}

let cachedExplore: DBResult<typeof exploreInks> = [];

export default function Home(props: Props) {
  const [explore, setExplore] =
    useState<DBResult<typeof exploreInks>>(cachedExplore);

  useEffect(() => {
    cachedExplore = explore;
  }, [explore]);

  useEffect(() => {
    if (cachedExplore.length > 0) return;

    fetch("/api/ink/explore")
      .then((res) => res.json())
      .then(setExplore);
  }, []);

  return (
    <>
      <Head>
        <title>Home | Ink</title>
      </Head>
      <Container md>
        <Spacer />
        <Spacer />
        {props.recentlyEdited && (
          <>
            <div className="collection-header">
              <h1>Recently Edited</h1>
            </div>
            <Grid.Container gap={2}>
              {props.recentlyEdited.map((ink, index) => (
                <InkCard ink={ink} key={index} />
              ))}
            </Grid.Container>
            <Spacer />
          </>
        )}
        <div className="collection-header">
          <h1>Explore</h1>
        </div>
        <Grid.Container gap={2}>
          {explore.length === 0 && (
            <div className="flex col center">
              <Spacer />
              <div className="flex center">
                <Loading />
                <Spacer />
                <b style={{ opacity: "0.5" }}>
                  Are you inking, or am I inking, or are we both inking?
                </b>
              </div>
              <Spacer />
            </div>
          )}
          {explore.map((ink, index) => (
            <InkCard ink={ink} key={index} />
          ))}
        </Grid.Container>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props, {}> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const recentlyEdited = session && (await getRecentlyEdited(session));

  return {
    props: {
      recentlyEdited,
    },
  };
};
