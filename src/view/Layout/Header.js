import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { APILink } from "../../Api/Api";
export default function Header() {
  const [, setCookies] = useCookies();
  const [Loading, setLoading] = useState(false);
  var token = sessionStorage.getItem("token");
  const [cookies] = useCookies(["token"]);
  const myCookieTokenValue = cookies.token;
  // console.log(token);
  const logout = async () => {
    const email = sessionStorage.getItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("storeAddress");
    sessionStorage.removeItem("storeId");
    sessionStorage.removeItem("image");
    sessionStorage.removeItem("adminId");

    const response = await axios.get(APILink() + "Admin/LogOut/" + email);
    console.log(response);
    var exp = new Date();
    exp.setSeconds(exp.getSeconds() + 0.5);
    setCookies("token", "true", { expires: exp });
  };
  useEffect(() => {}, [Loading]);
  return (
    <>
      {" "}
      <div className="header">
        <div className="box_logo">
          <Link to="/">
            <img src={require("../../asset/images/company/logo.png")} alt="" />
          </Link>
        </div>
        <div className="navbar">
          <div className="navbar-left">
            {/* <p className="icon-menu">
      <i className="fa-solid fa-bars"></i>
    </p>
    <div className="box_search">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
        type="search"
        spellCheck="true"
        placeholder="input search admin"
      />
    </div> */}
            <div className="box_info_role">
              <div>
                <img src={sessionStorage.getItem("image")} alt="" />
              </div>
              <p className="id_store">
                {sessionStorage.getItem("storeAddress")
                  ? "STORE :" + sessionStorage.getItem("storeAddress")
                  : "Super Admin"}
              </p>
            </div>
            <p className="status">
              <i className="fa-solid fa-circle"></i>Online
            </p>
          </div>
          <div className="navbar-right">
            {/* <p className="box_noiti">
      <i className="fa-regular fa-bell"></i>
    </p>
    <p className="box_message">
      <i className="fa-regular fa-envelope"></i>
    </p> */}
            <div className="info">
              {/* <div className="box_avt">
        <img
          src={
            "https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-circle-icon---user-avatar-icon-color-circle-flat-round-photo-image_37973252.jpg"
          }
          alt=""
        />
      </div> */}
              <p className="name">{sessionStorage.getItem("email")} </p>
              <Link className="link" to="/" onClick={logout}>
                <p>
                  <i className="fa-solid fa-share-from-square"></i>
                  LogOut
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
