import React from "react";
import { Avatar, Dropdown, Link, Navbar, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { navItems } from "@/lib/nav-items";
import NavUser from "./NavUser";

function isActive(
  pathname: string,
  item: { exact: boolean; url: string; startsWith?: string }
): boolean {
  if (item.exact) {
    return pathname === item.url;
  }

  return pathname.startsWith(item.startsWith!);
}

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
            isActive={isActive(router.pathname, item)}
            href={item.url}
            onClick={(e) => {
              e.preventDefault();
              router.push(item.url);
            }}
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
            isActive={isActive(router.pathname, item)}
          >
            <NextLink
              href={item.url}
              style={{ minWidth: "100%", color: "inherit" }}
            >
              {item.title}
            </NextLink>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}