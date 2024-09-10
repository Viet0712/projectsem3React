import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import { Form, Input, Radio, Select, message } from "antd";
import { APILink } from "../../../Api/Api";

export default function ListSubcategory() {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [formdefaulvalue, setFormdefaulvalue] = useState({
    Name: "",
    Status: "",
    CategoryId: "",
  });

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

  const recordsPerPage = 10;
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
  // useEffect(() => {
  //   if (data.length > 0) {
  //     handleSearch();
  //   }
  // }, [data]);
  const [waiting, setwaiting] = useState(false);
  const [listCategory, setlistCategory] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(APILink() + "Category/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        response.data.data.unshift({ id: "", name: "All" });
        setlistCategory(response.data.data);
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
        const response = await axios.get(APILink() + "Subcategory/SAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        form.setFieldsValue({
          Name: "",
          Status: "",
          CategoryId: "",
        });
        console.log(response.data.data);
        setresultvalue(response.data.data);
        setData(response.data.data);
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
        APILink() + "Subcategory/ChangeStatus/" + index,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resultvalue.forEach((e) => {
        if (e.id === index) {
          e.status = !e.status;
        }
      });
      message.success("Change Status Success!");
    } catch (error) {
      message.error("Error: ", error);
    } finally {
      setwaiting(false);
    }
  };

  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue);

    var result = data.filter((e) => {
      const searchTerm = formvalue.Name.toLowerCase();
      return e.name.toLowerCase().includes(searchTerm);
    });
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.CategoryId !== "") {
      result = result.filter((e) => e.categoryId === formvalue.CategoryId);
    }
    console.log(result);
    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
  };

  // const checkCookieExpiration = useMemo(() => {
  //   if (myCookieTokenValue === undefined) {
  //     sessionStorage.clear();
  //     navigate("/");
  //   }
  // }, [myCookieTokenValue, navigate]);
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
      <div>
        <h2>Subcategory.</h2>
        <div className="option" style={{ width: "100%" }}>
          <Form
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            form={form}
            className="form-option"
            onFinish={handleSearch}
          >
            <Form.Item className="Search" name="Name">
              <Input
                placeholder="Enter Name here"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item name="Status">
              <Radio.Group onChange={handleSearch}>
                <Radio value="">All</Radio>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>Disable</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Category" name="CategoryId">
              <Select style={{ width: 300 }} onChange={handleSearch}>
                {listCategory?.map((item) => (
                  <Option key={item.codeCategory} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Subcategory Name</th>
              <th>Subcategory Code</th>
              <th>Category Name</th>
              <th>Category Code</th>
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
                <td>{item.name}</td>
                <td>{item.codeSubcategory}</td>
                <td>{item.category.name}</td>
                <td>{item.category.codeCategory}</td>
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
                      onClick={() => ChangeStatus(item.id)}
                    >
                      {item.status === true ? "Active" : "Disable"}
                    </Button>

                    <Button>
                      <Link
                        style={{ color: "white", textDecoration: "none" }}
                        to={`/updatesubcategory?subcategoryId=${item.id}`}
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
