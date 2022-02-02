import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../../generated/graphql";

interface UpdootSection {
  post: PostSnippetFragment;
}
const UpdootSection: React.FC<UpdootSection> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [{}, vote] = useVoteMutation();
  return (
    <div>
      <span
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
      >
        {loadingState === "updoot-loading" ? "loading..." : "up"}
      </span>
      <span>{post.points}</span>
      <span
        onClick={async () => {
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
      >
        {loadingState === "downdoot-loading" ? "loading..." : "down"}
      </span>
    </div>
  );
};

export default UpdootSection;
