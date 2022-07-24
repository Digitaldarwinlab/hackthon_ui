import React, { useState, useEffect } from "react";
// import AuthForm from "./Form";
import loginImage from "../../assets/loginImage.webp";
import MyPhysioLogo from "./../UtilityComponents/MyPhysioLogo";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "../../styles/userAuth/userAuth.css";
import { Row, Col, Input, Form, Button } from "antd";
import { signup } from "../../API/userAuth";
import Error from "../UtilityComponents/ErrorHandler.js";
import { useDispatch, useSelector } from "react-redux";
import { VALIDATION } from "../../contextStore/actions/authAction";
import { Link } from "react-router-dom";
// import ForgotPassword from "./ForgotPassword";
// import { Link } from "react-router-dom";
// const ClearCacheComponent = withClearCache(MainApp);
//const [visible, setVisible] = useState(false);
const Login = (props) => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const onFinish = async (values) => {
    let user = {
      uid: username,
      password: password
    }
    const result = await signup(user)

    if (result && result[0])
      window.location.href = "/patient/schedule";
    else {
      dispatch({ type: VALIDATION, payload: { error: result[1] } })
      console.log("failed", result)
    }
  };
  useEffect(() => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: true,
          // { width: 1280, height: 720 }
        },
        function (stream) {
          console.log(stream);
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
    let item = document.getElementsByClassName('ant-input-affix-wrapper')
    item[0].style.backgroundColor = "#f5f5f5"
    item[0].style.padding = "0px 11px"
  }, []);
  return (
    <>
      <Row className="cont-fluid">
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <LazyLoadImage width={1000} height={1000} src={loginImage} alt="login" className="vectorImage" />
        </Col>
        <Col
          xs={20}
          sm={24}
          md={12}
          lg={12}
          xl={10}
          className="authFormDiv LoginMain"
        >
          <MyPhysioLogo page="login" />
          {/* <ClearCacheComponent /> */}
          <h1 style={{margin:0}}>Welcome Back!</h1>
          <div className="employey">
            {" "}
            <Link to="/">Start Assesment</Link>
          </div>
          {/* <ForgotPassword /> */}

          {/* <AuthForm isSignin={true} /> */}
          <Col span={24}>
            {state.Validation.error && (<Error error={state.Validation.error} />)}
            <Form onFinish={onFinish} layout="vertical">
              <Form.Item label={<span style={{ fontSize: '15px' }}>Username</span>}
                name={"username"}
                rules={[{ required: true, message: `Please enter username` }]}>
                <Input onChange={(e) => {
                  dispatch({ type: "NOERROR" });
                  setUserName(e.target.value)
                }} name="Username" required placeholder="Enter Username" />
              </Form.Item>

              <Form.Item label={<span style={{ fontSize: '15px' }}>Password</span>}
                name={"Password"}
                rules={[{ required: true, message: `Please enter Password` }]}>
                <Input.Password onChange={(e) => {
                  dispatch({ type: "NOERROR" });
                  setPassword(e.target.value)
                }} name="Password" required placeholder="Enter Password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary" htmlType="submit" className="userAuthbtn">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14}></Col>
      </Row>
    </>
  );
};
// function MainApp(props) {
//   return (
//     <div>
//       <p>Build date: {getBuildDate(packageJson.buildDate)}</p>
//     </div>
//   );
// }

export default Login;
