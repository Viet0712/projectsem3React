import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, Button as AntButton, message } from "antd";
import { APILink } from "../../../Api/Api";
import "../../../styles/recordAnimation.scss";
export default function ListProduct() {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [resultvalue, setresultvalue] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setstartPage] = useState(1);
  const [move, setmove] = useState("Next");
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = resultvalue.slice(firstIndex, lastIndex);
  const pages = Math.ceil(resultvalue.length / recordsPerPage);

  var numbers = Array.from(
    { length: Math.min(5, pages) },
    (_, i) => startPage + i
  );

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 1 < startPage) {
        setstartPage(startPage - 1);
      }
    }
  };
  const NextPage = () => {
    if (currentPage !== pages) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 >= startPage + 5) {
        setstartPage(startPage + 1);
      }
    }
  };

  const firstpage = () => {
    setstartPage(1);
    setCurrentPage(1);
  };
  const lastpage = () => {
    setCurrentPage(pages);
    if (pages >= 5) {
      setstartPage(pages - 4);
    }
  };

  const changeCurrentPage = (id) => {
    setCurrentPage(id);
  };
  const [waiting, setwaiting] = useState(false);
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
        const dataresponse = response.data.data;
        dataresponse.forEach((element) => {
          var dataImage = element.image;
          if (dataImage.startsWith(", ")) dataImage = dataImage.substring(2);
          let partsImage = dataImage.split(", ");
          element.image = partsImage;
        });
        form.setFieldsValue({
          Status: "",
          Name: "",
          SegmentId: "",
          SubcategoryId: "",
          CategoryId: "",
          BrandId: "",
        });
        console.log(dataresponse);
        setresultvalue(dataresponse);
        setData(dataresponse);
      } catch (error) {
        message.error("Error: ", error);
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, [Loading]);
  const ChangeStatus = async (index) => {
    try {
      setwaiting(true);
      console.log(index);
      const response = await axios.get(
        APILink() + "Product/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resultvalue.forEach((e) => {
        if (e.productId === index) {
          e.status = !e.status;
        }
      });
      // setLoading(!Loading);
      message.success("Change Status Success!");
    } catch (error) {
      message.error("Error: ", error);
    } finally {
      setwaiting(false);
    }
  };
  const [listBrand, setlistBrand] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Brand/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        response.data.data.unshift({ id: "", name: "All" });

        setlistBrand(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [subcategoryMatch, setsubcategoryMatch] = useState([]);
  const [segmentMatch, setsegmentMatch] = useState([]);
  const [listCategory, setlistCategory] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Category/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);
        response.data.data.unshift({ id: "", name: "All" });
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
        const response = await axios.get(APILink() + "Subcategory/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);
        response.data.data.unshift({ id: "", name: "All" });
        setsubcategoryMatch(response.data.data);
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
        const response = await axios.get(APILink() + "Segment/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data.data);
        response.data.data.unshift({ id: "", name: "All" });
        setsegmentMatch(response.data.data);
        setlistSegment(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);

  const handleChangeCategory = (value, option) => {
    console.log(value);
    const codeCategory = option.key;
    var Match = [];
    listSubcategory.forEach((element) => {
      if (element.categoryId === value) {
        Match.push(element);
      }
    });
    Match.unshift({ id: "", name: "All" });
    form.setFieldsValue({
      SubcategoryId: "",
      SegmentId: "",
    });
    handleSearch();
    if (value === "") {
      setsubcategoryMatch(listSubcategory);
    } else {
      setsubcategoryMatch(Match);
    }
  };
  const handleSubcategory = (value, option) => {
    const codeSubcategory = option.key;
    var Match = [];
    listSegment.forEach((element) => {
      if (element.subCategoryId === value) {
        Match.push(element);
      }
    });
    Match.unshift({ id: "", name: "All" });
    form.setFieldsValue({
      SegmentId: "",
    });
    handleSearch();
    if (value === "") {
      setsegmentMatch(listSegment);
    } else {
      setsegmentMatch(Match);
    }
  };
  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();

    var result = data.filter((e) => {
      const searchTerm = formvalue.Name.toLowerCase();
      return (
        e.name.toLowerCase().includes(searchTerm) ||
        e.brandName?.toLowerCase().includes(searchTerm)
        //  ||
        // e.category.name.toLowerCase().includes(searchTerm) ||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.CategoryId !== "") {
      result = result.filter((e) => e.categoryID === formvalue.CategoryId);
    }

    if (formvalue.SubcategoryId !== "") {
      result = result.filter(
        (e) => e.subcategoryId && e.subcategoryId === formvalue.SubcategoryId
      );
    }

    if (formvalue.SegmentId !== "") {
      result = result.filter(
        (e) => e.segmentId && e.segmentId === formvalue.SegmentId
      );
    }
    if (formvalue.BrandId !== "") {
      result = result.filter((e) => e.brandId === formvalue.BrandId);
    }
    console.log(result);
    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);

    // const response = await axios.get(
    //   APILink() + "Product/Search/" + searchvalue,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // setData(response.data.data);
  };
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    // recognition.lang = "vi-VN"; // Ngôn ngữ Tiếng Việt

    recognition.onstart = () => {
      console.log(
        "Voice recognition started. Try speaking into the microphone."
      );
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("Voice recognition stopped.");
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onresult = (event) => {
      // let interimTranscript = "";
      // console.log(event);
      // for (let i = event.resultIndex; i < event.results.length; i++) {
      //   const transcriptResult = event.results[i][0].transcript;
      //   if (event.results[i].isFinal) {
      //     setTranscript((prev) => prev + " " + transcriptResult);
      //   } else {
      //     interimTranscript += transcriptResult;
      //   }
      // }
      // if (interimTranscript !== "") {
      //   if (interimTranscript.includes("bò")) {
      //     interimTranscript = "beef";
      //   }
      //   setTranscript(interimTranscript);
      // }
      // console.log(interimTranscript);
      console.log(event.results[0][0].transcript);
      setTranscript(event.results[0][0].transcript);
      form.setFieldsValue({
        Name: event.results[0][0].transcript.trim(),
      });
      var result = document.getElementById("result");
      if (result !== undefined) {
        result.innerHTML = event.results[0][0].transcript;
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);
  const Voice = () => {
    setIsListening(true);
    if (transcript !== "") {
      console.log(transcript);
      // form.setFieldsValue({
      //   Name: transcript.trim(),
      // });
      setTranscript("");
    }
  };
  const closed = () => {
    setIsListening(false);
    handleSearch();
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
      {isListening && (
        <div id="body">
          <div onClick={closed} id="closed">
            <i
              style={{ fontSize: "3rem" }}
              class="fa-solid fa-rectangle-xmark"
            ></i>
          </div>
          <div id="label">Say Some Things!</div>
          <div id="bars">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <div id="result"></div>
        </div>
      )}
      <div>
        <h2>Product.</h2>
        <div>
          <Form layout="vertical" form={form} onFinish={handleSearch}>
            <div
              style={{
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                label="Search."
                className="Search"
                name="Name"
                style={{ width: "50%" }}
              >
                <Input
                  placeholder="Enter here"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Button onClick={Voice}>
                  <i class="fa-solid fa-microphone"></i>
                </Button>
              </Form.Item>
              <Form.Item label="Status" name="Status">
                <Radio.Group onChange={handleSearch}>
                  <Radio value="">All</Radio>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Disable</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div
              style={{
                width: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                label="Category."
                name="CategoryId"
                style={{ width: "25%" }}
              >
                <Select onChange={handleChangeCategory}>
                  {listCategory?.map((item) => (
                    <Option key={item.codeCategory} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: "25%" }}
                label="Subcategory."
                name="SubcategoryId"
              >
                <Select onChange={handleSubcategory}>
                  {subcategoryMatch?.map((item) => (
                    <Option key={item.codeSubcategory} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: "25%" }}
                label="Segment."
                name="SegmentId"
              >
                <Select onChange={handleSearch}>
                  {segmentMatch?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item style={{ width: "15%" }} label="Brand." name="BrandId">
                <Select onChange={handleSearch}>
                  {listBrand?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              {/* <th>Code</th> */}
              <th>Name</th>
              <th>Brand</th>
              <th>Image</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Segment</th>
              {/* <th>Status</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((item, index) => (
              <tr
                key={index}
                style={{ height: "100%", backgroundColor: "yellow" }}
              >
                {/* <td>{item.productId}</td> */}
                <td>{item.name}</td>
                <td>{item.brandName}</td>
                <td>
                  <img
                    style={{ height: "80px", width: "100px" }}
                    src={item.image[0]}
                    alt="img"
                  />
                </td>
                <td>{item.categoryName}</td>
                <td>{item.subcategoryName ? item.subcategoryName : "None"}</td>
                <td>{item.segmentName ? item.segmentName : "None"}</td>
                {/* <td>
                {item.status !== undefined
                  ? item.status === true
                    ? "Active"
                    : "Disable"
                  : item.Status
                  ? "Active"
                  : "Disable"}
              </td> */}
                <td>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      height: "100%",
                      gridTemplateRows: "1fr",
                      width: "70%",
                    }}
                  >
                    <Button
                      className={`btn ${
                        item.status === true ? "btn-success" : "btn-danger"
                      } `}
                      onClick={() => ChangeStatus(item.productId)}
                    >
                      {item.status === true ? "Active" : "Disable"}
                    </Button>

                    <Button>
                      <Link
                        style={{ color: "white", textDecoration: "none" }}
                        to={`/updateproductsadmin?productId=${item.productId}`}
                      >
                        Update
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <Link href="#" className="page-link" onClick={firstpage}>
                First Page.
              </Link>
            </li>
            <li className="page-item">
              <Link href="#" className="page-link" onClick={prePage}>
                Prev
              </Link>
            </li>
            {numbers.map((n, i) => (
              <li
                className={`page-item ${currentPage === n ? "active" : ""}`}
                key={i}
              >
                <Link
                  href="#"
                  className="page-link"
                  onClick={() => changeCurrentPage(n)}
                >
                  {n}
                </Link>
              </li>
            ))}
            <li className="page-item">
              <Link href="#" className="page-link" onClick={NextPage}>
                Next
              </Link>
            </li>
            <li className="page-item">
              <Link href="#" className="page-link" onClick={lastpage}>
                Last Page.
              </Link>
            </li>
            <li className="page-item">
              <p className="page-link">{currentPage + "/" + pages}</p>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
