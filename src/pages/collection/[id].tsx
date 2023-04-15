import { Container, Grid, Spacer } from "@nextui-org/react";
import React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { type DBResult, loadCollection } from "@/lib/db";
import EmptyState from "@/components/EmptyState";
import InkCard from "@/components/InkCard";

interface Props {
  collection: DBResult<typeof loadCollection>;
}

export default function CollectionPage(props: Props) {
  return (
    <>
      <Head>
        <title>{props.collection.name} | Ink</title>
      </Head>
      <Container md>
        <Spacer />
        <Spacer />
        <div className="collection-header">
          <div>
            <h1>{props.collection.name}</h1>
            <p className="sub-t">
              {props.collection.inks.length} ink
              {props.collection.inks.length !== 1 && "s"}
            </p>
          </div>
          <Link
            className="avatar"
            href={`/user/${props.collection.curator.slug}`}
          >
            <img
              src={props.collection.curator.avatar}
              alt="avatar"
              width="36px"
              height="36px"
            />
            <p>{props.collection.curator.name}</p>
          </Link>
        </div>
        <Spacer />
        {props.collection.inks.length === 0 && <EmptyState />}
        <Grid.Container gap={2}>
          {props.collection.inks.map((ink, index) => (
            <InkCard ink={ink.ink} key={index} />
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
  const collection = await loadCollection(context.params!.id);
  if (!collection) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { collection } };
};
