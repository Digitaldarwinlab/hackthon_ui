import React from "react";
import { Button, Col, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import { Link, Redirect, useHistory } from "react-router-dom";
import Login from "./Login";
const Index = () => {
  const history = useHistory()
  return (
    <Row>
          {/* <Header
        style={{
          background: "#2d7ecb",
          padding: 0,
          position: "fixed",
          zIndex: 1,
          width: "100%",
        }}
      >
        <div className="logo" />
        <Menu
          theme="light"
          mode="horizontal"
          style={{ background: "#2d7ecb", padding: 0 }}
          defaultSelectedKeys={["2"]}
          items={["Start Assessment", "Start Assessment"]}
        />
      </Header> */}
      <Col xs={24} md={12} lg={15}>
        <img
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          src="/logo.jpg"
        />
      </Col>
      <Col style={{ background: "#2d7ecb" }} xs={24} md={12} lg={9}>
        <Row>
          <Col style={{ paddingTop: "15%", paddingRight: "5%" }} span={24}>
            <center>
              <img style={{ width: "50%" }} src="/logo1.png" />
              <div id="PhysioAi" className="" style={{ fontSize: "36px" }}>
                PHYSIOAI
              </div>
            </center>
            <center>
              {/* <Button */}
              <p style={{ color: "white",cursor:'pointer' }} onClick={()=>history.push('/register')}>
                Start Self Assessment
              </p>
            </center>
            <br />
            <Login />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Index;
