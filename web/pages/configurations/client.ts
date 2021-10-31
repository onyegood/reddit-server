import { createClient } from "@urql/core";

export const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include"
    }
  });