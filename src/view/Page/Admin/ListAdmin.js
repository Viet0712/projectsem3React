import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Form as FormBoostrap } from "react-bootstrap";
import { Form, Input, Radio, Select, Pagination, message } from "antd";

import { HubConnectionBuilder } from "@microsoft/signalr";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import "../../../styles/Store.scss";

const { Option } = Select;
export default function GetListStore() {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  // const [connection, setConnection] = useState(null);
  const [resultvalue, setresultvalue] = useState([]);
  const [Loading, setLoading] = useState(false);
  var token = sessionStorage.getItem("token");
  const { setLayout } = useLayout();

  useEffect(() => {
    if (sessionStorage.getItem("role") === "SAdmin") {
      console.log(sessionStorage.getItem("role"));
      setLayout("SAdmin");
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
        const response = await axios.get("http://localhost:5102/api/Admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        var data = response.data.data;
        form.setFieldsValue({
          Status: "",
        });
        setresultvalue(data);
        setData(data);
      } catch (error) {
        message.error("Error: " + error);
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, [Loading]);
  const [ListPermission, setListPermission] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(APILink() + "Permission/GetAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setListPermission(response.data.data);
      } catch (error) {
        message.error("Error: " + error);
      } finally {
      }
    };
    fetchData();
  }, []);
  const [liststore, setListore] = useState(null);
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get("http://localhost:5102/api/Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data[0].address);

        setListore(response.data.data);
      } catch (error) {
        message.error("Error: " + error);
      } finally {
      }
    };
    fetchStore();
  }, []);

  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      const response = await axios.get(
        APILink() + "Admin/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      // setLoading(!Loading);
      resultvalue.forEach((e) => {
        if (e.id === index) {
          e.status = !e.status;
        }
      });
      message.success("Change Status Success!");
    } catch (error) {
      message.error("Error: " + error);
    } finally {
      setwaiting(false);
    }
  };

  //   const handleSearch = async (value) => {
  //     try {
  //       const formData = new FormData();
  //       if (value.Address) {
  //         formData.append("address", value.Address);
  //       }

  //       if (value.District) {
  //         formData.append("district", value.District);
  //       }

  //       if (value.City) {
  //         formData.append("city", value.City);
  //       }

  //       if (value.Status !== null) {
  //         formData.append("status", value.Status.toString());
  //       }
  //       console.log(value);
  //       const response = await axios.post(
  //         "http://localhost:5102/api/Store/Search",
  //         formData
  //       );
  //       setData(response.data.data);
  //       console.log(response);
  //     } catch (error) {
  //       console.error("Create Error: ", error);
  //     }
  //   };
  //   const [valueRadioSearch, setvalueRadioSearch] = useState(null);
  //   useEffect(() => {
  //     form.setFieldsValue({ Status: valueRadioSearch, City: "" });
  //   }, []);
  //   const onChangeRadioSearch = (e) => {
  //     console.log("radio checked", e.target.value);
  //     setvalueRadioSearch(e.target.value);
  //   };

  //   const [District, setDistrict] = useState([]);
  //   useEffect(() => {
  //     form.setFieldsValue({ District: "" });
  //   }, [District, form]);

  //   const handleChangeCity = (value) => {
  //     if (value === "HCM City") {
  //       setDistrict(HCMDistrict);
  //     } else if (value === "HN City") {
  //       setDistrict(HNDistrict);
  //     } else if (value === "DN City") {
  //       setDistrict(DNDistrict);
  //     } else if (value === "") {
  //       setDistrict([]);
  //     }
  //   };

  //   if (isLoading) return <p>Loadding....</p>;

  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue);
    const formData = new FormData();
    if (formvalue.Name === undefined) {
      formData.append("name", "");
    } else {
      formData.append("name", formvalue.Name);
    }

    // formData.append("role", formvalue.Role);
    formData.append("status", formvalue.Status);
    try {
      setwaiting(true);
      const response = await axios.post(APILink() + "Admin/Search", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setresultvalue(response.data.data);
      setData(response.data.data);
      setCurrentPage(1);
      setstartPage(1);
    } catch (error) {
      message.error("Error: " + error.response.data.message);
    } finally {
      setwaiting(false);
    }
  };
  const handleCheckboxChange = async (index, field) => {
    try {
      setwaiting(true);
      const response = await axios.get(
        APILink() + "Permission/UpdatePermission/" + index + "/" + field,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      // setLoading(!Loading);
      ListPermission.forEach((e) => {
        if (e.id === index) {
          if (field === "addProperties") {
            e.addProperties = !e.addProperties;
          }
          if (field === "addGoods") {
            e.addGoods = !e.addGoods;
          }
          if (field === "setEvent") {
            e.setEvent = !e.setEvent;
          }
        }
      });
      message.success("Change Permission Success!");
    } catch (error) {
      message.error("Error: " + error);
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
        <h2>Admin.</h2>
        <div className="option" style={{ width: "100%" }}>
          <Form
            form={form}
            className="form-option"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Form.Item className="Search" name="Name">
              <Input placeholder="Enter address here" onChange={handleSearch} />
            </Form.Item>
            <Form.Item name="Status">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Disable</Radio>
              </Radio.Group>
            </Form.Item>

            {/* <Form.Item name="Role">
            <Radio.Group onChange={handleSearch}>
              <Radio value="">All</Radio>
              <Radio value="Admin">Admin</Radio>

              <Radio value="SAdmin">SAdmin</Radio>
            </Radio.Group>
          </Form.Item> */}
            {/* <Form.Item>
            <AntButton type="primary" htmlType="submit">
              Search
            </AntButton>
          </Form.Item> */}
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Email</th>
              <th>Store</th>
              {/* <th>Role</th> */}
              <th>Image</th>
              <th>Permission</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((admin, index) => (
              <tr
                key={index}
                style={{ height: "100%", backgroundColor: "yellow" }}
              >
                <td>{admin.fullName}</td>
                <td>{admin.email}</td>

                <td>
                  {admin.store !== null
                    ? admin.store.address +
                      ", " +
                      admin.store.district +
                      ", " +
                      admin.store.city
                    : ""}
                </td>
                {/* <td>{admin.role}</td> */}

                <td>
                  <img
                    style={{ height: "80px", width: "80px" }}
                    src={admin.image}
                    alt="img"
                  />
                </td>
                <td>
                  {ListPermission?.map((item, index) =>
                    item.adminId === admin.id ? (
                      <FormBoostrap.Group key={index}>
                        <FormBoostrap.Check
                          type="checkbox"
                          label="Properties"
                          defaultChecked={item.addProperties} // Giả sử AddProperties là giá trị boolean
                          onChange={() =>
                            handleCheckboxChange(item.id, "addProperties")
                          } // Hàm xử lý sự kiện thay đổi
                        />
                        <FormBoostrap.Check
                          type="checkbox"
                          label="Goods"
                          defaultChecked={item.addGoods} // Giả sử AddProperties là giá trị boolean
                          onChange={() =>
                            handleCheckboxChange(item.id, "addGoods")
                          }
                        />
                        <FormBoostrap.Check
                          type="checkbox"
                          label="SetEvent"
                          defaultChecked={item.setEven} // Giả sử AddProperties là giá trị boolean
                          onChange={() =>
                            handleCheckboxChange(item.id, "setEvent")
                          }
                        />
                      </FormBoostrap.Group>
                    ) : null
                  )}
                </td>
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
                        admin.status === true ? "btn-success" : "btn-danger"
                      } `}
                      onClick={() => ChangeStatus(admin.id)}
                    >
                      {admin.status === true ? "Active" : "Disable"}
                    </Button>

                    <Button>
                      <Link
                        style={{ color: "white", textDecoration: "none" }}
                        to={`/updateadmin?AdminId=${admin.id}`}
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
