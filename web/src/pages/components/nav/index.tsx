import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/register">Register</NextLink>
        <NextLink href="/login">Login</NextLink>
      </>
    );
  } else {
    body = (
        <>
          <button onClick={() => logout()}>Logout</button>
        </>
      );
  }

  return (
    <div>
        {body}
    </div>
  );
};

export default NavBar;
