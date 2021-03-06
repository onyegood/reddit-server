import { Card } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import NavBar from "../nav";

interface Props {}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <Layout
      style={{
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Content>
        <NavBar />
        <Card style={{ width: 400, marginTop: '50%' }}>{children}</Card>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
