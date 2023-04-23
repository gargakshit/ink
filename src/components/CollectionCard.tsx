import React from "react";
import { Card, Grid, Row, Text } from "@nextui-org/react";

import type { DBResult, getMyCollectionsHome } from "@/lib/db";
import { useRouter } from "next/router";

export default function CollectionCard(props: {
  collection: DBResult<typeof getMyCollectionsHome>[0];
}) {
  const router = useRouter();

  const collection = props.collection;
  const renderedInks = collection.inks
    .filter((ink) => ink.ink.rendered !== undefined)
    .slice(0, 2);

  return (
    <Grid xs={3}>
      <Card
        isPressable
        isHoverable
        variant="bordered"
        onClick={() => router.push(`/collection/${collection.slug}`)}
      >
        <Card.Body css={{ p: 0 }}>
          <div className="flex">
            {renderedInks.map((ink, index) => (
              <div
                className="card-ink-preview"
                dangerouslySetInnerHTML={{ __html: ink.ink.rendered! }}
                key={index}
              />
            ))}
            {renderedInks.length === 0 && (
              <div className="collection-card-empty">
                <h3>Museums</h3>
                <p>Sometimes are empty</p>
              </div>
            )}
          </div>
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
  );
}
