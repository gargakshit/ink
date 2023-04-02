import React from "react";
import { Avatar, Dropdown, Link, Navbar, Text } from "@nextui-org/react";
import { useRouter } from "next/router";

import { navItems } from "@/lib/nav-items";
import NavUser from "./NavUser";

export default function Nav() {
  const router = useRouter();

  return (
    <Navbar variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand
        css={{
          "@xs": {
            w: "12%",
          },
        }}
      >
        <Text b color="inherit" hideIn="xs">
          Ink
        </Text>
      </Navbar.Brand>
      <Navbar.Content
        activeColor="secondary"
        hideIn="xs"
        variant="highlight"
        enableCursorHighlight
      >
        {navItems.map((item) => (
          <Navbar.Link
            key={item.title}
            href={item.url}
            isActive={item.url === router.pathname}
          >
            {item.title}
          </Navbar.Link>
        ))}
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        <NavUser />
      </Navbar.Content>
      <Navbar.Collapse>
        {navItems.map((item) => (
          <Navbar.CollapseItem
            key={item.title}
            activeColor="secondary"
            isActive={item.url === router.pathname}
          >
            <Link
              css={{
                minWidth: "100%",
              }}
              href={item.url}
            >
              {item.title}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
