import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, Radio, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function UpdateCategory() {
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("categoryId");

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
          APILink() + "Category/GetById/" + categoryId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        form.setFieldsValue({
          Id: response.data.data.id,
          CategoryName: response.data.data.name,
          CategoryCode: response.data.data.codeCategory,
        });
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
      formData.append("Id", value.Id);
      formData.append("CodeCategory", value.CategoryCode);
      formData.append("Name", value.CategoryName.trim());
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Category", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Update Success.Back To List")) {
        navigate(`/listcategory`);
      }
    } catch (error) {
      message.error("Update Error: " + error.response.data.message);
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
        <h1 className="mb-4">Update Category.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Category Code(Read Only)."
            name="CategoryCode"
            rules={[
              { required: true, message: "Please input your Category Code!" },
            ]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Category Name."
            name="CategoryName"
            rules={[
              { required: true, message: "Please input your Category Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
          <Form.Item name="Id">
            <Input readOnly hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
