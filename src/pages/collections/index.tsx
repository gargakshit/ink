import { Button, Container, Grid, Spacer } from "@nextui-org/react";
import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";

import NewCollection from "@/components/NewCollection";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import EmptyState from "@/components/EmptyState";
import { type DBResult, getMyCollectionsHome } from "@/lib/db";
import CollectionCard from "@/components/CollectionCard";

interface Props {
  collections: DBResult<typeof getMyCollectionsHome>;
}

export default function CollectionsPage(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Head>
        <title>My Collections | Ink</title>
      </Head>
      <NewCollection visible={visible} onClose={() => setVisible(false)} />
      <Container md>
        <Spacer />
        <Spacer />
        <div className="collection-header">
          <div>
            <h1>My Collections</h1>
            <p className="sub-t">
              {props.collections.length} collection
              {props.collections.length !== 1 && "s"}
            </p>
          </div>
          <Button flat onClick={() => setVisible(true)}>
            New Collection
          </Button>
        </div>
        <Spacer />
        {props.collections.length === 0 && <EmptyState />}
        <Grid.Container gap={2}>
          {props.collections.map((collection, index) => (
            <CollectionCard collection={collection} key={index} />
          ))}
        </Grid.Container>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props, {}> = async (
  context,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const collections = await getMyCollectionsHome(session);
  return { props: { collections: collections! } };
};
