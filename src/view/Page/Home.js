import React, { useEffect, useState } from "react";
import { useLayout } from "../../Hooks/Layout/LayoutContext";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button as ButtonBoostrap, Table } from "react-bootstrap";
import axios from "axios";
import { useCookies } from "react-cookie";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import {
  Form,
  Input,
  Button,
  Flex,
  Divider,
  Collapse,
  message,
  Alert,
} from "antd";
import { APILink } from "../../Api/Api";
import "../../../src/styles/Main.scss";
import "../../../src/styles/Chart.css";
import { useQuery } from "@tanstack/react-query";
import image from "../../asset/images/company/pexels-maoriginalphotography-1485894.jpg";
export default function Home() {
  const [cookies, setCookies] = useCookies();
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const handleSetCookie = () => {
    var exp = new Date();
    exp.setHours(exp.getHours() + 15);
    setCookies("token", "true", { expires: exp });
  };
  const { setLayout } = useLayout();
  useEffect(() => {
    console.log(sessionStorage.getItem("role"));
    if (sessionStorage.getItem("role") === "SAdmin") {
      setLayout("SAdmin");
    } else if (sessionStorage.getItem("role") === "Admin") {
      setLayout("Admin");
    } else {
      setLayout("auth");
    }
  }, []);

  const navigate = useNavigate();

  const Login = async (value) => {
    try {
      setwaiting(true);
      const formData = new FormData();
      formData.append("Email", value.email);
      formData.append("Password", value.password);

      const response = await axios.post(
        APILink() + "Auth/CheckLogin",
        formData
      );
      console.log(response.data);

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("storeAddress", response.data.storeAddress);
      sessionStorage.setItem("storeId", response.data.storeId);
      sessionStorage.setItem("image", response.data.image);
      sessionStorage.setItem("adminId", response.data.adminId);
      document.title = response.data.role;
      handleSetCookie();

      navigate("/");
    } catch (error) {
      console.log(error);
      message.error("Login Error: " + error.response.data);
    } finally {
      setwaiting(false);
    }
  };
  // const { isloading, error, data:quhss } = useQuery({
  //   queryKey: ['pro'],
  //   queryFn: ()=> Login;
  //  });
  const ForgotPassword = async () => {
    var formvalue = form.getFieldsValue();
    console.log(formvalue);
    if (
      formvalue.Email_verify === undefined ||
      formvalue.Email_verify === null ||
      formvalue.Email_verify === ""
    ) {
      message.error("Please Input Email!!");
    }
    try {
      setwaiting(true);
      const response = await axios.get(
        APILink() + "Admin/ForgotPassword/" + formvalue.Email_verify
      );

      message.success("Success: " + response.data.message);
    } catch (error) {
      message.error("Error: " + error.response.data.message);
    } finally {
      setwaiting(false);
    }
  };
  const [waiting, setwaiting] = useState(false);
  // const [Admins, setAdmins] = useState([]);
  // const [WebcamOn, setWebcamOn] = useState(false);
  // const Faceloginpage = async () => {
  //   await Promise.all([
  //     faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  //     faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  //     faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  //   ]);
  //   setWebcamOn(!WebcamOn);
  // };
  // const handleUserMedia = async () => {
  //   const response = await axios.get(APILink() + "Facelogin");
  //   console.log(response.data);
  //   var result = response.data.map(async (value, index) => {
  //     const descriptions = [];

  //     const img = await faceapi.fetchImage(
  //       require(`../../asset/images/Admins/${value.email}.png`)
  //     );
  //     const detections = await faceapi
  //       .detectSingleFace(img)
  //       .withFaceLandmarks()
  //       .withFaceDescriptor();

  //     console.log(detections);
  //     if (detections !== undefined) {
  //       descriptions.push(detections.descriptor);
  //       return new faceapi.LabeledFaceDescriptors(value.email, descriptions);
  //     }
  //   });
  //   console.log(result);
  //   const video = document.querySelector("#video");
  //   // const faceMatcher = new faceapi.FaceMatcher(result);
  //   const canvas = faceapi.createCanvasFromMedia(video);
  //   document.body.append(canvas);

  //   const displaySize = {
  //     width: video.width,
  //     height: video.height,
  //   };
  //   faceapi.matchDimensions(canvas, displaySize);
  //   setAdmins(response.data);
  // };
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
      <div
        style={{
          paddingTop: "5rem",
          height: "100vh",
          width: "100%",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="container"
          style={{
            marginLeft: "30%",
            height: "auto",
            width: "60%",
            // border: "1px solid black",
            // borderRadius: "5px",

            padding: "1rem",
          }}
        >
          <h2
            style={{
              color: "White",
              paddingBottom: "1rem",
              textShadow: "1px 1px 2px black, 0 0 1px black",
            }}
          >
            Log-In.
          </h2>

          <Form form={form} layout="vertical" className="form" onFinish={Login}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input placeholder="Enter Email." />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password placeholder="Enter Password." />
            </Form.Item>
            <Form.Item>
              <Flex gap="small" wrap>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
                {/* <Button type="primary" htmlType="reset" onClick={Faceloginpage}>
                  Face Login
                </Button> */}
                <Button type="primary" danger htmlType="reset">
                  Reset
                </Button>

                <ButtonBoostrap
                  className="btn btn-warning"
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                >
                  Forgot PassWord?
                </ButtonBoostrap>
              </Flex>
            </Form.Item>
            {isVisible && (
              <div style={{ paddingTop: "1rem" }}>
                {" "}
                <h4
                  style={{
                    color: "white",
                    textShadow: "1px 1px 2px black, 0 0 1px black",
                  }}
                >
                  Input Your Email
                </h4>
                <Form.Item name="Email_verify">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button onClick={ForgotPassword} type="primary">
                    Confirm
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form>
          {/* {WebcamOn && (
            <Webcam
              // style={{
              //   zIndex: "10000",
              //   width: "600px",
              //   height: "450px",
              //   position: "fixed",
              // }}
              id="video"
              // autoplay
              onUserMedia={handleUserMedia}
            ></Webcam>
          )} */}
        </div>
      </div>
    </>
  );
}
