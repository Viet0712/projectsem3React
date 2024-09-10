import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, message } from "antd";
import { APILink } from "../../../Api/Api";

import { HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
export default function ListProduct() {
  const navigate = useNavigate();

  const { Option } = Select;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [resultvalue, setresultvalue] = useState([]);
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

  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = resultvalue.slice(firstIndex, lastIndex);
  const pages = Math.ceil(resultvalue.length / recordsPerPage);

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
  const [listBrand, setlistBrand] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Brand", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        response.data.data.unshift({
          id: "",
          name: "All",
        });

        setlistBrand(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Set Error: " + error);
        }
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listStore, setlistStore] = useState([]);
  const [messageS, setmessage] = useState("BBBBBBBBBB");
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        response.data.data.unshift({
          id: "",
          address: "All",
          district: "",
          city: "",
        });
        setlistStore(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Set Error: " + error);
        }
      } finally {
      }
    };
    fetchdata();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);

        const response = await axios.get(
          APILink() + "Properties/" + sessionStorage.getItem("storeId"),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        form.setFieldsValue({
          Status: "",
          Name: "",
          BrandId: "",
          // StoreId: parseInt(sessionStorage.getItem("storeId")),
        });

        console.log(response.data.data);
        setresultvalue(response.data.data);

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
  }, [Loading, messageS]);

  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      console.log(index);
      const response = await axios.get(
        APILink() + "Properties/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resultvalue.forEach((e) => {
        if (e.id === index) {
          e.status = !e.status;
        }
      });
      // setLoading(!Loading);
      message.success("Change Status Success!");
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
  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue.StoreId);
    // var date = moment();
    // date = new Date(date).toISOString();
    // console.log(date);
    // console.log(formvalue.Expiried_date[0] > date);
    var result = data.filter((e) => {
      const searchTerm = formvalue.Name.toLowerCase();
      return (
        e.name.toLowerCase().includes(searchTerm) ||
        e.brandName.toLowerCase().includes(searchTerm) ||
        e.productName.toLowerCase().includes(searchTerm)
        //  ||
        // e.category.name.toLowerCase().includes(searchTerm) ||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });
    if (formvalue.BrandId !== "") {
      result = result.filter((e) => e.brandId === formvalue.BrandId);
    }
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    // if (formvalue.StoreId !== "") {
    //   result = result.filter((e) => e.storeId === formvalue.StoreId);
    // }
    console.log(result);

    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
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
            if (message.startsWith("Connected")) {
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
      <div>
        <h2>Properties.</h2>
        <div>
          <Form layout="vertical" form={form}>
            <div
              style={{
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                label="Search."
                className="Search"
                name="Name"
                style={{ width: "50%" }}
              >
                <Input
                  placeholder="Enter here"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Status." name="Status">
                <Radio.Group onChange={handleSearch}>
                  <Radio value="">All</Radio>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Disable</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item style={{ width: "35%" }} label="Brand." name="BrandId">
                <Select onChange={handleSearch}>
                  {listBrand?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item style={{ width: "60%" }} label="Store." name="StoreId">
              <Select onChange={handleSearch}>
                {listStore?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.address + " " + item.district + " " + item.city}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            </div>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, index) => (
              <tr
                key={index}
                style={{ height: "100%", backgroundColor: "yellow" }}
              >
                <td>{item.productName}</td>
                <td>{item.name}</td>

                <td>
                  <img
                    style={{ height: "80px", width: "100px" }}
                    src={item.image}
                    alt="img"
                  />
                </td>
                <td>{item.brandName}</td>
                {/* <td>
                {item.store.address +
                  ", " +
                  item.store.district +
                  ", " +
                  item.store.city}
              </td> */}

                <td>{item.costPrice}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
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
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                      height: "100%",
                      gridTemplateRows: "1fr",
                      width: "70%",
                    }}
                  >
                    {/* <Button
                      className={`btn ${
                        item.status === true ? "btn-success" : "btn-danger"
                      } `}
                      onClick={() => ChangeStatus(item.id)}
                    >
                      {item.status === true ? "Active" : "Disable"}
                    </Button> */}
                    <Button
                      className="btn btn-light"
                      disabled={
                        item.status !== undefined
                          ? item.status === true
                            ? false
                            : true
                          : item.Status
                          ? false
                          : true
                      }
                    >
                      <Link
                        style={{ color: "Black", textDecoration: "none" }}
                        to={`/addgoods?propertiesId=${item.id}`}
                      >
                        Add
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
