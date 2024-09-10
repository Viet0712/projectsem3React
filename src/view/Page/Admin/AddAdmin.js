import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, Radio, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const { Option } = Select;
export default function AddAdmin() {
  const navigate = useNavigate();
  const { setLayout } = useLayout();
  useEffect(() => {
    if (sessionStorage.getItem("role") === "SAdmin") {
      setLayout("SAdmin");
    } else {
      setLayout("auth");
    }
  }, [setLayout]);
  //   const [newData, setNewData] = useState({
  //     Address: "",
  //     District: "Quận 1",
  //     City: "HCM City",
  //   });
  const [liststore, setListore] = useState(null);
  const [form] = Form.useForm();

  if (liststore !== null) {
    form.setFieldsValue({
      Store: liststore[0].id,
      Role: "Admin",
    });
  }
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
  //   const [role, setRole] = useState(null);
  //   const onChangeRole = (e) => {
  //     console.log("radio checked", e.target.value);
  //     setRole(e.target.value);
  //   };

  const [Image, setImage] = useState({});
  console.log(Image);
  var token = sessionStorage.getItem("token");

  const handleCreate = async (value) => {
    const reg = /^0[1-9][0-9]{8,11}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(value.Email)) {
      message.error("Email wrong format , must have letter @");
      setwaiting(false);
      return;
    }
    if (!reg.test(value.Phone)) {
      message.error(
        "Phone Only accept number with a length between 10 and 12 digits! , or wrong format "
      );
      setwaiting(false);
      return;
    }
    if (value.Password !== value.ConfirmPassword) {
      message.error("Incorect Confirm Password! ");

      return;
    }
    const formData = new FormData();
    try {
      formData.append("FullName", value.FullName.trim());
      formData.append("StoreId", value.Store);
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
      const response = await axios.post(APILink() + "Admin", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      form.setFieldsValue({
        Store: liststore[0].address,
        Role: "Admin",
      });
      setImage(null);
      setwaiting(false);
      if (window.confirm("Create Success, Back To List")) {
        navigate(`/listadmin`);
      }
    } catch (error) {
      setwaiting(false);
      message.error("Create Error: " + error.response.data.message);
    }
  };
  //   const handleBeforeUpload = (file) => {
  //     const isJpgOrPng =
  //       file.type === "image/jpeg" ||
  //       file.type === "image/png" ||
  //       file.type === "image/jpg";
  //     if (!isJpgOrPng) {
  //       message.error("You can only upload JPG/PNG/JPEG files!");
  //       return;
  //     }
  //     setImage(file);
  //     return false;
  //   };
  //   const handleRemove = () => {
  //     setImage({}); // Clear the file list when a file is removed
  //   };
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
        <h1 className="mb-4">Create New Admin</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="FullName."
            name="FullName"
            rules={[{ required: true, message: "Please input your FullName!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email."
            name="Email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input />
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
          <Form.Item
            label="Store"
            name="Store"
            rules={[{ required: true, message: "Please input your Store!" }]}
          >
            <Select style={{ width: "100%" }}>
              {liststore?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.address}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="Role">
            {/* <Radio.Group>
              <Radio value="Admin">Admin</Radio>

              <Radio value="SAdmin">SAdmin</Radio>
            </Radio.Group> */}
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
