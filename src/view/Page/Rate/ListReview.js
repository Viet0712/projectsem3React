import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { Form, Input, Radio, Select, Checkbox, Divider, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Rate } from "antd";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { APILink } from "../../../Api/Api";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
const CheckboxGroup = Checkbox.Group;

const plainOptions = ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"];
const defaultCheckedList = ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"];

export default function ListReview() {
  const navigate = useNavigate();
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
  const [move, setmove] = useState("Next");
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = resultvalue.slice(firstIndex, lastIndex);
  const pages = Math.ceil(resultvalue.length / recordsPerPage);
  const [messages, setmessage] = useState("BBBBBBBBBB");
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

  var total = data.length;
  var pending = data.filter((e) => e.rep_Id === null).length;
  var replied = data.filter((e) => e.rep_Id !== null).length;
  const [waiting, setwaiting] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() +
            "Rate/GetReview/" +
            parseInt(sessionStorage.getItem("storeId")),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        form.setFieldsValue({
          SearchInput: "",
          Status: "total",
        });

        // setresultvalue(response.data.data);
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
    fetchdata();
  }, [messages]);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const onChange = (list) => {
    setCheckedList(list);
  };
  useEffect(() => {
    handleSearch();
  }, [checkedList, data]);
  const handleSearch = (value) => {
    var valueList = [];
    if (checkedList.length > 0) {
      valueList = [];
      checkedList.forEach((element) => {
        valueList.push(element.charAt(0));
      });
      console.log(valueList);
    }

    const formvalue = form.getFieldsValue();
    console.log(formvalue);
    var result = [];
    if (formvalue.Status === "pending") {
      result = data.filter((e) => e.rep_Id === null);
    } else if (formvalue.Status === "replied") {
      result = data.filter((e) => e.rep_Id !== null);
    } else {
      result = data;
    }
    result = result.filter((e) => {
      const searchTerm = formvalue.SearchInput.toLowerCase();
      return (
        e.productName.toLowerCase().includes(searchTerm) ||
        e.useName.toLowerCase().includes(searchTerm) ||
        e.orderId.toLowerCase().includes(searchTerm)
        //||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });
    var resultFinal = [];
    result.forEach((element) => {
      valueList.forEach((element2) => {
        if (element.rating === parseInt(element2)) {
          resultFinal.push(element);
        }
      });
    });
    console.log(resultFinal);
    setresultvalue(resultFinal);
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
            if (message.startsWith("CreateRate")) {
              console.log(message);
              setmessage(message);
              setLoading(!Loading);
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
        <h2>List Review.</h2>
        <Form layout="vertical" form={form}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              style={{ width: "30%" }}
              name="SearchInput"
              onChange={handleSearch}
            >
              <Input placeholder="Product, Order Id, Username" />
            </Form.Item>

            <Form.Item>
              <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
              />
            </Form.Item>
            <Form.Item name="Status">
              <Radio.Group
                onChange={handleSearch}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
              >
                <Radio value="total">
                  {" "}
                  <Button danger>Total ({total}) </Button>
                </Radio>
                <Radio value="pending">
                  {" "}
                  <Button className="btn btn-warning">
                    Pending ({pending}){" "}
                  </Button>
                </Radio>
                <Radio value="replied">
                  {" "}
                  <Button className="btn btn-success">
                    Replied ({replied}){" "}
                  </Button>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item></Form.Item>
            <Form.Item></Form.Item>
          </div>
        </Form>
        <Table
          className="table table-bordered "
          style={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <thead>
            <tr
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "3fr 4fr 1fr",
              }}
            >
              <th>Product Detail</th>
              <th>Review</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, index) => (
              <tr
                key={index}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "3fr 4fr 1fr",
                }}
              >
                <td>
                  <div>
                    <strong style={{ fontSize: "0.8rem" }}>
                      {" "}
                      Product : {item.productName} |
                    </strong>
                    <strong style={{ fontSize: "0.8rem" }}>
                      {" "}
                      Type : {item.type}
                    </strong>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.8rem" }}>
                      {" "}
                      Customer : {item.useName} |
                    </strong>
                    <strong
                      style={{ paddingLeft: "0.5rem", fontSize: "0.8rem" }}
                    >
                      OrderId : {item.orderId}
                    </strong>
                  </div>
                  <div
                    style={{
                      overflowWrap: "break-word",
                      display: "grid",
                      gridTemplateColumns: "1fr 3fr",
                    }}
                  >
                    {" "}
                    <img style={{ width: "100%" }} src={item.image} alt="" />
                    <div style={{ padding: "0.5rem", fontSize: "0.8rem" }}>
                      {moment(item.create_at).format("DD/MM/YYYY HH:mm")}
                      <div style={{ paddingLeft: "0.5rem", fontSize: "1rem" }}>
                        {item.content}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    overflowWrap: "break-word",
                  }}
                >
                  <Rate
                    allowHalf
                    value={item.rating}
                    defaultValue={item.rating}
                    disabled
                  />
                  <div style={{ padding: "0.5rem", fontSize: "0.8rem" }}>
                    {item.rep_Id
                      ? moment(item.RepAt).format("DD/MM/YYYY HH:mm")
                      : ""}
                    <br />
                    <div>
                      {item.rep_Id ? (
                        <div
                          style={{
                            background: "#f4f4f4",
                            padding: "10px",
                            marginTop: "5px",
                          }}
                        >
                          <strong>{item.adminName}.</strong>
                          <div
                            style={{
                              background: "#f4f4f4",
                              padding: "10px",
                              marginTop: "5px",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: item.rep_Content,
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button className={`btn ${item.rep_Id ? "" : "btn-success"}`}>
                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      to={
                        item.rep_Id
                          ? `/updateRateReply?RateRepId=${
                              item.rep_Id ? item.rep_Id : ""
                            }`
                          : `/feedbackReview?RateId=${item.id}`
                      }
                    >
                      {item.rep_Id ? "Update" : "Reply"}
                    </Link>
                  </Button>
                  {/* <Button disabled={item.rate_Replies ? false : true}>
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                    to={`/updateRateReply?RateRepId=${
                      item.rate_Replies ? item.rate_Replies.id : ""
                    }`}
                  >
                    Update
                  </Link>
                </Button> */}
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
