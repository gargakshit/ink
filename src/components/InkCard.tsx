import { Card, Grid, Text } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/router";

export default function InkCard(props: {
  ink: {
    name: string;
    slug: string;
    rendered: string | null;
    creator: { name: string; avatar: string; slug: string };
  };
}) {
  const router = useRouter();

  return (
    <Grid xs={3}>
      <Card
        isPressable
        isHoverable
        variant="bordered"
        onClick={() => router.push(`/ink/${props.ink.slug}`)}
      >
        <Card.Body css={{ p: 0 }}>
          <div className="flex">
            <div
              className="card-ink-preview"
              dangerouslySetInnerHTML={{ __html: props.ink.rendered ?? "" }}
            />
          </div>
        </Card.Body>
        <Card.Footer
          css={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Text b>{props.ink.name}</Text>
          <div className="avatar-small">
            <img
              src={props.ink.creator.avatar}
              alt="avatar"
              width="24px"
              height="24px"
            />
            <p>{props.ink.creator.name}</p>
          </div>
        </Card.Footer>
      </Card>
    </Grid>
  );
}
