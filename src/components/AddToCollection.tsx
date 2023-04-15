import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Loading,
  Modal,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";

import type { DBResult, getMyCollections } from "@/lib/db";
import NewCollection from "@/components/NewCollection";

export default function AddToCollection(props: { inkId: number }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button bordered auto onClick={() => setVisible(true)}>
        + &nbsp; Add to a Collection
      </Button>
      <AddToCollectionModal
        visible={visible}
        onClose={() => setVisible(false)}
        inkId={props.inkId}
      />
    </>
  );
}

function AddToCollectionModal(props: {
  visible: boolean;
  onClose: () => void;
  inkId: number;
}) {
  return (
    <Modal open={props.visible} onClose={props.onClose} closeButton scroll>
      <Modal.Header>
        <Text size={20}>
          Add to a <Text b>Collection</Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <ModalBody inkId={props.inkId} />
      </Modal.Body>
    </Modal>
  );
}

type Collection = DBResult<typeof getMyCollections>[0];

function ModalBody(props: { inkId: number }) {
  const [collections, setCollections] = useState<
    DBResult<typeof getMyCollections> | undefined
  >(undefined);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((res: DBResult<typeof getMyCollections>) => setCollections(res));
  }, []);

  if (collections === undefined) {
    return (
      <div className="flex center col">
        <Loading />
        <Spacer />
      </div>
    );
  }

  return (
    <div className="card-list">
      <Button bordered auto onClick={() => setVisible(true)}>
        + &nbsp; New Collection
      </Button>
      <NewCollection
        visible={visible}
        redirect={false}
        onClose={() => {
          setVisible(false);
          fetch("/api/collections")
            .then((res) => res.json())
            .then((res: DBResult<typeof getMyCollections>) =>
              setCollections(res)
            );
        }}
      />
      {collections.map((collection, index) => (
        <CollectionCard
          collection={collection}
          key={index}
          inkId={props.inkId}
        />
      ))}
    </div>
  );
}

function CollectionCard(props: { collection: Collection; inkId: number }) {
  const [selected, setSelected] = useState(
    props.collection.inks.findIndex((ink) => ink.inkId === props.inkId) !== -1
  );
  const numItems = props.collection.inks.length;

  function select() {
    setSelected((selected) => {
      fetch("/api/collections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: props.collection.id,
          inkId: props.inkId,
          selected: !selected,
        }),
      });

      return !selected;
    });
  }

  return (
    <Card
      variant="bordered"
      isPressable
      onClick={select}
      css={{ borderColor: selected ? "$primary" : undefined }}
    >
      <Card.Body>
        <Row wrap="wrap" justify="space-between" align="center">
          <Text b css={{ color: selected ? "$primary" : undefined }}>
            {props.collection.name}
          </Text>
          <Text
            css={{
              color: selected ? "$primary" : "$accents7",
              fontWeight: "$semibold",
              fontSize: "$sm",
            }}
          >
            {numItems} ink{numItems !== 1 && "s"}
          </Text>
        </Row>
      </Card.Body>
    </Card>
  );
}
