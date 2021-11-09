import React from "react";
import { useRouter } from "next/router";

const useGetIntIdFromUrl = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  return intId;
};

export default useGetIntIdFromUrl;
