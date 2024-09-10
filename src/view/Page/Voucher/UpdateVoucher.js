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
  Radio,
} from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
export default function UpdateFlashSale() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const voucherId = searchParams.get("voucherId");

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Voucher/GetById/" + voucherId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        var date = [
          moment(response.data.data.start_at),
          moment(response.data.data.expiry_date),
        ];

        // console.log(date);
        form.setFieldsValue({
          Id: response.data.data.id,
          Name: response.data.data.name,
          Type: response.data.data.type,
          Quantity: response.data.data.quantity,
          Volume: response.data.data.volume,
          Date: date,
          Start: moment(response.data.data.start_at).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
          End: moment(response.data.data.expiry_date).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
        });

        // console.log(form.getFieldsValue());
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, []);
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      const dates = value.Date;
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
      console.log(formattedstartDate);

      formData.append("Id", value.Id);
      formData.append("Type", value.Type);
      formData.append("Quantity", value.Quantity);
      formData.append("Name", value.Name.trim());
      formData.append("Volume", value.Volume);
      formData.append("Start_at", formattedstartDate);
      formData.append("Expiry_date", formattedEndDate);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Voucher", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Update Success.Back To List")) {
        navigate(`/listvoucher`);
      }
    } catch (error) {
      message.error("Update Error: " + error.response.data.message);
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
        <h1 className="mb-4">Update Voucher.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Name."
            name="Name"
            rules={[
              { required: true, message: "Please input your Voucher Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Type." name="Type">
            <Radio.Group>
              <Radio value="PERCENT">Percent</Radio>
              <Radio value="AMOUNT">Amount</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Volume."
            name="Volume"
            rules={[{ required: true, message: "Please input Volume!" }]}
          >
            <InputNumber min={1} max={80} style={{ width: "20%" }} />
          </Form.Item>
          <Form.Item
            label="Quantity."
            name="Quantity"
            rules={[{ required: true, message: "Please input Quantity!" }]}
          >
            <InputNumber min={1} max={10000} style={{ width: "20%" }} />
          </Form.Item>
          <Form.Item label="Start." name="Start">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="End." name="End">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="New Date (Optional)." name="Date">
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
              Update
            </Button>
          </Form.Item>
          <Form.Item name="Id">
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
