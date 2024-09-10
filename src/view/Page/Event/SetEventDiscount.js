import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLayout } from "../../../Hooks/Layout/LayoutContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table } from "react-bootstrap";
import {
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  message,
  Button as AntdButton,
} from "antd";
import { useNavigate } from "react-router-dom";
import { APILink } from "../../../Api/Api";
import moment from "moment-timezone";

export default function SetEvent() {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
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
  console.log(pages);
  const [checkbox, setcheckbox] = useState([]);
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
      var checkAll = (document.getElementById("CheckAll").checked = false);
      setcheckbox([]);
    }
  };
  const NextPage = () => {
    if (currentPage !== pages) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 >= startPage + 5) {
        setstartPage(startPage + 1);
      }
      document.getElementById("CheckAll").checked = false;
    }
  };

  const firstpage = () => {
    document.getElementById("CheckAll").checked = false;

    setstartPage(1);
    setCurrentPage(1);
  };
  const lastpage = () => {
    document.getElementById("CheckAll").checked = false;

    setCurrentPage(pages);
    if (pages >= 5) {
      setstartPage(pages - 4);
    }
  };

  const changeCurrentPage = (id) => {
    document.getElementById("CheckAll").checked = false;
    setCurrentPage(id);
  };
  const [waiting, setwaiting] = useState(false);
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
        response.data.data.unshift({
          id: "",
          name: "All",
        });

        setlistBrand(response.data.data);
      } catch (error) {
      } finally {
      }
    };
    fetchdata();
  }, []);
  const [listdiscount, setlistdiscount] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(APILink() + "Discount", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);

        setlistdiscount(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Set Error: " + error);
        }
      } finally {
        setwaiting(false);
      }
    };
    fetchdata();
  }, []);
  // const [listStore, setlistStore] = useState([]);
  // useEffect(() => {
  //   const fetchdata = async () => {
  //     try {
  //       const response = await axios.get(APILink() + "Store", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       response.data.data.unshift({
  //         id: "",
  //         address: "All",
  //         district: "",
  //         city: "",
  //       });

  //       setlistStore(response.data.data);
  //     } catch (error) {
  //     } finally {
  //     }
  //   };
  //   fetchdata();
  // }, []);
  const [idChecked, setidChecked] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setwaiting(true);
        const response = await axios.get(
          APILink() + "Properties/" + sessionStorage.getItem("storeId"),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        form.setFieldsValue({
          Status: "",
          Name: "",
          BrandId: "",
          Event: "",

          // StoreId: parseInt(sessionStorage.getItem("storeId")),
        });
        if (listdiscount.length > 0) {
          form.setFieldsValue({
            DiscountId: listdiscount[0].id,
          });
        }
        // const response = await axios.get(
        //   "https://jsonplaceholder.typicode.com/comments"
        // );
        console.log(response.data.data);
        setresultvalue(response.data.data);
        setData(response.data.data);
      } catch (error) {
        if (error.response.data === "Invalid email") {
          navigate(`/error`);
        } else {
          message.error("Set Error: " + error);
        }
      } finally {
        setwaiting(false);
      }
    };
    fetchData();
  }, [Loading, listdiscount]);

  // const ChangeStatus = async (index) => {
  //   try {
  //     setwaiting(true);
  //     console.log(index);
  //     const response = await axios.get(
  //       APILink() + "Properties/ChangeStatus/" + index,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setLoading(!Loading);
  //   } catch (error) {
  //     message.error("Error: ", error.response.data.message);
  //   } finally {
  //     setwaiting(false);
  //   }
  // };
  const handleSearch = async () => {
    const formvalue = form.getFieldsValue();
    console.log(formvalue.StoreId);
    // var date = moment();
    // date = new Date(date).toISOString();
    // console.log(date);
    // console.log(formvalue.Expiried_date[0] > date);
    var result = data.filter((e) => {
      const searchTerm = formvalue.Name.toLowerCase();
      return (
        e.name.toLowerCase().includes(searchTerm) ||
        e.brandName.toLowerCase().includes(searchTerm) ||
        e.productName.toLowerCase().includes(searchTerm)
        //  ||
        // e.category.name.toLowerCase().includes(searchTerm) ||
        // (e.subcategory &&
        //   e.subcategory.name.toLowerCase().includes(searchTerm)) ||
        // (e.segment && e.segment.name.toLowerCase().includes(searchTerm))
      );
    });
    if (formvalue.BrandId !== "") {
      result = result.filter((e) => e.brandId === formvalue.BrandId);
    }
    // if (formvalue.DiscountId !== "") {
    //   result = result.filter((e) => e.discountId !== formvalue.DiscountId);
    // }
    if (formvalue.Status !== "") {
      result = result.filter((e) => e.status === formvalue.Status);
    }
    if (formvalue.Event !== "" && formvalue.Event === true) {
      result = result.filter((e) => e.discountId !== null);
    }
    if (formvalue.Event !== "" && formvalue.Event === false) {
      result = result.filter((e) => e.discountId === null);
    }
    // if (formvalue.StoreId !== "") {
    //   result = result.filter((e) => e.storeId === formvalue.StoreId);
    // }
    console.log(result);

    setresultvalue(result);
    setCurrentPage(1);
    setstartPage(1);
  };
  const handleRemoveDiscount = async (value) => {
    console.log(value);
    try {
      setwaiting(true);
      const response = await axios.get(
        APILink() + "Event/RemoveDiscount/" + value,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      resultvalue.forEach((e) => {
        if (e.id === value) {
          e.discountId = null;
        }
      });
    } catch (error) {
      if (error.response.data === "Invalid email") {
        navigate(`/error`);
      } else {
        message.error("Set Error: " + error);
      }
    } finally {
      setwaiting(false);
    }
  };

  const handleSetEvent = async () => {
    var count = 0;
    const formvalue = form.getFieldsValue();

    const formData = new FormData();

    checkbox.forEach((element) => {
      formData.append("PropertiesId", element);
      setcheckbox([]);
      count++;
    });
    if (count === 0) {
      message.warning("Please choose at least one !");
      return;
    }

    formData.append("DiscountId", formvalue.DiscountId);
    try {
      setwaiting(true);
      const response = await axios.post(
        APILink() + "Event/SetDiscount",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
        message.success("Set Event Success!");
      }
      document.querySelector(".CheckAll").checked = false;
      setLoading(!Loading);
    } catch (error) {
      if (error.response.data === "Invalid email") {
        navigate(`/error`);
      } else {
        message.error("Set Error: " + error);
      }
    } finally {
      setwaiting(false);
    }
  };
  const checkAll = () => {
    // const formvalue = form.getFieldsValue();
    // var CheckBox = document.querySelectorAll(".CheckId");
    // var result = data.filter((e) => e.discountId === null);
    // console.log(result);

    // CheckBox.forEach((element) => {
    //   result.forEach((resultElement) => {
    //     console.log(typeof resultElement.id);
    //     console.log(typeof element.value);
    //     if (parseInt(element.value) === resultElement.id) {
    //       element.checked = true;
    //     }
    //   });
    // });
    var CheckBox = document.getElementById("CheckAll");
    if (CheckBox.checked === true) {
      records.forEach((item) => {
        if (item.discountId === null) {
          setcheckbox((prev) => [...prev, item.id]);
        }
      });
    } else {
      setcheckbox([]);
    }
  };
  useEffect(() => {
    console.log(checkbox);
  }, [checkbox]);
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
        <h2>Discount Event.</h2>
        <div>
          <Form layout="vertical" form={form}>
            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item
                label="Search."
                className="Search"
                name="Name"
                style={{ width: "30%" }}
              >
                <Input
                  placeholder="Enter here"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item label="Status." name="Status">
                <Radio.Group onChange={handleSearch}>
                  <Radio value="">All</Radio>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Disable</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Event" name="Event">
                <Radio.Group onChange={handleSearch}>
                  <Radio value="">All</Radio>
                  <Radio value={true}>Have</Radio>
                  <Radio value={false}>None</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div
              style={{
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Form.Item style={{ width: "35%" }} label="Brand." name="BrandId">
                <Select onChange={handleSearch}>
                  {listBrand?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                style={{ width: "35%" }}
                label="Discount."
                name="DiscountId"
              >
                <Select onChange={handleSearch}>
                  {listdiscount?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label=" ">
                <AntdButton type="primary" onClick={handleSetEvent}>
                  Set Event
                </AntdButton>
              </Form.Item>
              {/* <Form.Item style={{ width: "60%" }} label="Store." name="StoreId">
              <Select onChange={handleSearch}>
                {listStore?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.address + " " + item.district + " " + item.city}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            </div>
          </Form>
        </div>
        <Table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              {/* <th>Image</th> */}
              {/* <th>Store</th> */}
              <th>Cost</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Flash Sale</th>
              <th>Status</th>
              <th>Action</th>
              <th>
                <input
                  type="checkbox"
                  className="form-check-input CheckAll"
                  value="All"
                  id="CheckAll"
                  onClick={checkAll}
                ></input>{" "}
                <label>Set All</label>
              </th>
            </tr>
          </thead>

          <tbody>
            {records?.map((item, index) => (
              <tr
                key={index}
                style={{ height: "100%", backgroundColor: "yellow" }}
              >
                <td>{item.productName}</td>
                <td>{item.name}</td>

                {/* <td>
                <img
                  style={{ height: "80px", width: "100px" }}
                  src={item.image}
                  alt="img"
                />
              </td> */}

                {/* <td>
                {item.store.address +
                  ", " +
                  item.store.district +
                  ", " +
                  item.store.city}
              </td> */}

                <td>{item.costPrice}</td>
                <td>{item.price}</td>
                <td>{item.discountId ? item.discountName : "None"}</td>
                <td>{item.flashSaleId ? item.flashSaleName : "None"}</td>
                <td>
                  {item.status !== undefined
                    ? item.status === true
                      ? "Active"
                      : "Disable"
                    : item.Status
                    ? "Active"
                    : "Disable"}
                </td>
                <td>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                      height: "100%",
                      gridTemplateRows: "1fr",
                      width: "70%",
                    }}
                  >
                    <Button
                      className="btn btn-danger"
                      disabled={item.discountId ? false : true}
                      onClick={() => handleRemoveDiscount(item.id)}
                    >
                      Remove Event
                    </Button>
                  </div>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input CheckId"
                    value={item.id}
                    key={item.id}
                    checked={checkbox.includes(item.id) ? true : false}
                    disabled={item.discountId ? true : false}
                    onClick={() => {
                      document.querySelector(".CheckAll").checked = false;
                      setcheckbox((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                  ></input>
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
