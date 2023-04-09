import React from "react";

interface Props {
  svg?: string;
}

export default function InkViewer(props: Props) {
  return (
    <>
      {props.svg ? (
        <div
          className="ink-viewer"
          dangerouslySetInnerHTML={{ __html: props.svg }}
        />
      ) : (
        <div className="ink-viewer">
          <div className="ink-viewer-placeholder">
            <h1>Awaiting Awesomeness!</h1>
            <p>Ctrl + Enter is all it takes...</p>
          </div>
        </div>
      )}
    </>
  );
}
