import React, { useState, useEffect } from "react";
import { Input, message, Space } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function OrderDetail() {
  const navigate = useNavigate();
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAaa");
  const location = useLocation();
  const [data, setData] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const OrderId = searchParams.get("id");
  var token = sessionStorage.getItem("token");
  const { setLayout } = useLayout();
  useEffect(() => {
    if (sessionStorage.getItem("role") === "SAdmin") {
      setLayout("SAdmin");
    } else if (sessionStorage.getItem("role") === "Admin") {
      setLayout("Admin");
    } else {
      setLayout("auth");
    }
  }, [setLayout]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setstartPage] = useState(1);
  const [move, setmove] = useState("Next");
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const pages = Math.ceil(data.length / recordsPerPage);

  var numbers = Array.from(
    { length: Math.min(5, pages) },
    (_, i) => startPage + i
  );

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 < startPage) {
        setstartPage(startPage - 1);
      }
    }
  };
  const NextPage = () => {
    if (currentPage !== pages) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 >= startPage + 5) {
        setstartPage(startPage + 1);
      }
    }
  };

  const firstpage = () => {
    setstartPage(1);
    setCurrentPage(1);
  };
  const lastpage = () => {
    setCurrentPage(pages);
    if (pages >= 5) {
      setstartPage(pages - 4);
    }
  };

  const changeCurrentPage = (id) => {
    setCurrentPage(id);
  };

  const [waiting, setwaiting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Order/GetOrderDetail/" + OrderId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.data);
        setData(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Set Error: " + error);
        }
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {waiting && (
        <div className="LoadingMain">
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
      <h2>Order Detail.</h2>
      <Table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Price(USD)</th>
            <th>Quanity</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((item, index) => (
            <tr key={index}>
              <td>{item.orederId}</td>
              <td>
                {item.properties.product.name} + +{" "}
                {"(" + item.properties.name + ")"}
              </td>
              <td>{item.properties.product.brand.name}</td>
              <td>{item.properties.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <Link href="#" className="page-link" onClick={firstpage}>
              First Page.
            </Link>
          </li>
          <li className="page-item">
            <Link href="#" className="page-link" onClick={prePage}>
              Prev
            </Link>
          </li>
          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <Link
                href="#"
                className="page-link"
                onClick={() => changeCurrentPage(n)}
              >
                {n}
              </Link>
            </li>
          ))}
          <li className="page-item">
            <Link href="#" className="page-link" onClick={NextPage}>
              Next
            </Link>
          </li>
          <li className="page-item">
            <Link href="#" className="page-link" onClick={lastpage}>
              Last Page.
            </Link>
          </li>
          <li className="page-item">
            <p className="page-link">{currentPage + "/" + pages}</p>
          </li>
        </ul>
      </nav>
    </>
  );
}
