import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Upload,
  Input,
  Select,
  message,
  InputNumber,
  DatePicker,
  Space,
} from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
export default function AddFlashSale() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
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
  }, [setLayout]);
  const [waiting, setwaiting] = useState(false);
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      const dates = value.Date;
      console.log(value);
      const endDate = new Date(dates[1]);
      const timezoneOffsetInMinutesEndDate = endDate.getTimezoneOffset();

      endDate.setTime(
        endDate.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
      );

      const formattedEndDate = endDate.toISOString();

      const startDate = new Date(dates[0]);
      const timezoneOffsetInMinutesStartDate = startDate.getTimezoneOffset();

      startDate.setTime(
        startDate.getTime() - timezoneOffsetInMinutesStartDate * 60 * 1000
      );

      const formattedstartDate = startDate.toISOString();

      formData.append("Description", value.Description.trim());
      formData.append("Name", value.Name.trim());
      formData.append("Volume", value.Volume);
      formData.append("Start_Date", formattedstartDate);
      formData.append("End_Date", formattedEndDate);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "FlashSale", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listflashsale`);
      }
    } catch (error) {
      message.error("Create Error: " + error.response.data.message);
    } finally {
      setwaiting(false);
    }
  };
  const handleRangeChange = (dates, dateStrings) => {
    form.setFieldsValue({ Date: dates });
  };
  const disabledDate = (current) => {
    // Can not select days before today

    return current && current < moment().startOf("day");
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
      <div className="container my-5" style={{ height: "auto", width: "50%" }}>
        <h1 className="mb-4">Create New Flash Sale.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Name."
            name="Name"
            rules={[
              { required: true, message: "Please input your Flash Sale Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description."
            name="Description"
            rules={[{ required: true, message: "Please input Description!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Volume."
            name="Volume"
            rules={[{ required: true, message: "Please input Volume!" }]}
          >
            <InputNumber min={1} max={80} style={{ width: "20%" }} />
          </Form.Item>
          <Form.Item
            label="Date."
            name="Date"
            rules={[{ required: true, message: "Please input Date!" }]}
          >
            <Space direction="vertical">
              <RangePicker
                disabledDate={disabledDate}
                showTime={{ format: "HH:mm" }}
                onChange={handleRangeChange}
              />
            </Space>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
