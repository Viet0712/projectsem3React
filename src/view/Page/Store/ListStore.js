import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, Button as AntButton, message } from "antd";
// import { HubConnectionBuilder } from "@microsoft/signalr";
import { APILink } from "../../../Api/Api";
import HCMDistrict from "../../../Json/HCMDistrict.json";
import HNDistrict from "../../../Json/HNDistrict.json";
import DNDistrict from "../../../Json/DNDistrict.json";
import "../../../styles/Store.scss";

const { Option } = Select;
export default function GetListStore() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [resultvalue, setresultvalue] = useState([]);
  // const [connection, setConnection] = useState(null);
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

  // const { isLoading, data: liststore } = useQuery({
  //   queryKey: ["ok"],
  //   queryFn: () => fetchData(),
  // });
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get("http://localhost:5102/api/Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        form.setFieldsValue({
          Status: "",
          City: "",
          District: "",
          Address: "",
        });
        setresultvalue(response.data.data);
        setData(response.data.data);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, [Loading]);

  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl("http://localhost:5102/Demo-hub") // URL của SignalR hub trên server
  //     .withAutomaticReconnect()
  //     .build();
  //   // console.log("AAAAAAAAAAAAAAAAA");
  //   setConnection(newConnection);

  //   return () => {
  //     newConnection.stop();
  //   };
  // }, []);
  // useEffect(() => {
  //   if (connection) {
  //     connection
  //       .start()
  //       .then(() => {
  //         console.log("SignalR connection started");
  //         // Register event handlers or call methods on the server
  //         connection.on("ReceiveMessage", (message) => {
  //           console.log(message);
  //           setData(message);
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("SignalR connection error:", error);
  //       });
  //   }
  // }, [connection]);

  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      console.log(index);
      const response = await axios.get(
        APILink() + "Store/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setLoading(!Loading);
      resultvalue.forEach((e) => {
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
  const handleSearch = async (value) => {
    try {
      const value = form.getFieldsValue();

      var result = data.filter((e) => {
        const searchTerm = value.Address.toLowerCase();
        return e.address.toLowerCase().includes(searchTerm);
      });
      if (value.City !== "") {
        result = result.filter((e) => e.city === value.City);
      }

      if (value.District !== "") {
        result = result.filter((e) => e.district === value.District);
      }

      if (value.Status !== "") {
        result = result.filter((e) => e.status === value.Status);
      }
      console.log(value);

      setresultvalue(result);
      setCurrentPage(1);
      setstartPage(1);
    } catch (error) {
      console.error("Create Error: ", error);
    }
  };

  const [District, setDistrict] = useState([]);
  // useEffect(() => {
  //   form.setFieldsValue({ District: "" });
  // }, [District, form]);

  const handleChangeCity = (value) => {
    if (value === "HCM City") {
      setDistrict(HCMDistrict);
    } else if (value === "HN City") {
      setDistrict(HNDistrict);
    } else if (value === "DN City") {
      setDistrict(DNDistrict);
    } else if (value === "") {
      form.setFieldsValue({ District: "" });
      setDistrict([]);
    }
    handleSearch();
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
        <h2>Store.</h2>
        <div className="option">
          <Form form={form} className="form-option">
            <Form.Item className="Search" name="Address">
              <Input
                placeholder="Enter address here"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="Status">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Disable</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="City" name="City">
              <Select style={{ width: 120 }} onChange={handleChangeCity}>
                <Option value="">All</Option>
                <Option value="HCM City">HCM City</Option>
                <Option value="HN City">HN City</Option>
                <Option value="DN City">DN City</Option>
              </Select>
            </Form.Item>
            <Form.Item label="District" name="District">
              <Select style={{ width: 120 }} onChange={handleSearch}>
                {District?.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Address</th>
              <th>District</th>
              <th>City</th>
              {/* <th>Admin Id</th>
            <th>Full Name</th> */}
              <th>Image</th>
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
                <td>{item.address ? item.address : item.Address}</td>
                <td>{item.district ? item.district : item.District}</td>
                <td>{item.city ? item.city : item.City}</td>
                {/* <td>{store.admins ? "" : store.Admins[0].Id}</td>
              <td>{store.admins ? "" : store.Admins[0].FullName}</td> */}
                <td>
                  <img
                    style={{ height: "80px", width: "100px" }}
                    src={item.image}
                    alt="img"
                  />
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
                        to={`/updateStore?storeId=${
                          item.id ? item.id : item.Id
                        }`}
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
