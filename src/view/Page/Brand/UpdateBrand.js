import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, Radio, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
export default function UpdateBrand() {
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const brandId = searchParams.get("brandId");

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
          APILink() + "Brand/GetById/" + brandId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        form.setFieldsValue({
          Id: response.data.data.id,
          BrandName: response.data.data.name,
          Description: response.data.data.description,
        });
      } catch (error) {
        message.error("Error: " + error);
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, []);
  const [Image, setImage] = useState({});
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
      formData.append("Id", value.Id);
      formData.append("Name", value.BrandName.trim());
      formData.append("Description", value.Description.trim());
      formData.append("UploadImage", Image);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Brand", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setImage(null);

      if (window.confirm("Update Success.Back To List")) {
        navigate(`/listbrand`);
      }
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
        <h1 className="mb-4">Update Brand.</h1>
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
