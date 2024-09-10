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
import { APILink } from "../../../Api/Api";
import FormatDate from "../../Function/FormatDate";

export default function Daily() {
  const [form] = Form.useForm();
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
  }, []);
  const [now] = useState(moment());
  const [waiting, setwaiting] = useState(false);
  const handleDatePickerChange = (dates, dateStrings) => {
    form.setFieldsValue({ Date: dateStrings });
  };
  useEffect(() => {
    const defaultDate = new Date(moment());

    const timezoneOffsetInMinutesEndDate = defaultDate.getTimezoneOffset();

    defaultDate.setTime(
      defaultDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
    );

    const LocaldefaulDate = defaultDate.toISOString();
    form.setFieldsValue({ Date: LocaldefaulDate });
  });
  const handleReportDaily = async (value) => {
    console.log(form.getFieldsValue);
    console.log(value);
    try {
      setwaiting(true);
      const params = {
        date: value.Date,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        APILink() + "Report/Daily?" + queryString,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Daily_${moment(value.Date).format("DD/MM/YYYY")}.xlsx`
      ); // Đặt tên file tải về
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log(response);
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
      <h2>Daily Report.</h2>
      <div
        style={{
          width: "25%",
          marginLeft: "15%",
        }}
      >
        <Form
          onFinish={handleReportDaily}
          layout="vertical"
          form={form}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Form.Item label="Date." name="Date">
            <Space direction="vertical">
              <DatePicker
                defaultValue={now}
                // disabledDate={disabledDate}
                // showTime={{ format: "HH:mm" }}
                onChange={handleDatePickerChange}
              />
            </Space>
          </Form.Item>
          <Form.Item label=" ">
            <AntButton type="primary" htmlType="submit">
              Export.
            </AntButton>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
