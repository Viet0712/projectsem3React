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
import "../../../styles/Chart.css";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { PlusOutlined } from "@ant-design/icons";

export default function ImportProduct() {
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
  const beforeUpload = (file) => {
    const extensions = [".xlsx", ".xls", ".xlsm", ".xlsb", ".xltx", ".xltm"];
    const fileExtension = "." + file.name.split(".").pop(); // Lấy đuôi của tệp từ tên file

    const isExcelFile = extensions.includes(fileExtension.toLowerCase());
    if (!isExcelFile) {
      message.error(
        "You can only upload Excel files (.xlsx, .xls, .xlsm, .xlsb, .xltx, .xltm)!"
      );
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent automatic upload
  };
  const [fileList, setFileList] = useState([]);
  const handleChangeUpLoadImage = (info) => {
    console.log(info);
    if (info.file.status === "removed") {
      message.info("File removed");
    } else {
      // setImage(...Image, info.file);
      message.success(`${info.file.name} file uploaded successfully.`);
    }

    setFileList(info.fileList);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          width: "50%",
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleCreate = async (value) => {
    console.log(value.FileExcel.file);

    try {
      setwaiting(true);
      const formData = new FormData();

      formData.append("file", value.FileExcel.file);
      const response = await axios.post(
        APILink() + "Import/ImportProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      setwaiting(false);
      message.success("Up Load Success!");
    } catch (error) {
      setwaiting(false);
      message.error("Create Error: " + error);
    }
  };
  const [waiting, setwaiting] = useState(false);
  return (
    <div>
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
      <h4 className="mb-4">Import File Product.</h4>
      <Form
        className="container my-5"
        style={{ height: "auto", width: "70%" }}
        form={form}
        layout="vertical"
        onFinish={handleCreate}
      >
        <Form.Item
          label="File."
          name="FileExcel"
          rules={[{ required: true, message: "Please input File!" }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            accept=".xls,.xlsx,.xlsm,.xlsb,.xltx,.xltm"
            listType="picture-card"
            showUploadList={{ showPreviewIcon: false }}
            onChange={handleChangeUpLoadImage}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            UpLoad
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
