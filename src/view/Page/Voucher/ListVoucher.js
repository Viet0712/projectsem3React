import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, Button as AntButton, message } from "antd";
import { APILink } from "../../../Api/Api";
import moment from "moment-timezone";
export default function ListFlashSale() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const [Loading, setLoading] = useState(false);
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
  const recordsPerPage = 10;
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
        const response = await axios.get(APILink() + "Voucher/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        form.setFieldsValue({
          Name: "",
          Status: "",
          Date: "",
          Type: "",
        });
        setData(response.data.data);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, [Loading]);
  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      console.log(index);
      const response = await axios.get(
        APILink() + "Voucher/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setLoading(!Loading);
      data.forEach((e) => {
        if (e.id === index) {
          e.status = !e.status;
        }
      });
      message.success("Change Status Success!");
    } catch (error) {
      message.error("Error: ", error);
    } finally {
      setwaiting(false);
    }
  };
  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();

    const formData = new FormData();
    if (formvalue.Name !== "") {
      formData.append("name", formvalue.Name);
    }
    if (formvalue.Status !== "") {
      formData.append("status", formvalue.Status);
    }
    if (formvalue.Date !== "") {
      formData.append("expired", formvalue.Date);
    }
    if (formvalue.Type !== "") {
      formData.append("type", formvalue.Type);
    }
    try {
      const response = await axios.post(
        APILink() + "Voucher/Search",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
      setCurrentPage(1);
      setstartPage(1);
    } catch (error) {
      message.error("Error: ", error);
    } finally {
      setwaiting(false);
    }
  };

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
      <div>
        <h2>Voucher.</h2>
        <div className="option">
          <Form
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            form={form}
            className="form-option"
            onFinish={handleSearch}
          >
            <Form.Item className="Search" name="Name">
              <Input
                placeholder="Enter Name here"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="Date">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value={true}>Expired</Radio>
                <Radio value={false}>On-Going</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="Type">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value="PERCENT">Percent</Radio>
                <Radio value="AMOUNT">Amount</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="Status">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Disable</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Volume</th>
              <th>Quantity</th>
              <th>Start</th>
              <th>End</th>
              {/* <th>Status</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, index) => (
              <tr
                key={index}
                style={{ height: "100%", backgroundColor: "yellow" }}
              >
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.volume}</td>
                <td>{item.quantity}</td>
                <td>{moment(item.start_at).format("DD/MM/YYYY HH:mm:ss")}</td>
                <td>
                  {moment(item.expiry_date).format("DD/MM/YYYY HH:mm:ss")}
                </td>
                {/* <td>
                {item.status !== undefined
                  ? item.status === true
                    ? "Active"
                    : "Disable"
                  : item.Status
                  ? "Active"
                  : "Disable"}
              </td> */}
                <td>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      height: "100%",
                      gridTemplateRows: "1fr",
                      width: "70%",
                    }}
                  >
                    <Button
                      className={`btn ${
                        item.status === true ? "btn-success" : "btn-danger"
                      } `}
                      onClick={() => ChangeStatus(item.id)}
                    >
                      {item.status === true ? "Active" : "Disable"}
                    </Button>

                    <Button>
                      <Link
                        style={{ color: "white", textDecoration: "none" }}
                        to={`/updatevoucher?voucherId=${item.id}`}
                      >
                        Update
                      </Link>
                    </Button>
                  </div>
                </td>
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
      </div>
    </>
  );
}
