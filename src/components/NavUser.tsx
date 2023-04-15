import React from "react";
import { Avatar, Button, Dropdown, Navbar, Text } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function NavUser() {
  const { data: session } = useSession();

  return session && session.user ? (
    <Dropdown placement="bottom-right">
      <Navbar.Item>
        <Dropdown.Trigger>
          <Avatar bordered as="button" size="md" src={session.user.image!} />
        </Dropdown.Trigger>
      </Navbar.Item>
      <Dropdown.Menu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <Dropdown.Item key="profile">
          <Text b color="inherit" css={{ d: "flex" }}>
            <Link style={{ color: "inherit" }} href="/me">
              {session.user.email}
            </Link>
          </Text>
        </Dropdown.Item>
        <Dropdown.Item key="logout" withDivider color="error">
          <div onClick={() => signOut()}>Log Out</div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Button onClick={() => signIn("google")}>Login with Google</Button>
  );
}
