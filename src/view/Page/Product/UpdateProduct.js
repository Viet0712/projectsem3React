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
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import Country from "../../../Json/Country.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined } from "@ant-design/icons";

export default function UpdateProduct() {
  const { Option } = Select;
  const navigate = useNavigate();

  const location = useLocation();

  const [form] = Form.useForm(); // Create form instance
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("productId");

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
  const [listSubcategory, setlistSubcategory] = useState([]);
  const [listSegment, setlistSegment] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Product/GetById/" + productId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        var Matchsubcategory = [];
        var Matchsegment = [];
        listSubcategory.forEach((element) => {
          if (element.categoryId === response.data.data.categoryID) {
            Matchsubcategory.push(element);
          }
        });
        listSegment.forEach((element) => {
          if (element.subCategoryId === response.data.data.subCategoryId) {
            Matchsegment.push(element);
          }
        });
        setsubcategoryMatch(Matchsubcategory);
        setsegmentMatch(Matchsegment);
        form.setFieldsValue({
          ProductId: response.data.data.productId,
          CategoryId: response.data.data.categoryID,
          SubcategoryId: response.data.data.subCategoryId,
          SegmentId: response.data.data.segmentId,
          BrandId: response.data.data.brandId,
          Madein: response.data.data.madeIn,
          Weight: response.data.data.weight,
          Volume: response.data.data.volume,
          Shelf_life: response.data.data.shelf_life,
          Packaging: response.data.data.expiry_date,
          ProductName: response.data.data.name,
          Description: response.data.data.description,
        });
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };

    fetchData();
  }, [listSubcategory, listSegment]);
  const [Image, setImage] = useState({});
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
  const handleCreate = async (value) => {
    console.log(fileList);
    console.log(value);
    const formData = new FormData();
    try {
      formData.append("ProductId", value.ProductId);
      formData.append("CategoryID", value.CategoryId);
      if (value.SubcategoryId !== null) {
        formData.append("SubCategoryId", value.SubcategoryId);
      }
      if (value.SegmentId !== null) {
        formData.append("SegmentId", value.SegmentId);
      }
      if (value.BrandId !== null) {
        formData.append("BrandId", value.BrandId);
      }
      if (value.Madein !== null) {
        formData.append("MadeIn", value.Madein);
      }
      if (value.Weight !== null) {
        var Weight = value.Weight + " Kg.";
        formData.append("Weight", Weight);
      }
      if (value.Volume !== null) {
        var Volume = value.Volume + " L.";
        formData.append("Volume", Volume);
      }
      if (value.Shelf_life !== null) {
        var Shelf_life = value.Shelf_life + " Month.";
        formData.append("Shelf_life", Shelf_life);
      }
      formData.append("Expiry_date", value.Packaging);

      formData.append("Name", value.ProductName);
      if (value.Description !== "") {
        formData.append("Description", value.Description);
      }

      if (fileList.length > 0) {
        fileList.forEach((element) => {
          formData.append("UploadImagesProduct", element.originFileObj);
        });
      }
    } catch (error) {
      message.error("Error Form : " + error);
      return;
    }
    try {
      setwaiting(true);

      const response = await axios.put(APILink() + "Product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      setImage(null);

      alert("Update Success");

      navigate(`/listgoods`);
    } catch (error) {
      message.error("Update Error: " + error);
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
        const response = await axios.get(APILink() + "Brand", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);

        setlistBrand(response.data.data);
      } catch (error) {
      } finally {
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
        <h1 className="mb-4">Update Product.</h1>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
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
          <Form.Item label="Image (Max 5 File)." name="UploadImage">
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
              Update
            </Button>
          </Form.Item>
          <Form.Item style={{ height: "auto", width: "35%" }} name="ProductId">
            <Input hidden />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
