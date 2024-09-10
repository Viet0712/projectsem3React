import React, { useState, useEffect } from "react";
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
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
export default function UpdateProperties() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const propertiesId = searchParams.get("propertiesId");

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
  const [listProduct, setlistProduct] = useState([]);

  const [listStore, setlistStore] = useState([]);
  const [waiting, setwaiting] = useState(false);
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

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Store", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistStore(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistProduct(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Properties/GetById/" + propertiesId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);

        // var productname = "";
        // listProduct.forEach((element) => {
        //   if (element.productId === response.data.data.productId)
        //     productname = element.name;
        // });
        // var storeAddress = "";
        // listStore.forEach((element) => {
        //   if (element.id === response.data.data.storeId)
        //     storeAddress =
        //       element.address + ", " + element.district + ", " + element.city;
        // });
        // console.log(date);
        form.setFieldsValue({
          Id: response.data.data.id,
          ProductId: response.data.data.productId,
          Name: response.data.data.name,
          CostPrice: response.data.data.costPrice,
          Price: response.data.data.price,
          ProductName: response.data.data.product.name,
        });

        // console.log(form.getFieldsValue());
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, []);
  const [fileList, setFileList] = useState([]);
  const handleCreate = async (value) => {
    // console.log(value);
    // const Product = listProduct.find((e) => e.productId === value.ProductId);
    // console.log(Product);

    // console.log(value);
    const formData = new FormData();
    try {
      formData.append("Id", value.Id);
      formData.append("ProductId", value.ProductId);

      formData.append("CostPrice", value.CostPrice);
      formData.append("Price", value.Price);
      formData.append("Name", value.Name.trim());
      if (value.CostPrice >= value.Price) {
        message.error("Price must be greater Cost ");
        return;
      }
      if (fileList.length > 0) {
        fileList.forEach((element) => {
          formData.append("UpLoadImage", element.originFileObj);
        });
      }
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (window.confirm("Update Success.Back To List")) {
        navigate(`/listpropertiesSAdmin`);
      }
    } catch (error) {
      message.error("Update Error: " + error.response.data.message);
    } finally {
      setwaiting(false);
    }
  };

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
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

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
      <div className="container my-5" style={{ height: "auto", width: "70%" }}>
        <h1 className="mb-4">Update Properties.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Product."
            name="ProductId"
            rules={[{ required: true, message: "Please input Product!" }]}
          >
            <Select style={{ width: "35%" }}>
              {listProduct?.map((item) => (
                <Option key={item.productId} value={item.productId}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ height: "auto", width: "35%" }}
            label="Name."
            name="Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Cost (USD)."
            name="CostPrice"
            rules={[{ required: true, message: "Please input Cost!" }]}
          >
            <InputNumber style={{ width: "25%" }} min={0.5} max={10000} />
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Price (USD)."
            name="Price"
            rules={[{ required: true, message: "Please input Price!" }]}
          >
            <InputNumber style={{ width: "25%" }} min={0.5} max={10000} />
          </Form.Item>

          <Form.Item label="Image." name="UploadImage">
            <Upload
              beforeUpload={beforeUpload}
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              showUploadList={{ showPreviewIcon: false }}
              onChange={handleChangeUpLoadImage}
            >
              {fileList.length >= 1 ? null : uploadButton}
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
