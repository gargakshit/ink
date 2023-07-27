import React from "react";
import { Navbar, Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { navItems } from "@/lib/nav-items";
import NavUser from "./NavUser";
import { useSession } from "next-auth/react";
import Image from "next/image";

import logo from "../assets/logo.webp";

function isActive(
  pathname: string,
  item: { exact: boolean; url: string; startsWith?: string },
): boolean {
  if (item.exact) {
    return pathname === item.url;
  }

  return pathname.startsWith(item.startsWith!);
}

export default function Nav() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = navItems(session?.user !== undefined);

  return (
    <Navbar variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand>
        <Spacer />
        <NextLink href="/">
          <Image src={logo} alt="Ink Logo" height={40} width={56} />
        </NextLink>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="highlight" enableCursorHighlight>
        {items.map((item) => (
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
        {items.map((item) => (
          <Navbar.CollapseItem
            key={item.title}
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
