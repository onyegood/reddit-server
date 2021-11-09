import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import AuthLayout from "./components/layouts/AuthLayout";
import { createUrqlClient } from "../configurations/createUrqlClient";
import React, { useState } from "react";
import UpdootSection from "./post/UpdootSection";
import NextLink from "next/link";

const Home: NextPage = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string | undefined,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [{}, deletePost] = useDeletePostMutation({ variables });

  const handleLoadmore = () => {
    setVariables({
      limit: variables.limit,
      cursor: data?.posts[data.posts.length - 1].createdAt,
    });
  };

  if (!fetching && !data) {
    return <p>You have no data yet</p>;
  }

  return (
    <AuthLayout>
      <p>Hello bro</p>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <div>
          {data!.posts?.posts.map((p) =>
            !p ? null : (
              <div key={p.id}>
                <UpdootSection post={p} />
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <p>{p.title}</p>
                </NextLink>

                <p>{p.textSnipet}</p>
                <span onClick={() => deletePost({ id: p.id })}>Delete</span>
              </div>
            )
          )}

          {data && data.posts.hasMore ? (
            <button disabled={fetching} onClick={() => handleLoadmore()}>
              Load more
            </button>
          ) : null}
        </div>
      )}
    </AuthLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
