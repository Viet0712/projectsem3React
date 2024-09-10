import React, { useState, useEffect } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
// import apiRequestForm from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import { apiRequestGet, APILink } from "../../../Api/Api";
import { useLocation } from "react-router-dom";
import HCMDistrict from "../../../Json/HCMDistrict.json";
import HNDistrict from "../../../Json/HNDistrict.json";
import DNDistrict from "../../../Json/DNDistrict.json";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export default function CreateStore() {
  const navigate = useNavigate();

  const location = useLocation();
  const [newData, setNewData] = useState({});
  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const storeId = searchParams.get("storeId");
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
          APILink() + "Store/GetById/" + storeId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const storeData = response.data.data;
        setNewData(storeData);
        form.setFieldsValue({
          Id: storeData.id,
          Address: storeData.address,
          City: storeData.city,
          District: storeData.district,
        });
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, [storeId, form]);

  //   const handleChangeAddress = (e) => {
  //     setNewData({
  //       address: e.target.value,
  //     });
  //     form.setFieldsValue({ Address: e.target.value });
  //   };

  const handleChangeDistrict = (value) => {
    setNewData((prevData) => ({
      ...prevData,
      District: value,
    }));
  };

  const [District, setDistrict] = useState(HCMDistrict);
  const [Image, setImage] = useState({});
  const { Option } = Select;
  useEffect(() => {
    form.setFieldsValue({ District: District[0].name });
  }, [District, form]);
  const handleChangecity = (value) => {
    setNewData((prevData) => ({
      ...prevData,
      City: value,
      District: "",
    }));

    if (value === "HCM City") {
      setDistrict(HCMDistrict);
    }
    if (value === "HN City") {
      setDistrict(HNDistrict);
    }
    if (value === "DN City") {
      setDistrict(DNDistrict);
    }
  };

  const handleCreate = async (values) => {
    const formdata = new FormData();
    try {
      formdata.append("Id", values.Id);
      formdata.append("Address", values.Address.trim());
      formdata.append("District", values.District);
      formdata.append("City", values.City);
      formdata.append("UploadImage", Image);
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      console.log(values);
      console.log(formdata);
      const response = await axios.put(APILink() + "Store", formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      setImage(null);
      if (window.confirm("Update Success.Back To List")) {
        navigate("/liststore");
      }
    } catch (error) {
      message.error("Update Error: " + error.response.data.message);
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
        <h1 className="mb-4">Update Store.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input value={newData.address} />
          </Form.Item>
          <Form.Item
            label="City"
            name="City"
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <Select
              // value={newData.city}
              style={{ width: 120 }}
              onChange={handleChangecity}
            >
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
            <Select
              value={newData.district}
              style={{ width: 120 }}
              onChange={handleChangeDistrict}
            >
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
              Update
            </Button>
          </Form.Item>
          <Form.Item name="Id">
            <Input value={newData.id} readOnly hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
