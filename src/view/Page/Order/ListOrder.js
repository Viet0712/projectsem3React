import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/Chart.css";
import { Button, Table } from "react-bootstrap";
import FormatDate from "../../Function/FormatDate";
import {
  Form,
  Input,
  Radio,
  Select,
  Button as AntButton,
  DatePicker,
  Space,
  message,
} from "antd";
import { APILink } from "../../../Api/Api";
import moment from "moment";
import Item from "antd/es/list/Item";
import { useNavigate } from "react-router-dom";
export default function ListOrder() {
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
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
  const recordsPerPage = 10;
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

  const [disabledRange, setDisabledRange] = useState({
    start: moment().startOf("month"),
    end: moment().endOf("month"),
  });
  const [waiting, setwaiting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const Formdata = new FormData();
      Formdata.append("StoreID", parseInt(sessionStorage.getItem("storeId")));
      Formdata.append("Month", FormatDate(moment()));
      try {
        setwaiting(true);
        const response = await axios.post(
          APILink() + "Order/GetByStore",
          Formdata,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        form.resetFields();
        form.setFieldsValue({
          Search: "",
          Status: "",
          Date_order: null,
          Month: moment(),
        });

        console.log(response.data.data);
        setresultvalue(response.data.data);
        setData(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Error: " + error);
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
        APILink() + "Order/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resultvalue.forEach((e) => {
        if (e.idOrder === index) {
          if (e.status === "packaged") {
            e.status = "delivery";
          } else {
            e.status = "completed";
          }
        }
      });
      // setLoading(!Loading);
      message.success("Change Status Success!");
    } catch (error) {
      if (error.response.data === "Invalid email") {
        navigate(`/error`);
      } else {
        message.error("Error: " + error);
      }
    } finally {
      setwaiting(false);
    }
  };
  const handleSearch = () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue);
    var result = data.filter((e) => {
      const searchTerm = formvalue.Search.toLowerCase();
      return (
        e.user.fullName.toLowerCase().includes(searchTerm) ||
        e.idOrder.toLowerCase().includes(searchTerm) ||
        e.phone.toLowerCase().includes(searchTerm)
        //||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.Date_order !== null) {
      result = result.filter((e) => {
        var newcreate_at = new Date(e.create_at).setHours(0, 0, 0, 0);
        var startDate = new Date(formvalue.Date_order[0]).setHours(0, 0, 0, 0);
        var endDate = new Date(formvalue.Date_order[1]).setHours(
          23,
          59,
          59,
          999
        );

        return startDate <= newcreate_at && endDate >= newcreate_at;
      });
    }

    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
  };

  const handleRangeChangeDate_order = (dates, dateStrings) => {
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
        Date_order: [formattedstartDate, formattedEndDate],
      });
    } else {
      form.setFieldsValue({
        Date_order: null,
      });
    }
    handleSearch();
  };

  const disabledDate = (current) => {
    // Disable dates outside the range
    return current < disabledRange.start || current > disabledRange.end;
  };
  const [month, setmonth] = useState(moment());
  const GetdataByMonth = async () => {
    var formvalue = form.getFieldsValue();
    console.log(formvalue);
    if (formvalue.Month === "") {
      return;
    }
    const Formdata = new FormData();
    Formdata.append("StoreID", parseInt(sessionStorage.getItem("storeId")));
    Formdata.append("Month", formvalue.Month);
    try {
      setwaiting(true);
      const response = await axios.post(
        APILink() + "Order/GetByStore",
        Formdata,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      form.resetFields();

      form.setFieldsValue({
        Search: "",
        Status: "",
        Date_order: {},
        Month: formvalue.Month,
      });

      console.log(response.data.data);
      setresultvalue(response.data.data);
      setData(response.data.data);
    } catch (error) {
      if (error.response.data === "Invalid email") {
        navigate(`/error`);
      } else {
        message.error("Error: " + error);
      }
    } finally {
      setwaiting(false);
    }
  };
  const SelectMonth = (dates, dateStrings) => {
    form.setFieldsValue({
      Month: dateStrings,
    });
    setmonth(dates);
    setDisabledRange({
      start: moment(dateStrings).startOf("month"),
      end: moment(dateStrings).endOf("month"),
    });
    GetdataByMonth();
  };

  return (
    <div>
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
      <h2>Order.</h2>
      <div className="option">
        <Form
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
          layout="vertical"
          form={form}
          className="form-option"
        >
          <Form.Item label="Month" name="Month">
            <Space direction="vertical">
              <DatePicker
                defaultValue={month}
                picker="month"
                onChange={SelectMonth}
              />
            </Space>
          </Form.Item>
          <Form.Item label=" " className="Search" name="Search">
            <Input
              placeholder="Customer, Order Id, Phone"
              onChange={handleSearch}
            />
          </Form.Item>
          <Form.Item label="Date Oreder." name="Date_order">
            <Space direction="vertical">
              <RangePicker
                disabledDate={disabledDate}
                // showTime={{ format: "HH:mm" }}
                onChange={handleRangeChangeDate_order}
              />
            </Space>
          </Form.Item>
          <Form.Item label=" " name="Status">
            <Radio.Group onChange={handleSearch}>
              <Radio value="">All</Radio>
              <Radio value="packaged">Packaged</Radio>
              <Radio value="delivery">Delivery</Radio>
              <Radio value="completed">Completed</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
      <Table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Order Id</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Voucher</th>
            <th>Date Order</th>
            <th>Total(USD)</th>

            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((item, index) => (
            <tr
              key={index}
              style={{ height: "100%", backgroundColor: "yellow" }}
            >
              <td>{item.user.fullName}</td>
              <td>
                <Link
                  to={`/orderDetail?id=${item.idOrder}`}
                  style={{ textDecoration: "none" }}
                >
                  {item.idOrder}
                </Link>
              </td>
              <td>{item.phone}</td>
              <td>{item.address}</td>
              <td>
                {item.volumeVoucher}
                {item.typeVoucher === "PERCENT" ? "%" : "USD"}
              </td>
              <td>{moment(item.create_at).format("DD/MM/YY HH:mm")}</td>
              <td>{item.total}</td>
              <td>
                <Button
                  className={`btn ${
                    item.status === "delivery"
                      ? "btn-primary"
                      : item.status === "completed"
                      ? "btn-success"
                      : "btn-danger"
                  } `}
                  disabled={
                    item.status === "packaged" || item.status === "delivery"
                      ? false
                      : true
                  }
                  onClick={() => ChangeStatus(item.idOrder)}
                >
                  {item.status === "delivery"
                    ? "Delivery"
                    : item.status === "completed"
                    ? "Completed"
                    : "Packaged"}
                </Button>
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
  );
}
