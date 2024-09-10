import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "../../../styles/Chart.css";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
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
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { APILink } from "../../../Api/Api";
import FormatDate from "../../Function/FormatDate";
export default function DemoChart() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formChartByDay] = Form.useForm();
  const [formCompareByDay] = Form.useForm();
  const [formCompareByMonth] = Form.useForm();
  const [formCompareStoreBrandPerDay] = Form.useForm();
  const [formCompareStoreBrandPerMonth] = Form.useForm();
  const [data, setData] = useState([]);
  const { Option } = Select;
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
    form.setFieldsValue({
      TypeChart: "",
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const defaultDate = new Date(moment());
      const timezoneOffsetInMinutesEndDate = defaultDate.getTimezoneOffset();

      defaultDate.setTime(
        defaultDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
      );

      const LocaldefaulDate = defaultDate.toISOString();
      try {
        setwaiting(true);
        const params = {
          StoreId: sessionStorage.getItem("storeId"),
          date: LocaldefaulDate,
        };
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(
          APILink() + "Chart/ChartStorePerDay?" + queryString,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        form.setFieldsValue({
          TypeChart: "",
        });
        console.log(response.data.data);
        setwaiting(false);
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
  const [Brand, setBrand] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Brand", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);
        response.data.data.unshift({
          id: "",
          name: "All",
        });
        formCompareByDay.setFieldsValue({ BrandId: "" });
        formCompareByMonth.setFieldsValue({
          BrandId: "",
        });
        formCompareStoreBrandPerDay.setFieldsValue({
          BrandId1: 1,
          BrandId2: 2,
        });
        formCompareStoreBrandPerMonth.setFieldsValue({
          BrandId1: 1,
          BrandId2: 2,
        });
        setBrand(response.data.data);
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
  const [stringPickDate, setstringPickDate] = useState(
    moment().format("DD/MM/YYYY")
  );
  const handlesearch = async () => {
    const formvalue = formChartByDay.getFieldsValue();

    try {
      setwaiting(true);
      const params = {
        StoreId: sessionStorage.getItem("storeId"),
        date: formvalue.Date,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Chart/ChartStorePerDay?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setwaiting(false);
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
  const handleDatePickerChange = (dates, dateStrings) => {
    formChartByDay.setFieldsValue({ Date: dateStrings });

    if (dateStrings !== "") {
      setstringPickDate(moment(dateStrings).format("DD/MM/YYYY"));
      handlesearch();
    } else {
      setstringPickDate("");
      setData(null);
    }
  };

  const [datacompare, setdatacopare] = useState(null);
  const [valueCompare1, setvalueCompare1] = useState("None");
  const [valueCompare2, setvalueCompare2] = useState("None");
  const handleComparePerDay = async (value) => {
    console.log(value);

    try {
      setwaiting(true);
      const params = {
        StoreId: sessionStorage.getItem("storeId"),
        date1: value.Date1,
        date2: value.Date2,
        BrandId: value.BrandId ? value.BrandId : 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Chart/CompareStorePerDay?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      setwaiting(false);
      setdatacopare(response.data.data);
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
  useEffect(() => {
    var allchart = document.querySelectorAll(".Chart");
    allchart.forEach((element) => {
      element.classList.add("hide");
    });
  }, []);
  const [waiting, setwaiting] = useState(true);
  const handleComparePerMonth = async (value) => {
    console.log(value);

    try {
      setwaiting(true);
      const params = {
        StoreId: sessionStorage.getItem("storeId"),
        date1: value.Date1,
        date2: value.Date2,
        BrandId: value.BrandId ? value.BrandId : 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Chart/CompareStorePerMonth?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      setwaiting(false);
      setdatacopare(response.data.data);
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

  const handleCompareStoreBrandPerDay = async (value) => {
    try {
      setwaiting(true);
      const params = {
        StoreId: sessionStorage.getItem("storeId"),
        date: value.Date,
        BrandId1: value.BrandId1,
        BrandId2: value.BrandId2,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Chart/CompareStoreBrandPerDay?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      setwaiting(false);
      setdatacopare(response.data.data);
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
  const handleCompareStoreBrandPerMonth = async (value) => {
    try {
      setwaiting(true);
      const params = {
        StoreId: sessionStorage.getItem("storeId"),
        date: value.Date,
        BrandId1: value.BrandId1,
        BrandId2: value.BrandId2,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Chart/CompareStoreBrandPerMonth?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      setwaiting(false);
      setdatacopare(response.data.data);
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
  return (
    <div style={{ height: "auto" }}>
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

      <h2>Chart.</h2>
      <div className="ChartDefault">
        <h3>Order In Day</h3>
        <Form form={formChartByDay}>
          <Form.Item label="Date" name="Date">
            <Space direction="vertical">
              <DatePicker
                defaultValue={moment()}
                // disabledDate={disabledDate}
                // showTime={{ format: "HH:mm" }}
                onChange={handleDatePickerChange}
              />
            </Space>
          </Form.Item>
        </Form>
        <Line
          style={{ width: "100%" }}
          data={{
            labels: data ? data.map((data) => data.hour + "(H)") : "",
            datasets: [
              {
                label: "Order",
                data: data ? data.map((data) => data.recordCount) : "",
              },
            ],
          }}
        />
        <h4 style={{ padding: "1rem", textAlign: "center" }}>
          Chart Order in {stringPickDate}.
        </h4>
      </div>
      <hr />
      <Form form={form}>
        <Form.Item name="TypeChart" label="Type Chart" style={{ width: "30%" }}>
          <Select
            onChange={(value, option) => {
              var allchart = document.querySelectorAll(".Chart");
              allchart.forEach((element) => {
                element.classList.add("hide");
                element.classList.remove("display");
              });
              if (value !== "") {
                document.getElementById(value).classList.add("display");
              }
              formCompareByDay.resetFields(["Date1", "Date2"]);
              formCompareByMonth.resetFields(["Date1", "Date2"]);
              formCompareStoreBrandPerDay.resetFields([
                "Date",
                "BrandId1",
                "BrandId2",
              ]);
              formCompareStoreBrandPerMonth.resetFields([
                "Date",
                "BrandId1",
                "BrandId2",
              ]);
              setvalueCompare1("None");
              setvalueCompare2("None");
              setdatacopare(null);
            }}
          >
            <Option key="1" value="">
              Select Type Chart
            </Option>
            <Option key="2" value="ComparePerDay">
              Compare Per Day
            </Option>
            <Option key="3" value="ComparePerMonth">
              Compare Per Month
            </Option>
            <Option key="4" value="CompareStoreBrandPerDay">
              Compare Brand Per Day
            </Option>
            <Option key="5" value="CompareStoreBrandPerMonth">
              Compare Brand Per Month
            </Option>
          </Select>
        </Form.Item>
      </Form>
      <div className="Chart" id="ComparePerDay">
        <h3>Compare Revenue Via Day.</h3>
        <Form form={formCompareByDay} onFinish={handleComparePerDay}>
          <div
            style={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Date"
              name="Date1"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);
                    setvalueCompare1(moment(dateStrings).format("DD/MM/YYYY"));
                    setdatacopare(null);

                    formCompareByDay.setFieldsValue({
                      Date1: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item
              label="Date"
              name="Date2"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);
                    setvalueCompare2(moment(dateStrings).format("DD/MM/YYYY"));
                    formCompareByDay.setFieldsValue({
                      Date2: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item style={{ width: "25%" }} label="Brand" name="BrandId">
              <Select>
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Check
              </AntButton>
            </Form.Item>
          </div>
        </Form>
        <Bar
          style={{ width: "100%" }}
          data={{
            labels: datacompare
              ? datacompare.list1.map((data) => data.hour + "(H)")
              : "",
            datasets: [
              {
                label: valueCompare1,
                data: datacompare
                  ? datacompare.list1.map((data) => data.sum)
                  : "",
              },
              {
                label: valueCompare2,
                data: datacompare
                  ? datacompare.list2.map((data) => data.sum)
                  : "",
              },
            ],
          }}
        />
        <h6 style={{ padding: "1rem", textAlign: "center" }}>Compare Day.</h6>
      </div>
      <div className="Chart" id="ComparePerMonth">
        <h3>Compare Revenue Via Month.</h3>
        <Form form={formCompareByMonth} onFinish={handleComparePerMonth}>
          <div
            style={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Date"
              name="Date1"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  picker="month"
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);
                    // setvalueCompare1(moment(dateformat).format("DD/MM/YYYY"));
                    // setdatacopare(null);
                    setvalueCompare1(moment(dateStrings).format("DD/MM/YYYY"));
                    formCompareByMonth.setFieldsValue({
                      Date1: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item
              label="Date"
              name="Date2"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  picker="month"
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);
                    setvalueCompare2(moment(dateStrings).format("DD/MM/YYYY"));
                    formCompareByMonth.setFieldsValue({
                      Date2: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item style={{ width: "25%" }} label="Brand" name="BrandId">
              <Select>
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Check
              </AntButton>
            </Form.Item>
          </div>
        </Form>
        <Bar
          style={{ width: "100%" }}
          data={{
            labels: datacompare
              ? datacompare.list1.map((data) => data.day)
              : "",
            datasets: [
              {
                label: valueCompare1,
                data: datacompare
                  ? datacompare.list1.map((data) => data.sum)
                  : "",
              },
              {
                label: valueCompare2,
                data: datacompare
                  ? datacompare.list2.map((data) => data.sum)
                  : "",
              },
            ],
          }}
        />
        <h6 style={{ padding: "1rem", textAlign: "center" }}>Compare Month.</h6>
      </div>
      <div className="Chart" id="CompareStoreBrandPerDay">
        <h3>Compare Brand Via Day.</h3>
        <Form
          form={formCompareStoreBrandPerDay}
          onFinish={handleCompareStoreBrandPerDay}
        >
          <div
            style={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Date"
              name="Date"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);

                    setdatacopare(null);

                    formCompareStoreBrandPerDay.setFieldsValue({
                      Date: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item
              style={{ width: "25%" }}
              label="Brand"
              name="BrandId1"
              rules={[{ required: true, message: "Please input Brand!" }]}
            >
              <Select
                onChange={(value, option) => {
                  Brand.forEach((e) => {
                    if (e.id === value) {
                      setvalueCompare1(e.name);
                    }
                  });
                }}
              >
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ width: "25%" }}
              label="Brand"
              name="BrandId2"
              rules={[{ required: true, message: "Please input Brand!" }]}
            >
              <Select
                onChange={(value, option) => {
                  Brand.forEach((e) => {
                    if (e.id === value) {
                      setvalueCompare2(e.name);
                    }
                  });
                }}
              >
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Check
              </AntButton>
            </Form.Item>
          </div>
        </Form>
        <Bar
          style={{ width: "100%" }}
          data={{
            labels: datacompare
              ? datacompare.list1.map((data) => data.hour + "(H)")
              : "",
            datasets: [
              {
                label: valueCompare1,
                data: datacompare
                  ? datacompare.list1.map((data) => data.sum)
                  : "",
              },
              {
                label: valueCompare2,
                data: datacompare
                  ? datacompare.list2.map((data) => data.sum)
                  : "",
              },
            ],
          }}
        />
        <h6 style={{ padding: "1rem", textAlign: "center" }}>Compare Brand.</h6>
      </div>
      <div className="Chart" id="CompareStoreBrandPerMonth">
        <h3>Compare Brand Via Month.</h3>
        <Form
          form={formCompareStoreBrandPerMonth}
          onFinish={handleCompareStoreBrandPerMonth}
        >
          <div
            style={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Date"
              name="Date"
              rules={[{ required: true, message: "Please input Date!" }]}
            >
              <Space direction="vertical">
                <DatePicker
                  picker="month"
                  // defaultValue={moment()}
                  // disabledDate={disabledDate}
                  // showTime={{ format: "HH:mm" }}
                  onChange={(dates, dateStrings) => {
                    // var dateformat = FormatDate(dates, dateStrings);

                    setdatacopare(null);

                    formCompareStoreBrandPerMonth.setFieldsValue({
                      Date: dateStrings,
                    });
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item
              style={{ width: "25%" }}
              label="Brand"
              name="BrandId1"
              rules={[{ required: true, message: "Please input Brand!" }]}
            >
              <Select
                onChange={(value, option) => {
                  Brand.forEach((e) => {
                    if (e.id === value) {
                      setvalueCompare1(e.name);
                    }
                  });
                }}
              >
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ width: "25%" }}
              label="Brand"
              name="BrandId2"
              rules={[{ required: true, message: "Please input Brand!" }]}
            >
              <Select
                onChange={(value, option) => {
                  Brand.forEach((e) => {
                    if (e.id === value) {
                      setvalueCompare2(e.name);
                    }
                  });
                }}
              >
                {Brand?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Check
              </AntButton>
            </Form.Item>
          </div>
        </Form>
        <Bar
          style={{ width: "100%" }}
          data={{
            labels: datacompare
              ? datacompare.list1.map((data) => data.day)
              : "",
            datasets: [
              {
                label: valueCompare1,
                data: datacompare
                  ? datacompare.list1.map((data) => data.sum)
                  : "",
              },
              {
                label: valueCompare2,
                data: datacompare
                  ? datacompare.list2.map((data) => data.sum)
                  : "",
              },
            ],
          }}
        />
        <h6 style={{ padding: "1rem", textAlign: "center" }}>Compare Brand.</h6>
      </div>
    </div>
  );
}