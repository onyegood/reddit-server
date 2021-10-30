import React from "react";

interface Props {}

const MainLayout: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default MainLayout;