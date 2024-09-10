import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { APILink } from "../../Api/Api";
import "../../styles/Chart.css";
import axios from "axios";
import { message } from "antd";
import { useCookies } from "react-cookie";
export default function Navigation() {
  var token = sessionStorage.getItem("token");
  const [openStatus, setOpenStatus] = useState([]);
  const detailsRef = useRef([]);
  const [cookies] = useCookies(["token"]);
  const myCookieTokenValue = cookies.token;
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

  const handleShowDetail = (index) => {
    const newOpenStatus = [...openStatus];
    newOpenStatus[index] = !newOpenStatus[index];
    setOpenStatus(newOpenStatus);
  };

  const [waiting, setwaiting] = useState(false);
  const GetStock = async () => {
    if (window.confirm("Download File?")) {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Report/Stock", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: response.headers["content-type"] })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Stock.xlsx`); // Đặt tên file tải về
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        message.error("Error: " + error);
      } finally {
        setwaiting(false);
      }
    }
    return;
  };
  return (
    <>
      <div className="navigation">
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
        <div className="navgation-container">
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(1)}>
              <p>
                <i className="fa-solid fa-bag-shopping"></i>Product
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
              <Link className="link" to="/listproduct">
                <p className="child">List Product</p>
              </Link>
              <Link className="link" to="/addproduct">
                <p className="child">Add Product</p>
              </Link>
              <Link className="link" to="/listpropertiesSAdmin">
                <p className="child">List Properties</p>
              </Link>
              <Link className="link" to="/addpropertiessadmin">
                <p className="child">Add Properties</p>
              </Link>
              <Link className="link" to="/importproduct">
                <p className="child">Import File</p>
              </Link>
            </div>
          </div>

          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(4)}>
              <p>
                <i className="fa-solid fa-chart-line"></i>Export Report
              </p>
              <span>
                <i
                  className={
                    openStatus[4]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[4] = el)}>
              <Link className="link" to="/report_daily">
                <p className="child">DaiLy</p>
              </Link>
              <Link className="link" to="/report_monthly">
                <p className="child">Monthly</p>
              </Link>
              <Link className="link" onClick={GetStock}>
                <p className="child">Stock</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(5)}>
              <p>
                <i class="fa-solid fa-building"></i>Store
              </p>
              <span>
                <i
                  className={
                    openStatus[5]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[5] = el)}>
              <Link className="link" to="/liststore">
                <p className="child">List Store</p>
              </Link>
              <Link className="link" to="/addStore">
                <p className="child">Add New Store</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(6)}>
              <p>
                <i class="fa-solid fa-user"></i>Admin
              </p>
              <span>
                <i
                  className={
                    openStatus[6]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[6] = el)}>
              <Link className="link" to="/listadmin">
                <p className="child">List Admin</p>
              </Link>
              <Link className="link" to="/addadmin">
                <p className="child">Add New Admin</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(7)}>
              <p>
                <i class="fa-solid fa-house-laptop"></i>Brand
              </p>
              <span>
                <i
                  className={
                    openStatus[7]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[7] = el)}>
              <Link className="link" to="/listbrand">
                <p className="child">List Brand</p>
              </Link>
              <Link className="link" to="/addbrand">
                <p className="child">Add New Brand</p>
              </Link>
            </div>
          </div>

          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(8)}>
              <p>
                <i class="fa-solid fa-clipboard"></i>Category
              </p>
              <span>
                <i
                  className={
                    openStatus[8]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[8] = el)}>
              <Link className="link" to="/listcategory">
                <p className="child">List Category</p>
              </Link>
              <Link className="link" to="/addcategory">
                <p className="child">Add New Category</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(9)}>
              <p>
                <i class="fa-regular fa-clipboard"></i>Subcategory
              </p>
              <span>
                <i
                  className={
                    openStatus[9]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[9] = el)}>
              <Link className="link" to="/listsubcategory">
                <p className="child">List Subcategory</p>
              </Link>
              <Link className="link" to="/addsubcategory">
                <p className="child">Add New Subcategory</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(10)}>
              <p>
                <i class="fa-regular fa-note-sticky"></i>Segment
              </p>
              <span>
                <i
                  className={
                    openStatus[10]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[10] = el)}>
              <Link className="link" to="/listsegment">
                <p className="child">List Segment</p>
              </Link>
              <Link className="link" to="/addsegment">
                <p className="child">Add New Segment</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(11)}>
              <p>
                <i class="fa-solid fa-wand-magic-sparkles"></i>Flash Sale
              </p>
              <span>
                <i
                  className={
                    openStatus[11]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[11] = el)}>
              <Link className="link" to="/listflashsale">
                <p className="child">List Flash Sale</p>
              </Link>
              <Link className="link" to="/addflashsale">
                <p className="child">Add New Flash Sale</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(12)}>
              <p>
                <i class="fa-solid fa-circle-down"></i>Discount
              </p>
              <span>
                <i
                  className={
                    openStatus[12]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[12] = el)}>
              <Link className="link" to="/listdiscount">
                <p className="child">List Discount</p>
              </Link>
              <Link className="link" to="/adddiscount">
                <p className="child">Add New Discount</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <div className="summary" onClick={() => handleShowDetail(13)}>
              <p>
                <i class="fa-solid fa-circle-down"></i>Voucher
              </p>
              <span>
                <i
                  className={
                    openStatus[13]
                      ? "fa-solid fa-angle-down"
                      : "fa-solid fa-angle-up"
                  }
                ></i>
              </span>
            </div>
            <div className="detail" ref={(el) => (detailsRef.current[13] = el)}>
              <Link className="link" to="/listvoucher">
                <p className="child">List Voucher</p>
              </Link>
              <Link className="link" to="/addvoucher">
                <p className="child">Add New Voucher</p>
              </Link>
            </div>
          </div>
          <div className="navigation-item">
            <Link
              to="/chart_sadmin"
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
              to="/listquestion"
              className="summary"
              style={{ textDecoration: "none", color: "#8c9da7" }}
            >
              <p>
                <i class="fa-solid fa-comments"></i>Question
              </p>
              <span></span>
            </Link>
          </div>
          <div className="navigation-item">
            <Link
              to="/updateprofilesadmin"
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
