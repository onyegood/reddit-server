import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { createClient, Provider } from "urql";
import { client } from "./configurations/client";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
