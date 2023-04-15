import React from "react";
import Head from "next/head";
import { Container, Grid, Spacer } from "@nextui-org/react";
import type { GetServerSideProps } from "next";

import { type DBResult, getUser } from "@/lib/db";
import EmptyState from "@/components/EmptyState";
import InkCard from "@/components/InkCard";
import CollectionCard from "@/components/CollectionCard";

interface Props {
  user: DBResult<typeof getUser>;
}

export default function UserPage(props: Props) {
  return (
    <>
      <Head>
        <title>{props.user.name} | Ink</title>
      </Head>
      <Container md>
        <Spacer />
        <Spacer />
        <div className="collection-header">
          <div>
            <h1>{props.user.name}</h1>
            <p className="sub-t">
              {props.user.inks.length} ink
              {props.user.inks.length !== 1 && "s"},&nbsp;
              {props.user.collections.length} collection
              {props.user.collections.length !== 1 && "s"}
            </p>
          </div>
        </div>
        <Spacer />
        <h2 className="px-12">Collections</h2>
        {props.user.collections.length === 0 && <EmptyState />}
        <Grid.Container gap={2}>
          {props.user.collections.map((collection, index) => (
            <CollectionCard collection={collection} key={index} />
          ))}
        </Grid.Container>
        <Spacer />
        <h2 className="px-12">Inks</h2>
        {props.user.inks.length === 0 && <EmptyState />}
        <Grid.Container gap={2}>
          {props.user.inks.map((ink, index) => (
            <InkCard ink={ink} key={index} />
          ))}
        </Grid.Container>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const user = await getUser(context.params!.id);
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { user } };
};
