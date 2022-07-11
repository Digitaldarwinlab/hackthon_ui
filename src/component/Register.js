import { Button, Col, Form, Input, message, Row, Steps } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
const Register = () => {
  const [reg, showReg] = useState(true);
  const history = useHistory()
  return (
    <>
      {reg ? (
        <Row
          style={{ padding: "0px", paddingTop: "60px" }}
          justify="space-around"
          align="middle"
        >
          <Col md={15} xs={24} sm={24}>
            <Row justify="center">
              <h2>Registration</h2>
            </Row>
            <Row style={{ margin: "20px" }} justify="center">
              <Col span={20}>
                <Form>
                  <Input style={{ margin: "5px" }} placeholder="Enter Name" />
                  <Input
                    style={{ margin: "5px" }}
                    placeholder="Enter Phone Number"
                  />
                  <Input style={{ margin: "5px" }} placeholder="Enter Email" />
                  <Button
                    style={{ margin: "5px" }}
                    type="primary"
                    onClick={() => {
                      showReg(false);
                      message.success({
                        duration: 2,
                        content: "An OTP has been send to your mail",
                      });
                    }}
                  >
                    Register
                  </Button>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row
          style={{ padding: "0px", paddingTop: "60px" }}
          justify="space-around"
          align="middle"
        >
          <Col md={15} xs={24} sm={24}>
            <Row justify="center">
              <h2>Enter OTP</h2>
            </Row>
            <p>Please enter the otp to confirm your registration</p>
            <Row style={{ margin: "20px" }} justify="center">
              <Col span={20}>
                <Form>
                  <Input style={{ margin: "5px" }} placeholder="Enter OTP" />
                  <Button type="primary" onClick={()=>history.push('/chat')}>
                    Confirm
                  </Button>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Register;
