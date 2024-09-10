import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import HCMDistrict from "../../../Json/HCMDistrict.json";
import HNDistrict from "../../../Json/HNDistrict.json";
import DNDistrict from "../../../Json/DNDistrict.json";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function CreateStore() {
  const navigate = useNavigate();

  const [newData, setNewData] = useState({
    Address: "",
    District: "Quận 1",
    City: "HCM City",
  });

  const [Image, setImage] = useState({});
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
  const [District, setDistrict] = useState(HCMDistrict);
  useEffect(() => {
    form.setFieldsValue({ District: District[0].name });
  }, [District, form]);

  const handleChangeCity = (value) => {
    if (value === "HCM City") {
      setDistrict(HCMDistrict);
    } else if (value === "HN City") {
      setDistrict(HNDistrict);
    } else if (value === "DN City") {
      setDistrict(DNDistrict);
    }
  };

  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      formData.append("Address", value.Address.trim());
      formData.append("District", value.District);
      formData.append("City", value.City);
      formData.append("UploadImage", Image);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      console.log([...formData.values()]);
      const response = await axios.post(APILink() + "Store", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setNewData({
        Address: "",
        District: "Quận 1",
        City: "HCM City",
      });
      setImage(null);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/liststore`);
      }
    } catch (error) {
      message.error("Create Error: " + error.response.data.message);
    } finally {
      setwaiting(false);
    }
  };
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent automatic upload
  };
  const handleChange = (info) => {
    const file = info.file;
    if (file.status === "removed") {
      setImage(null);
      message.info("File removed");
    } else {
      setImage(file);
      message.success(`${file.name} file uploaded successfully.`);
    }
    console.log(file);
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
        <h1 className="mb-4">Create New Store.</h1>
        <Form
          form={form}
          layout="vertical"
          initialValues={newData}
          onFinish={handleCreate}
        >
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input value={newData.Address} />
          </Form.Item>
          <Form.Item
            label="City"
            name="City"
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <Select style={{ width: 120 }} onChange={handleChangeCity}>
              <Option value="HCM City">HCM City</Option>
              <Option value="HN City">HN City</Option>
              <Option value="DN City">DN City</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="District"
            name="District"
            rules={[{ required: true, message: "Please input your district!" }]}
          >
            <Select style={{ width: 120 }}>
              {District?.map((item) => (
                <Option key={item.id} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Image" name="UploadImage">
            <Upload
              beforeUpload={beforeUpload}
              accept=".jpg,.jpeg,.png"
              maxCount={1}
              onChange={handleChange}
            >
              <Button icon={<UploadOutlined />}>Image</Button>
            </Upload>
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
