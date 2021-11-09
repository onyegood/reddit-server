import React from "react";
import NextLink from "next/link";

interface EditDeletePostButtons {
  id: number;
  creatorId: number;
}
const EditDeletePostButtons: React.FC<EditDeletePostButtons> = ({
  id,
  creatorId,
}) => {
  const [{}, deletePost] = useDeletePostMutation();
  const [{ data: me }] = useMeQuery();

  if (me?.me.id !== creatorId) {
    return null;
  }

  return (
    <div>
      <span onClick={() => deletePost({ id })}>Delete</span>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <span>Edit</span>
      </NextLink>
    </div>
  );
};

export default EditDeletePostButtons;
