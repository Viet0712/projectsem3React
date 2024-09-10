import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, DatePicker, Space, message } from "antd";
import { APILink } from "../../../Api/Api";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
export default function ListProduct() {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
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
          APILink() + "Good/GetByStore/" + sessionStorage.getItem("storeId"),
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
          StoreId: parseInt(sessionStorage.getItem("storeId")),
          Expiried_date: null,
          Entry_date: null,
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
  }, [Loading]);
  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      console.log(index);
      const response = await axios.get(
        APILink() + "Good/ChangeStatus/" + index,
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
    console.log(formvalue);
    var date = moment();
    date = new Date(date).toISOString();
    // console.log(date);
    // console.log(formvalue.Expiried_date[0] > date);
    var result = data.filter((e) => {
      const searchTerm = formvalue.Name.toLowerCase();
      return (
        e.type.toLowerCase().includes(searchTerm) ||
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
    // if (formvalue.StoreId !== "") {
    //   result = result.filter((e) => e.properties.storeId === formvalue.StoreId);
    // }
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.Expiried_date !== null) {
      result = result.filter((e) => {
        var newexpiry_date = new Date(e.expiry_date).setHours(0, 0, 0, 0);
        var startDate = new Date(formvalue.Expiried_date[0]).setHours(
          0,
          0,
          0,
          0
        );
        var endDate = new Date(formvalue.Expiried_date[1]).setHours(
          23,
          59,
          59,
          999
        );

        return startDate <= newexpiry_date && endDate >= newexpiry_date;
      });
      // result = result.filter(
      //   (e) =>
      //     formvalue.Expiried_date[0] <= e.expiry_date &&
      //     formvalue.Expiried_date[1] >= e.expiry_date
      // );
    }
    if (formvalue.Entry_date !== null) {
      result = result.filter((e) => {
        var newarrival_date = new Date(e.arrival_date).setHours(0, 0, 0, 0);
        var startDate = new Date(formvalue.Entry_date[0]).setHours(0, 0, 0, 0);
        var endDate = new Date(formvalue.Entry_date[1]).setHours(
          23,
          59,
          59,
          999
        );

        return startDate <= newarrival_date && endDate >= newarrival_date;
      });
      // result = result.filter(
      //   (e) =>
      //     formvalue.Entry_date[0] <= e.arrival_date &&
      //     formvalue.Entry_date[1] >= e.arrival_date
      // );
    }
    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
  };
  const handleRangeChangeEntry_date = (dates, dateStrings) => {
    console.log(dates);
    if (dates !== null) {
      const endDate = new Date(dates[1]); // Tạo một đối tượng Date từ dates[1]
      // Tính toán chênh lệch múi giờ (phút)
      const timezoneOffsetInMinutesEndDate = endDate.getTimezoneOffset();

      // Điều chỉnh ngày giờ bằng cách thêm chênh lệch múi giờ vào milliseconds
      endDate.setTime(
        endDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
      );

      // Chuyển đổi thành chuỗi đại diện cho ngày giờ theo múi giờ địa phương
      const formattedEndDate = endDate.toISOString();

      const startDate = new Date(dates[0]);
      const timezoneOffsetInMinutesStartDate = startDate.getTimezoneOffset();

      startDate.setTime(
        startDate.getTime() - timezoneOffsetInMinutesStartDate * 60 * 1000
      );

      const formattedstartDate = startDate.toISOString();

      form.setFieldsValue({
        Entry_date: [formattedstartDate, formattedEndDate],
      });
    } else {
      form.setFieldsValue({
        Entry_date: null,
      });
    }

    handleSearch();
  };
  const handleRangeChangeExpiried_date = (dates, dateStrings) => {
    if (dates !== null) {
      const endDate = new Date(dates[1]); // Tạo một đối tượng Date từ dates[1]
      // Tính toán chênh lệch múi giờ (phút)
      const timezoneOffsetInMinutesEndDate = endDate.getTimezoneOffset();

      // Điều chỉnh ngày giờ bằng cách thêm chênh lệch múi giờ vào milliseconds
      endDate.setTime(
        endDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
      );

      // Chuyển đổi thành chuỗi đại diện cho ngày giờ theo múi giờ địa phương
      const formattedEndDate = endDate.toISOString();

      const startDate = new Date(dates[0]);
      const timezoneOffsetInMinutesStartDate = startDate.getTimezoneOffset();

      startDate.setTime(
        startDate.getTime() - timezoneOffsetInMinutesStartDate * 60 * 1000
      );

      const formattedstartDate = startDate.toISOString();

      form.setFieldsValue({
        Expiried_date: [formattedstartDate, formattedEndDate],
      });
    } else {
      form.setFieldsValue({
        Expiried_date: null,
      });
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
        <h2>Goods.</h2>
        <div>
          <Form layout="vertical" form={form}>
            <div
              style={{
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                label="Search."
                className="Search"
                name="Name"
                style={{ width: "25%" }}
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
              <Form.Item style={{ width: "25%" }} label="Brand." name="BrandId">
                <Select onChange={handleSearch}>
                  {listBrand?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item style={{ width: "60%" }} label="Store." name="StoreId">
              <Select onChange={handleSearch}>
                {listStore?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.address + " " + item.district + " " + item.city}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div> */}
            <div
              style={{
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                style={{ width: "80%" }}
                label="Entry date."
                name="Entry_date"
              >
                <Space direction="vertical">
                  <RangePicker
                    // showTime={{ format: "HH:mm" }}
                    onChange={handleRangeChangeEntry_date}
                  />
                </Space>
              </Form.Item>
              <Form.Item
                style={{ width: "80%" }}
                label="Expiried date."
                name="Expiried_date"
              >
                <Space direction="vertical">
                  <RangePicker
                    // showTime={{ format: "HH:mm" }}
                    onChange={handleRangeChangeExpiried_date}
                  />
                </Space>
              </Form.Item>
            </div>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Entry date</th>
              {/* <th>Image</th> */}
              <th>Expiried date</th>
              {/* <th>Store</th> */}
              <th>Stock</th>
              <th>Cost</th>
              <th>Price</th>
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
                <td>{item.productName}</td>
                <td>{item.type}</td>
                <td>{moment(item.arrival_date).format("DD/MM/YYYY")}</td>

                {/* <td>
                <img
                  style={{ height: "80px", width: "100px" }}
                  src={item.image}
                  alt="img"
                />
              </td> */}
                <td>
                  {item.expiry_date
                    ? moment(item.expiry_date).format("DD/MM/YYYY")
                    : "None"}
                </td>
                {/* <td>
                {item.store.address +
                  ", " +
                  item.store.district +
                  ", " +
                  item.store.city}
              </td> */}

                <td>{item.stock}</td>
                <td>{item.cost}</td>
                <td>{item.price}</td>
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
                      gridTemplateColumns: "1fr ",
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

                    {/* <Button>
                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      to={
                        sessionStorage.getItem("role") === "Admin"
                          ? `/updateproperties?propertiesId=${item.id}`
                          : sessionStorage.getItem("role") === "SAdmin"
                          ? `/updatepropertiessadmin?propertiesId=${item.id}`
                          : ""
                      }
                    >
                      Update
                    </Link>
                  </Button> */}
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