import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import InkEditor from "@/components/InkEditor";
import { loadInk } from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { InkWorkerRequest, InkWorkerResponse } from "@/lib/worker/rpc";
import InkViewer from "@/components/InkViewer";

type Props = {
  canEdit: boolean;
  ink: NonNullable<Awaited<ReturnType<typeof loadInk>>>;
};

export default function EditorPage(props: Props) {
  const [ink, setInk] = useState(props.ink);
  const [canEdit, setCanEdit] = useState(props.canEdit);
  const [title, setTitle] = useState(getTitle());
  const [rendered, setRendered] = useState<string | undefined>(undefined);

  const workerRef = useRef<Worker>();

  function requestWorker(msg: InkWorkerRequest) {
    workerRef.current?.postMessage(msg);
  }

  function onWorkerMessage(msg: InkWorkerResponse) {
    switch (msg.type) {
      case "renderResult":
        setRendered(msg.args.svg);
        break;
    }
  }

  useEffect(() => {
    const worker = new Worker(new URL("@/lib/worker/ink.ts", import.meta.url));
    worker.addEventListener("message", (e) => onWorkerMessage(e.data));

    workerRef.current = worker;

    return () => {
      workerRef.current = undefined;
      worker.terminate();
    };
  });

  function getTitle() {
    return `${canEdit ? "Editing" : "Viewing"} "${props.ink.name}" | Ink`;
  }

  function resetStateFromProps() {
    setInk(props.ink);
    setCanEdit(props.canEdit);
    setTitle(getTitle());
    setRendered(props.ink.rendered ?? undefined);
  }

  useEffect(() => resetStateFromProps(), [props]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="editor-container">
        {/*<div>{ink.name}</div>*/}
        {/*<div>{canEdit ? "Can edit" : "No edit"}</div>*/}
        <div className="editor-split">
          <InkEditor
            initialCode={ink.source}
            canEdit={canEdit}
            id={ink.id}
            onRun={(source) => requestWorker({ type: "run", args: { source } })}
          />
          <InkViewer svg={rendered} />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  try {
    const ink = await loadInk(context.params!.id);
    if (!ink) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    const canEdit =
      (session && session.user && session.user.email === ink?.creator.email) ??
      false;

    return { props: { ink, canEdit } };
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
