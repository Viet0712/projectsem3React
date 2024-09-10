import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Upload,
  Input,
  Select,
  message,
  InputNumber,
  Radio,
} from "antd";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import { APILink } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import Country from "../../../Json/Country.json";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined } from "@ant-design/icons";

export default function AddProduct() {
  const { Option } = Select;
  const navigate = useNavigate();
  const [Image, setImage] = useState({});
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
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Product/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        if (response.data.data.length < 9) {
          form.setFieldsValue({
            ProductId: "P0" + (response.data.data.length + 1),
          });
        } else {
          form.setFieldsValue({
            ProductId: "P" + (response.data.data.length + 1),
          });
        }
      } catch (error) {
        message.error("Error: ", error.response.data.message);
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, []);
  const handleCreate = async (value) => {
    const formData = new FormData();
    try {
      console.log(fileList);
      console.log(value);

      formData.append("ProductId", value.ProductId);
      formData.append("CategoryID", value.CategoryId);
      if (value.SubcategoryId !== "") {
        formData.append("SubCategoryId", value.SubcategoryId);
      }
      if (value.SegmentId !== "") {
        formData.append("SegmentId", value.SegmentId);
      }
      if (value.BrandId !== undefined) {
        formData.append("BrandId", value.BrandId);
      }
      if (value.Madein !== undefined) {
        formData.append("MadeIn", value.Madein);
      }
      if (value.Weight !== undefined) {
        var Weight = value.Weight + " Kg.";
        formData.append("Weight", Weight);
      }
      if (value.Volume !== undefined) {
        var Volume = value.Volume + " L.";
        formData.append("Volume", Volume);
      }
      if (value.Shelf_life !== undefined) {
        var Shelf_life = value.Shelf_life + " Month.";
        formData.append("Shelf_life", Shelf_life);
      }
      formData.append("Expiry_date", value.Packaging);

      formData.append("Name", value.ProductName.trim());
      if (value.Description !== "") {
        formData.append("Description", value.Description);
      }

      if (fileList.length > 0) {
        fileList.forEach((element) => {
          formData.append("UploadImagesProduct", element.originFileObj);
        });
      }
    } catch (error) {
      message.error("Error :" + error);
      return;
    }

    try {
      setwaiting(true);

      const response = await axios.post(APILink() + "Product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setImage(null);

      if (window.confirm("Create Success.Back To List")) {
        navigate(`/listproduct`);
      }
    } catch (error) {
      console.log(error);
      message.error(
        "Create Error: " + error.response ? error.response.data.message : error
      );
    } finally {
      setwaiting(false);
    }
  };
  const quillRef = useRef();
  const [content, setContent] = useState("");
  const handleChangeDescription = (content, delta, source, editor) => {
    // Remove <p> tags around <img> elements
    const updatedContent = content.replace(/<p>(<img[^>]+>)<\/p>/g, "$1");
    setContent(updatedContent);
  };
  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
    // Thêm tùy chọn điều chỉnh font size
    [{ size: ["small", false, "large", "huge"] }],
  ];

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "align",
  ];
  const [listBrand, setlistBrand] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Brand", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);

        setlistBrand(response.data.data);
        form.setFieldsValue({
          Packaging: "Bottle, Can, Jar.",
        });
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchdata();
  }, []);
  const [listCategory, setlistCategory] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);

        setlistCategory(response.data.data);
      } catch (error) {
      } finally {
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
        // console.log(response.data.data);

        setlistSubcategory(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listSegment, setlistSegment] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Segment", {
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
  const [segmentMatch, setsegmentMatch] = useState([]);
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
      SegmentId: "",
    });
    setsubcategoryMatch(Match);
  };
  const handleSubcategory = (value, option) => {
    const codeSubcategory = option.key;
    var Match = [];
    listSegment.forEach((element) => {
      if (element.subCategoryId === value) {
        Match.push(element);
      }
    });
    form.setFieldsValue({
      SegmentId: "",
    });

    setsegmentMatch(Match);
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
        <h1 className="mb-4">Create New Product.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            style={{ height: "auto", width: "35%" }}
            label="Product Code (Read only)."
            name="ProductId"
            rules={[
              { required: true, message: "Please input your Product Name!" },
            ]}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            style={{ height: "auto", width: "35%" }}
            label="Product Name."
            name="ProductName"
            rules={[
              { required: true, message: "Please input your Product Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category."
            name="CategoryId"
            rules={[{ required: true, message: "Please input your Category!" }]}
          >
            <Select style={{ width: "35%" }} onChange={handleChangeCategory}>
              {listCategory?.map((item) => (
                <Option key={item.codeCategory} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Subcategory." name="SubcategoryId">
            <Select style={{ width: "35%" }} onChange={handleSubcategory}>
              {subcategoryMatch?.map((item) => (
                <Option key={item.codeSubcategory} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Segment." name="SegmentId">
            <Select style={{ width: "35%" }}>
              {segmentMatch?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Brand."
            name="BrandId"
            rules={[{ required: true, message: "Please input Brand!" }]}
          >
            <Select style={{ width: "35%" }}>
              {listBrand?.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Made In."
            name="Madein"
            rules={[{ required: true, message: "Please input Country!" }]}
          >
            <Select style={{ width: "35%" }}>
              {Country?.map((item) => (
                <Option key={item.id} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Weight (Kg)."
            name="Weight"
          >
            <InputNumber style={{ width: "25%" }} min={0.1} max={200} />
          </Form.Item>
          <Form.Item style={{ width: "35%" }} label="Volume (L)," name="Volume">
            <InputNumber style={{ width: "25%" }} min={0.1} max={200} />
          </Form.Item>
          <Form.Item
            style={{ width: "35%" }}
            label="Shelf life (Month)."
            name="Shelf_life"
          >
            <InputNumber style={{ width: "25%" }} min={0.5} max={200} />
          </Form.Item>
          <Form.Item label="Packaging." name="Packaging">
            <Radio.Group>
              <Radio value="Bottle, Can, Jar.">Bottle, Can, Jar.</Radio>
              <Radio value="Bag.">Bag.</Radio>
              <Radio value="Box, Carton.">Box, Carton.</Radio>
              <Radio value="Bar format.">Bar format.</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className="box_description"
            label="Description."
            name="Description"
            rules={[{ required: true, message: "Please input Description" }]}
          >
            <ReactQuill
              ref={quillRef}
              modules={{
                toolbar: toolbarOptions,
              }}
              formats={formats}
              value={content}
              onChange={handleChangeDescription}
              style={{ width: "100%", background: "white", height: "50vh" }}
              className="description"
            />
          </Form.Item>
          <Form.Item
            label="Image (Max 5 File)."
            name="UploadImage"
            rules={[{ required: true, message: "Please input Product Image!" }]}
          >
            {/* <Upload
            beforeUpload={beforeUpload}
            accept=".jpg,.jpeg,.png"
            maxCount={5}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Image</Button>
          </Upload> */}
            <Upload
              beforeUpload={beforeUpload}
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              showUploadList={{ showPreviewIcon: false }}
              onChange={handleChangeUpLoadImage}
            >
              {fileList.length >= 8 ? null : uploadButton}
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
