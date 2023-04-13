import React, { useEffect, useState } from "react";
import { Button, Input, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import { PaintBrushIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NewCollection(props: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => setLoading(false), []);

  return (
    <Modal closeButton onClose={props.onClose} open={props.visible}>
      <Modal.Header>
        <Text size={20}>
          Create a <Text b>Collection</Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          contentLeft={<PaintBrushIcon width={32} />}
          fullWidth
          size="lg"
          placeholder="Name"
          color="secondary"
          bordered
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          onPress={async () => {
            setLoading(true);
            await fetch("/api/collections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });
            props.onClose();
            await router.replace("/collections");
            setLoading(false);
            setName("");
          }}
          disabled={loading}
          color="secondary"
        >
          {loading && (
            <>
              <Loading color="secondary" size="sm" />
              <Spacer />
            </>
          )}{" "}
          {loading ? "Creating..." : "Create!"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
