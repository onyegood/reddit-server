import { Layout } from "antd";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { createUrqlClient } from "../../configurations/createUrqlClient";
import useGetPostFromUrl from "../../hooks/useGetPostFromUrl";

const SinglePost = () => {
  const [{ data, fetching, error }] = useGetPostFromUrl();

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
