import React from "react";
import { usePostQuery } from "../../generated/graphql";
import useGetIntIdFromUrl from "./useGetIntIdFromUrl";

const useGetPostFromUrl = () => {
  const intId = useGetIntIdFromUrl();
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};

export default useGetPostFromUrl;
