import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import AuthLayout from "./components/layouts/AuthLayout";
import { createUrqlClient } from "./configurations/createUrqlClient";

const Home: NextPage = () => {
  const [{ data }] = usePostsQuery();
  return (
    <AuthLayout>
      <p>Hello bro</p>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
