import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../../generated/graphql";
import { isServer } from "../../../utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/auth/register">Register</NextLink>
        <NextLink href="/auth/login">Login</NextLink>
      </>
    );
  } else {
    body = (
      <>
        <button onClick={() => logout()}>Logout</button>
        <NextLink href="/post">Create Post</NextLink>
      </>
    );
  }

  return <div>{body}</div>;
};

export default NavBar;
