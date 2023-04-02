import React from "react";

import Nav from "./Nav";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div style={{ maxWidth: "100%", boxSizing: "border-box" }}>
      <Nav />
      {children}
    </div>
  );
}
