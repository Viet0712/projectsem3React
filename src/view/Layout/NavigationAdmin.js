import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { APILink } from "../../../src/Api/Api";
import { message } from "antd";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
export default function Navigation() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const myCookieTokenValue = cookies.token;
  const [openStatus, setOpenStatus] = useState([]);
  const detailsRef = useRef([]);
  var token = sessionStorage.getItem("token");

  useEffect(() => {
    // Initialize openStatus with true values
    setOpenStatus(new Array(detailsRef.current.length).fill(false));
  }, [detailsRef.current.length]);

  useEffect(() => {
    detailsRef.current.forEach((detail, index) => {
      if (openStatus[index]) {
        detail.style.height = detail.scrollHeight + "px";
      } else {
        detail.style.height = "0";
      }
    });
  }, [openStatus]);
  const [Permission, setPermission] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [messageS, setmessage] = useState("");
  useEffect(() => {
    var AdminId = parseInt(sessionStorage.getItem("adminId"));
    console.log(AdminId);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          APILink() + "Permission/GetbyId/" + AdminId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPermission(response.data.data);
        console.log(response.data.data);
      } catch (error) {}
    };
    fetchData();
  }, [Loading, messageS]);
  const handleShowDetail = (index) => {
    const newOpenStatus = [...openStatus];
    newOpenStatus[index] = !newOpenStatus[index];
    setOpenStatus(newOpenStatus);
  };
  const [waiting, setwaiting] = useState(false);
  const ExportFile = async () => {
    if (window.confirm("Download File?")) {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() +
            "Report/StockByStore/" +
            parseInt(sessionStorage.getItem("storeId")),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Stock_${sessionStorage.getItem("storeAddress")}.xlsx`
        ); // Đặt tên file tải về
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
          navigate(`/error`);
        } else {
          message.error("Download Error: " + error);
        }
      } finally {
        setwaiting(false);
      }
    }
    return;
  };
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5102/api/Demo-hub", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .withAutomaticReconnect()
      .build();
    console.log("AAAAAAAAAAAAAAAAA");
    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR connection started");
          // Register event handlers or call methods on the server
          connection.on("ReceiveMessage", (message) => {
            if (message.startsWith("UpdatePermission")) {
              setmessage(message);
              setLoading(!Loading);
              console.log(message);
            }
          });
        })
        .catch((error) => {
          console.error("SignalR connection error:", error);
        });
    }
  }, [connection]);

  return (
    <>
      {waiting && (
        <div
          className="LoadingMain"
          style={{ width: "100vw", height: "105vh" }}
        >
          <div className="background"></div>
          <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              class="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 660"
              stroke-dashoffset="-330"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 220"
              stroke-dashoffset="-110"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 440"
              stroke-linecap="round"
            ></circle>
            <circle
              class="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              stroke-width="20"
              stroke-dasharray="0 440"
              stroke-linecap="round"
            ></circle>
          </svg>
        </div>
      )}
      <div className="navigation">
        <div className="navgation-container">
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(0)}>
              <p>
                <i className="fa-solid fa-file-lines"></i>Order
              </p>
              <span>
                <i
                  className={
                    openStatus[0]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[0] = el)}>
              <Link className="link" to="/listorder">
                <p className="child">List Order</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(1)}>
              <p>
                <i className="fa-solid fa-bag-shopping"></i>Products
              </p>
              <span>
                <i
                  className={
                    openStatus[1]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[1] = el)}>
              {/* <Link className="link" to="/listproduct">
              <p className="child">List Product</p>
            </Link> */}
              {Permission.addProperties === true && (
                <Link className="link" to="/listproperties">
                  <p className="child">List Properties</p>
                </Link>
              )}
              {Permission.addGoods === true && (
                <Link className="link" to="/listgoods">
                  <p className="child">List Goods</p>
                </Link>
              )}

              {/* <Link className="link" to="/addproperties">
                <p className="child">Add Properties</p>
              </Link> */}
              {/* <Link className="link" to="/updateproduct">
              <p className="child">Update Product</p>
            </Link>
            <Link className="link" to="/updateproperties">
              <p className="child">Update Properties</p>
            </Link> */}
            </div>
          </div>

          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(2)}>
              <p>
                <i className="fa-solid fa-tag"></i>Marketing
              </p>
              <span>
                <i
                  className={
                    openStatus[2]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[2] = el)}>
              {" "}
              {Permission.setEven === true && (
                <>
                  <Link className="link" to="/seteventdiscount">
                    <p className="child">Event Discount</p>
                  </Link>
                  <Link className="link" to="/seteventflashsale">
                    <p className="child">Event Flash Sale</p>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="navigation-item">
            <Link
              className="summary"
              style={{ textDecoration: "none", color: "#8c9da7" }}
              onClick={ExportFile}
            >
              <p>
                <i class="fa-solid fa-file-export"></i>Export Stock File
              </p>
              <span></span>
            </Link>
          </div>
          <div className="navigation-item">
            <Link
              to="/chart_admin"
              className="summary"
              style={{ textDecoration: "none", color: "#8c9da7" }}
            >
              <p>
                <i class="fa-solid fa-chart-column"></i>Chart
              </p>
              <span></span>
            </Link>
          </div>
          <div className="navigation-item">
            <Link
              to="/listreview"
              className="summary"
              style={{ textDecoration: "none", color: "#8c9da7" }}
            >
              <p>
                <i class="fa-solid fa-comments"></i>Review
              </p>
              <span></span>
            </Link>
          </div>

          <div className="navigation-item">
            <Link
              to="/updateprofileadmin"
              className="summary"
              style={{ textDecoration: "none", color: "#8c9da7" }}
            >
              <p>
                <i class="fa-solid fa-user"></i>Update Profile
              </p>
              <span></span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
