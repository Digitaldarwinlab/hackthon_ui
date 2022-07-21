import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { ImPlus } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { AiTwotoneSetting } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "../../styles/Layout/Navbar.css";
import { Dropdown, Menu, Row, Col, Space } from "antd";
import MyPhysioLogo from "./MyPhysioLogo";
import { GoCalendar } from "react-icons/go";
import { MdAssessment } from "react-icons/md";
import { AiOutlineLogin } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaWindowClose } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import SideDrawer from "./SideDrawer";
import { FaLanguage } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { ConsoleSqlOutlined } from "@ant-design/icons";
const { SubMenu } = Menu;
const Navigationbar = (props) => {
  //	console.log(props)
  const [showMenu, setShowMenu] = useState(false);
  const [showToggleMenu, setShowToggleMenu] = useState(false);
  const dispatch = useDispatch()
  const history = useHistory()
  const [devices, setDevices] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user"))
  console.log("user logg", userInfo)
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

  const handleCameraClick = (id, label) => {
    // console.log("Label",label)
    let flag = 0;
    if (label.toLowerCase().includes("back")) {
      flag = 1;
    }
    console.log(flag);
    window.darwin.cameraIdFunc(id, flag)
  }

  const LogoutMenu = () => {
    return (
      <Menu className="dropDownMenu UserDropDown">
        {userInfo.role === "admin" && (
          <Menu.Item key="1" style={{ borderTop: "0px solid black" }}>
            <Link
              to="#Myprofile"
              className="text-secondary text-decoration-none"
            >
              My Profile
            </Link>
          </Menu.Item>
        )}
        {userInfo.role !== "admin" && userInfo.role !== "physio" && userInfo.role !== "HeadPhysio" && (
          <Menu.Item key="2" style={{ borderTop: "0px solid black" }}>
            <Link
              to="/patient/profile"
              className="text-secondary text-decoration-none"
            >
              My Profile
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="2" style={{}}>
          <Link to="/logout" className="text-secondary text-decoration-none">
            LogOut
          </Link>
        </Menu.Item>
      </Menu>
    );
  };
  const [visState, setVisState] = useState(false);
  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top navigationBar" >
        <Dropdown
          overlay={<SideDrawer visState={visState} setVisState={setVisState} />}
          className="navbar-toggler"
          type="button"
          id="navbar-toggler"
          trigger={["click"]}
        >
          <a
            className="ant-dropdown-link text-white border"
            onClick={(e) => {
              setShowToggleMenu(!showToggleMenu);
              e.preventDefault();
              setVisState(true);
            }}
          >
            <AiOutlineMenu
              style={{ fontSize: "20px" }}
              className="navbar-toggler-icon"
            />
          </a>
        </Dropdown>

        {/* <Dropdown
          overlay={
            <DropDownMenu
              classname="navbar-toggler"
              id="navbar-toggler"
              getCurrentPath={props.getCurrentPath}
            />
          }
          className="navbar-toggler"
          type="button"
          id="navbar-toggler"
          trigger={["click"]}
        >
          <a
            className="ant-dropdown-link text-white border"
            onClick={(e) => {
              setShowToggleMenu(!showToggleMenu);
              e.preventDefault();
            }}
          >
            <AiOutlineMenu
              style={{ fontSize: "20px" }}
              className="navbar-toggler-icon"
            />
          </a>
        </Dropdown> */}

        <Menu
          className={`d-md-inline  hamburgerMenu ham_one `}
          id="hamburgerMenu"
        >
          {/* aswin 10/27/2021 start */}
          {/* <Menu.Item
              key="1"
              //className="ant-menu-item-selected"
              //style={{ backgroundColor: "transparent", color: "white" }}
              onClick={() => {
                props.SideNavbarCollpased();
              }}
            > */}
          {/* aswin 10/27/2021 stop */}
          {/* {props.isSideNavbarCollpased ? (
                <GiHamburgerMenu
                  className="ham_one"
                  style={{ marginTop: "5px" }}
                  size={25}
                />
              ) : (
                <GiHamburgerMenu
                  className="ham_one"
                  style={{ marginTop: "5px" }}
                  size={25}
                />
              )} */}

          <Link

            to={(userInfo && userInfo.role === "enterprise_patient" && "/")}
            className="navbar-brand text-white text-decoration-none"
          >
            <MyPhysioLogo page="dashboard" />
          </Link>
          {/* </Menu.Item> */}
        </Menu>


        <div className="d-inline-flex p-2 text-white navigationMenu topScheduleIcon">
          <Space>
            {"  "}
            {(userInfo && userInfo.role === "enterprise_patient") && <Link to={(userInfo && userInfo.role === "enterprise_patient" && "/")}>
              <h4 className="text-white me-3 ">
                <MdAssessment /> Assesment
              </h4>
            </Link>}
            {(userInfo && userInfo.role === "enterprise_patient" && <Link to={(userInfo && userInfo.role === "enterprise_patient" && "/patient/schedule")}>
              <h4 className="text-white me-3 ">
                <GoCalendar /> Schedule
              </h4>
            </Link>)}
          </Space>
          {userInfo && userInfo.role === "enterprise_patient" ? <div>
            <Dropdown overlay={LogoutMenu()} type="button" trigger={["hover"]}>
              <a
                style={{ position: "relative", bottom: "0px" }}
                className="ant-dropdown-link text-white"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <CgProfile
                  style={{
                    margin: "0px 0px -6px 10px",
                    fontSize: "26px",
                  }}
                />{" "}
                Hello {userInfo.info.first_name.slice(0, 1).toUpperCase() + userInfo.info.first_name.slice(1, userInfo.info.first_name.length).toLowerCase()}
              </a>
            </Dropdown>
          </div> : <div onClick={() => history.push('/login')}>
            <h4 className="text-white ">
              <span style={{ marginRight: '5px' }}>Login </span><AiOutlineLogin style={{ position: 'absolute' }} size={35} />
            </h4>
          </div>}
        </div>
          {/* <Link

            to={(userInfo && userInfo.role === "enterprise_patient" && "/")}
            className="navbar-brand text-white text-decoration-non  navbar-togglere"
          >
            <MyPhysioLogo page="dashboard" />
          </Link> */}
      </nav>
    </>
  );
};
export default Navigationbar;
