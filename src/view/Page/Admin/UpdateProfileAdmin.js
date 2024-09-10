import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, Radio, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function UpdateAdmin() {
  const navigate = useNavigate();

  const [form] = Form.useForm(); // Create form instance

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
  const [liststore, setListore] = useState(null);
  const [waiting, setwaiting] = useState(false);
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get("http://localhost:5102/api/Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data[0].address);

        setListore(response.data.data);
      } catch (error) {
        message.error("Error: " + error);
      } finally {
      }
    };
    fetchStore();
  }, []);
  const [role, setRole] = useState("");
  const [strore, setStore] = useState("");
  console.log(strore);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Admin/GetById/" + sessionStorage.getItem("adminId"),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setRole(response.data.data.role);
        setStore(response.data.data.storeId);
        form.setFieldsValue({
          Id: response.data.data.id,
          StoreId: response.data.data.storeId,
          StoreAdrress: sessionStorage.getItem("storeAddress"),
          Role: response.data.data.role,
          FullName: response.data.data.fullName,
          Email: response.data.data.email,
          Password: response.data.data.password,
          ConfirmPassword: response.data.data.password,
          Phone: response.data.data.phone,
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

  const handleCreate = async (value) => {
    const reg = /^0[1-9][0-9]{8,11}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(value.Email)) {
      message.error("Email wrong format");
      setwaiting(false);
      return;
    }
    if (!reg.test(value.Phone)) {
      message.error(
        "Phone Only accept number with a length between 10 and 12 digits!, or wrong format "
      );

      return;
    }
    if (value.Password !== value.ConfirmPassword) {
      message.error("Incorect Confirm Password! ");

      return;
    }

    if (value.UploadImage !== undefined) {
      console.log(value.UploadImage.file.type);
      const isJpgOrPng =
        value.UploadImage.file.type === "image/jpeg" ||
        value.UploadImage.file.type === "image/png" ||
        value.UploadImage.file.type === "image/jpg";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG/JPEG files!");
        return;
      }
    }
    const formData = new FormData();
    try {
      if (strore !== null) {
        formData.append("StoreId", value.StoreId);
      }
      formData.append("Id", value.Id);
      formData.append("FullName", value.FullName.trim());

      formData.append("Email", value.Email.trim());
      formData.append("Password", value.Password.trim());
      formData.append("Phone", value.Phone.trim());
      formData.append("UploadImage", Image);
      formData.append("Role", value.Role);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }

    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Admin/Update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      setImage(null);
      message.success("Update: " + response.data.message);
    } catch (error) {
      message.error("Error: " + error.response.data.message);
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
        <h1 className="mb-4">Update Admin</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="FullName."
            name="FullName"
            rules={[{ required: true, message: "Please input your FullName!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email (Read only)." name="Email">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Password."
            name="Password"
            rules={[{ required: true, message: "Please input your PassWord!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password."
            name="ConfirmPassword"
            rules={[{ required: true, message: "Please input your PassWord!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Phone."
            name="Phone"
            rules={[{ required: true, message: "Please input your Phone!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Store (Read only)." name="StoreAdrress">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Role (Read only)." name="Role">
            <Input readOnly />
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

          <Form.Item name="StoreId">
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
