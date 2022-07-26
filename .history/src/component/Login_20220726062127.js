import { Button, Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { isAuthenticated } from "../API/userAuth";
 import Navigationbar  fro ("../component/UtilityComponents/Navbar");
import { signup } from "../API/userAuth";

const Login = () => {
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
      console.log("failed",result)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (<>
  {isAuthenticated() && <Navigationbar />}
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
      >
        <Input onChange={(e) => setUserName(e.target.value)} />
      </Form.Item>
      <br />
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <br />
      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </>
  );
};

export default Login;
