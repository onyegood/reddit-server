import { Layout } from "antd";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { createUrqlClient } from "../../configurations/createUrqlClient";
import { usePostQuery } from "../../generated/graphql";

const SinglePost = () => {
  const router = useRouter();

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>Post not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>{data?.post?.title}</h1>
      <p>{data?.post?.text}</p>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(SinglePost);
