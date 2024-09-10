import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, Checkbox, Divider, message } from "antd";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { APILink } from "../../../Api/Api";
import moment from "moment-timezone";

export default function ListQuestion() {
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
  const [messageS, setmessage] = useState("BBBBBBBBBB");
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
  var pending = data.filter((e) => e.question_Replies === null).length;
  var replied = data.filter((e) => e.question_Replies !== null).length;
  const [waiting, setwaiting] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Question", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        const dataresponse = response.data.data;
        dataresponse.forEach((element) => {
          var dataImage = element.image;
          if (dataImage.startsWith(", ")) dataImage = dataImage.substring(2);
          let partsImage = dataImage.split(", ");
          element.image = partsImage;
        });
        form.setFieldsValue({
          SearchInput: "",
          Status: "total",
        });
        console.log(dataresponse);
        setresultvalue(dataresponse);
        setData(dataresponse);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchdata();
  }, [messageS]);
  const handleSearch = (value) => {
    var valueList = [];

    const formvalue = form.getFieldsValue();
    console.log(formvalue);
    var result = [];
    if (formvalue.Status === "pending") {
      result = data.filter((e) => e.question_RepliesId === null);
    } else if (formvalue.Status === "replied") {
      result = data.filter((e) => e.question_RepliesId !== null);
    } else {
      result = data;
    }
    result = result.filter((e) => {
      const searchTerm = formvalue.SearchInput.toLowerCase();
      return (
        e.productName.toLowerCase().includes(searchTerm) ||
        e.userName.toLowerCase().includes(searchTerm)

        //||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });

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
            if (message.startsWith("CreateQuestion")) {
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
        <h2>List Question.</h2>
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
                    <strong style={{ fontSize: "0.9rem" }}>
                      {" "}
                      Customer : {item.userName} |
                    </strong>
                    <strong
                      style={{ paddingLeft: "0.5rem", fontSize: "0.9rem" }}
                    >
                      Product : {item.productName}
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
                    <img style={{ width: "100%" }} src={item.image[0]} alt="" />
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
                  {/* <Rate allowHalf defaultValue={item.rating} /> */}
                  <div style={{ padding: "0.5rem", fontSize: "0.8rem" }}>
                    {item.question_RepliesContent
                      ? moment(item.repAt).format("DD/MM/YYYY HH:mm")
                      : ""}
                    <br />
                    <div>
                      {item.question_RepliesContent ? (
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
                              __html: item.question_RepliesContent,
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
                  <Button
                    className={`btn ${
                      item.question_RepliesId ? "" : "btn-success"
                    }`}
                  >
                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      to={
                        item.question_RepliesId
                          ? `/updateQuestionRep?QuestRepId=${
                              item.question_RepliesId
                                ? item.question_RepliesId
                                : ""
                            }`
                          : `/feedbackQuestion?QuestionId=${item.id}`
                      }
                    >
                      {item.question_RepliesId ? "Update" : "Reply"}
                    </Link>
                  </Button>
                  {/* <Button disabled={item.question_Replies ? false : true}>
                  <Link
                    style={{ color: "white", textDecoration: "none" }}
                    to={`/updateQuestionRep?QuestRepId=${
                      item.question_Replies ? item.question_Replies.id : ""
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
