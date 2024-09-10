import React, { useState, useEffect, useRef } from "react";
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
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";

export default function AddGoods() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertiesId = searchParams.get("propertiesId");

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
          APILink() + "Properties/GetByIdRoleAdmin/" + propertiesId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        form.setFieldsValue({
          PropertiesName: response.data.data.name,
          ProductName: response.data.data.product.name,
          StoreAddress: sessionStorage.getItem("storeAddress"),
          PropertiesId: propertiesId,
        });
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
  }, []);
  const handleCreate = async (value) => {
    console.log(value);

    const Entry_date = new Date(value.Entry_date);
    const timezoneOffsetInMinutesStartDate = Entry_date.getTimezoneOffset();

    Entry_date.setTime(
      Entry_date.getTime() - timezoneOffsetInMinutesStartDate * 60 * 1000
    );

    const formattedEntry_date = Entry_date.toISOString();

    try {
      const formData = new FormData();
      if (value.Expiried_date !== undefined) {
        const Expiried_date = new Date(value.Expiried_date);
        const timezoneOffsetInMinutesEndDate =
          Expiried_date.getTimezoneOffset();
        Expiried_date.setTime(
          Expiried_date.getTime() - timezoneOffsetInMinutesEndDate * 60 * 1000
        );
        const formattedExpiried_date = Expiried_date.toISOString();
        formData.append("Expiry_date", formattedExpiried_date);
      }
      formData.append("PropertiesId", value.PropertiesId);
      formData.append("Stock", value.Stock);
      formData.append("Arrival_date", formattedEntry_date);
      setwaiting(true);
      const response = await axios.post(APILink() + "Good", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Create Success.Back To List Properties")) {
        navigate(`/listproperties`);
      }
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
  const handleRangeChangeEntry_date = (dates, dateStrings) => {
    form.setFieldsValue({ Entry_date: dates });
  };
  const handleRangeChangeExpiried_date = (dates, dateStrings) => {
    form.setFieldsValue({ Expiried_date: dates });
  };
  const disabledDateEntry = (current) => {
    return current && current > moment().endOf("day");
  };
  const disabledDateExprie = (current) => {
    return current && current < moment().endOf("day");
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
      <div className="container my-5" style={{ height: "auto", width: "70%" }}>
        <h1 className="mb-4">Add Goods.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Product(Readonly)."
            name="ProductName"
            style={{ width: "35%" }}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            style={{ height: "auto", width: "35%" }}
            label="Properties Name(ReadOnly)."
            name="PropertiesName"
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item
            label="Store(Readonly)."
            name="StoreAddress"
            style={{ width: "35%" }}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Stock."
            name="Stock"
            rules={[{ required: true, message: "Please input Stock!" }]}
          >
            <InputNumber style={{ width: "25%" }} min={1} max={10000} />
          </Form.Item>
          <Form.Item
            label="Entry date."
            name="Entry_date"
            rules={[{ required: true, message: "Please input Date!" }]}
          >
            <Space direction="vertical">
              <DatePicker
                disabledDate={disabledDateEntry}
                onChange={handleRangeChangeEntry_date}
              />
            </Space>
          </Form.Item>
          <Form.Item label="Expiried date." name="Expiried_date">
            <Space direction="vertical">
              <DatePicker
                disabledDate={disabledDateExprie}
                onChange={handleRangeChangeExpiried_date}
              />
            </Space>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
          <Form.Item name="PropertiesId">
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
