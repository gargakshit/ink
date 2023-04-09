import React from "react";

interface Props {
  svg?: string;
}

export default function InkViewer(props: Props) {
  return (
    <div
      className="flex-1"
      dangerouslySetInnerHTML={{ __html: props.svg ?? "" }}
    />
  );
}
