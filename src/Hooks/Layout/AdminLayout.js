import React, { memo, useEffect, useRef, useState } from "react";
import Header from "../../view/Layout/Header";
import NavigationAdmin from "../../view/Layout/NavigationAdmin";
import "../../styles/Layout.scss";
import { useCookies } from "react-cookie";
const MainLayout = ({ children }) => {
  const [paddingMain, setPaddingMain] = useState("");
  const [paddingMainWidth, setPaddingMainWidth] = useState("");
  const [widthNavigation, setWidthNavigation] = useState("");
  const [heightNavigation, setHeightNavigation] = useState("");
  const HeaderRef = useRef(null);
  const MainRef = useRef(null);
  const adjustPaddingTop = () => {
    if (HeaderRef.current && MainRef.current) {
      const paddingHeight = `calc(${HeaderRef.current.offsetHeight}px)`;

      const temp = MainRef.current.offsetWidth / 6;
      const widthNavigation = `calc(${temp}px)`;
      const paddingMainWidth = `calc(${temp}px + 0.5rem)`;
      const heightNavigation = `calc(100vh-${HeaderRef.current.offsetHeight}px)`;
      setPaddingMain(paddingHeight);
      setPaddingMainWidth(paddingMainWidth);
      setWidthNavigation(widthNavigation);
      setHeightNavigation(heightNavigation);
    }
  };
  useEffect(() => {
    adjustPaddingTop();
    window.addEventListener("load", adjustPaddingTop);
    window.addEventListener("resize", adjustPaddingTop);

    return () => {
      window.removeEventListener("load", adjustPaddingTop);
      window.removeEventListener("resize", adjustPaddingTop);
    };
  }, [paddingMain]);
  const [cookies] = useCookies(["token"]);
  const myCookieTokenValue = cookies.token;
  return (
    <div>
      <div className="layout_header" ref={HeaderRef}>
        <Header />
      </div>

      <div
        className="layout_main"
        ref={MainRef}
        style={{ paddingTop: `${paddingMain}` }}
      >
        <div
          className="layout_navigation"
          style={{
            width: `${widthNavigation}`,
          }}
        >
          <div
            className="layout_navigation"
            style={{
              width: `${widthNavigation}`,
              height: `${heightNavigation}`,
            }}
          >
            <NavigationAdmin />
          </div>
        </div>

        <main
          className="main_container"
          style={{
            paddingTop: "0.5rem",
            paddingRight: "0.5rem",
            paddingLeft: `${paddingMainWidth}`,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default memo(MainLayout);
