import React, { memo } from "react";
import { useLayout } from "./LayoutContext";
import MainLayout from "./MainLayout";
import AuthLayout from "./AuthLayout";
import AdminLayout from "./AdminLayout";
const LayoutSwitch = ({ children }) => {
  const { layout } = useLayout();

  if (layout === "auth") {
    return <AuthLayout>{children}</AuthLayout>;
  } else if (layout === "SAdmin") {
    return <MainLayout>{children}</MainLayout>;
  } else {
    return <AdminLayout>{children}</AdminLayout>;
  }
};
export default memo(LayoutSwitch);
