import React, { useState, useCallback, useEffect } from "react";
import { FaColumns, FaUserMd } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { GoCalendar } from "react-icons/go";
//import { MdOutlineAccountCircle } from "react-icons/md";
import ReactDOM from "react-dom";
import { IoMdVideocam, IoMdPerson } from "react-icons/io";
import { FaCalendarPlus, FaPills, FaMicroscope } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import { HiUserAdd } from "react-icons/hi";
import { AiFillCalendar, AiOutlineLogout, AiFillMedicineBox, AiTwotoneSetting } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiData } from "react-icons/bi";
import "antd/dist/antd.css";
import "./SideDrawer.css";
import { FaLanguage } from "react-icons/fa";
import { Drawer, Button, Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import SideNavBar from "./SideNavBar";
import { useHistory } from "react-router-dom";
import { MdAssessment } from "react-icons/md";
const { SubMenu } = Menu;
const SideDrawer = ({ visState, setVisState }) => {
  const [devices, setDevices] = useState([]);
  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );
  useEffect(() => {
    const fetch = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("available devices ", devices);
      handleDevices(devices);
    };

    fetch();
  }, [handleDevices]);
  const userInfo = JSON.parse(localStorage.getItem("user"))
  const history = useHistory();
  // const [visible, setVisible] = useState(visState);

  // const showDrawer = () => {
  //   setVisible(true);
  // };

  const onClose = () => {
    setVisState(false);
  };

  const handleCameraClick = (id, label) => {
    console.log("Label", label)
    let flag = 0;
    if (label.toLowerCase().includes("back")) {
      flag = 1;
    }
    console.log(flag);
    window.darwin.cameraIdFunc(id, flag)
  }

  return (
    <>
      {/* <Button type="primary" onClick={showDrawer}>
        Open
      </Button> */}
      <Drawer
        className="side-drawer"
        style={{ margin: 0 }}
        closable={false}
        width={"70%"}
        title={`Physio AI`}
        placement="left"
        onClose={onClose}
        visible={visState}
        closeIcon={<MailOutlined />}
      >
        <Menu className="side-drawer">
          {(userInfo && userInfo.role === "enterprise_patient") && <Menu.Item
            icon={<GoCalendar className="iconClass2" />}
            onClick={() => {
              history.push("/patient/schedule");
              setVisState(false);
            }}
            key="987"
          >
            Schedule
          </Menu.Item>}
          {(userInfo && userInfo.role === "enterprise_patient") && <Menu.Item
            icon={<CgProfile
              className="iconClass2"
            />}
            onClick={() => {
              history.push("/patient/profile");
              setVisState(false);
            }}
            key="91"
          >
            Profile
          </Menu.Item>}
          {(userInfo && userInfo.role === "enterprise_patient") && <Menu.Item
            icon={<BiData
              className="iconClass2"
            />}
            onClick={() => {
              history.push("/patient/careplandata");
              setVisState(false);
            }}
            key="95"
          >
            Exercise Data
          </Menu.Item>}
          <Menu.Item
            icon={<MdAssessment className="iconClass2" />}
            onClick={() => {
              history.push("/");
              setVisState(false);
            }}
            key="101"
          >
            Assesment
          </Menu.Item>
          {(userInfo && userInfo.role) ? <Menu.Item
            icon={<AiOutlineLogout className="iconClass2" />}
            onClick={() => {
              history.push("/logout");
              setVisState(false);
            }}
            key="111"
          >
            Logout
          </Menu.Item> : <Menu.Item
            icon={<AiOutlineLogout className="iconClass2" />}
            onClick={() => {
              history.push("/login");
              setVisState(false);
            }}
            key="111"
          >
            Login
          </Menu.Item>}
        </Menu>
      </Drawer>
    </>
  );
};

//ReactDOM.render(<App />, document.getElementById("container"));

export default SideDrawer;
