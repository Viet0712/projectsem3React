import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <>
      <main style={{ width: "100%" }}>{children}</main>
    </>
  );
};
export default AuthLayout;
