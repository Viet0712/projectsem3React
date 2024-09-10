import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Next } from "react-bootstrap/esm/PageItem";

export default function AddSubcategoy() {
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [Loading, setLoading] = useState(false);
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
  const [listCategory, setlistCategory] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistCategory(response.data.data);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchdata();
  }, []);
  const [listsubcategory, setlistsubcategory] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Subcategory/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistsubcategory(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const handleChangeCategory = (value, option) => {
    var nextIndex =
      listsubcategory.filter((e) => e.categoryId === value).length + 1;

    const codeCategory = option.key;
    form.setFieldsValue({
      CategoryId: value,
      SubcategoryCode: codeCategory + "-S" + nextIndex,
      SubcategoryName: "",
    });
  };
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      formData.append("CategoryId", value.CategoryId);
      formData.append("CodeSubcategory", value.SubcategoryCode);
      formData.append("Name", value.SubcategoryName.trim());
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "Subcategory", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listsubcategory`);
      }
      setLoading(!Loading);
    } catch (error) {
      message.error("Create Error: " + error.response.data.message);
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
        <h1 className="mb-4">Create New Subcategory.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Category."
            name="CategoryId"
            rules={[{ required: true, message: "Please input your Category!" }]}
          >
            <Select style={{ width: "80%" }} onChange={handleChangeCategory}>
              {listCategory?.map((item) => (
                <Option key={item.codeCategory} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: "80%" }}
            label="Subcategory Code (Read only)."
            name="SubcategoryCode"
            rules={[
              {
                required: true,
                message: "Please input your Subcategory Code!",
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Subcategory Name."
            name="SubcategoryName"
            style={{ width: "80%" }}
            rules={[
              {
                required: true,
                message: "Please input your Subcategory Name!",
              },
            ]}
          >
            <Input />
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
