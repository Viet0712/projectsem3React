import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function UpdateSegment() {
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const segmentId = searchParams.get("segmentId");

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
          APILink() + "Segment/GetById/" + segmentId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        var dataresponse = response.data.data;
        form.setFieldsValue({
          Id: response.data.data.id,
          CategoryCode: dataresponse.subcategory.category.codeCategory,
          SubcategoryName: dataresponse.subcategory.name,
          SubcategoryCode: dataresponse.subcategory.codeSubcategory,
          CategoryId: dataresponse.subcategory.category.id,
          CategoryName: dataresponse.subcategory.category.name,
          SegmentCode: dataresponse.codeSegment,
          SegmentName: dataresponse.name,
          SubcategoryId: dataresponse.subcategory.id,
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
      formData.append("Name", value.SegmentName.trim());
      formData.append("CodeSegment", value.SegmentCode);
      formData.append("SubCategoryId", value.SubcategoryId);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Segment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Update Success.Back To List")) {
        navigate(`/listsegment`);
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
        <h1 className="mb-4">Update Segment.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Category Code (Read Only)." name="CategoryCode">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Category Name (Read Only)." name="CategoryName">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Subcategory Code (Read Only)."
            name="SubcategoryCode"
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Subcategory Name (Read Only)."
            name="SubcategoryName"
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Segment Code (Read Only)." name="SegmentCode">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Segment Name."
            name="SegmentName"
            rules={[
              { required: true, message: "Please input your Segment Name!" },
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
            <Input hidden />
          </Form.Item>
          <Form.Item name="CategoryId">
            <Input hidden />
          </Form.Item>
          <Form.Item name="SubcategoryId">
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
