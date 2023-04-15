import {
  Button,
  Card,
  Container,
  Grid,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";

import NewCollection from "@/components/NewCollection";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import EmptyState from "@/components/EmptyState";
import { type DBResult, getMyCollections } from "@/lib/db";

interface Props {
  collections: DBResult<typeof getMyCollections>;
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
          <h1>My Collections</h1>
          <Button flat onClick={() => setVisible(true)}>
            New Collection
          </Button>
        </div>
        <Spacer />
        {props.collections.length === 0 && <EmptyState />}
        <Grid.Container gap={2}>
          {props.collections.map((collection, index) => (
            <Grid key={index} xs={3}>
              <Card
                isPressable
                isHoverable
                variant="bordered"
                onClick={() => {}}
              >
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    src={`https://source.unsplash.com/featured/640x400?${index}`}
                    objectFit="cover"
                    width="100%"
                    height={140}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text b>{collection.name}</Text>
                    <Text
                      css={{
                        color: "$accents7",
                        fontWeight: "$semibold",
                        fontSize: "$sm",
                      }}
                    >
                      {collection.inks.length} item
                      {collection.inks.length !== 1 && "s"}
                    </Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
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
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const collections = await getMyCollections(session);
  return { props: { collections: collections! } };
};
