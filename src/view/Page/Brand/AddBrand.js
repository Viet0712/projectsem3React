import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { UploadOutlined } from "@ant-design/icons";

export default function AddBrand() {
  const navigate = useNavigate();
  const [Image, setImage] = useState({});
  const [form] = Form.useForm();
  var token = sessionStorage.getItem("token");
  const [waiting, setwaiting] = useState(false);
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
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      formData.append("Name", value.BrandName.trim());
      formData.append("Description", value.Description.trim());

      formData.append("UploadImage", Image);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "Brand", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setImage(null);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listbrand`);
      }
      form.setFieldsValue({
        BrandName: "",
        Description: "",
      });
    } catch (error) {
      message.error("Error: " + error.response.data.message);
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
      <div className="container my-5" style={{ height: "auto", width: "50%" }}>
        <h1 className="mb-4">Create New Brand.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Brand Name."
            name="BrandName"
            rules={[
              { required: true, message: "Please input your Brand Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description."
            name="Description"
            rules={[
              { required: true, message: "Please input your Description!" },
            ]}
          >
            <Input />
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
