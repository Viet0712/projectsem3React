import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSegment() {
  const { Option } = Select;
  const navigate = useNavigate();
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
  const [listSubcategory, setlistSubcategory] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Subcategory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistSubcategory(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listsegment, setlistSegment] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Segment/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistSegment(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [subcategoryMatch, setsubcategoryMatch] = useState([]);

  const handleChangeCategory = (value, option) => {
    const codeCategory = option.key;
    var Match = [];
    listSubcategory.forEach((element) => {
      if (element.categoryId === value) {
        Match.push(element);
      }
    });
    form.setFieldsValue({
      SubcategoryId: "",
      SegmentCode: "",
    });
    setsubcategoryMatch(Match);
  };
  const handleSubcategory = (value, option) => {
    const SubCategoryCode = option.key;
    var nextIndext =
      listsegment.filter((e) => e.subCategoryId === value).length + 1;
    console.log(nextIndext);
    form.setFieldsValue({
      SegmentCode: SubCategoryCode + "-SM" + nextIndext,
    });
  };
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      formData.append("CategoryId", value.CategoryId);
      formData.append("SubCategoryId", value.SubcategoryId);
      formData.append("Name", value.SegmentName.trim());
      formData.append("CodeSegment", value.SegmentCode);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "Segment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listsegment`);
      }
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
        <h1 className="mb-4">Create New Segment.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Category"
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
            label="Subcategory"
            name="SubcategoryId"
            rules={[
              { required: true, message: "Please input your Subcategory!" },
            ]}
          >
            <Select style={{ width: "80%" }} onChange={handleSubcategory}>
              {subcategoryMatch?.map((item) => (
                <Option key={item.codeSubcategory} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Itemx
            label="Segment Code (Read only)."
            name="SegmentCode"
            rules={[
              { required: true, message: "Please input your Segment Code!" },
            ]}
          >
            <Input readOnly />
          </Form.Itemx>
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
              Create
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
