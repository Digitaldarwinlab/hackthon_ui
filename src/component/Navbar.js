import React from "react";
import logoImg from "../assets/newlogo1.png";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { CgProfile } from "react-icons/cg";

const Navbar = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("user"))
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
  return (
    <>
      {props.assesment ? (
        <>
          <div
            style={{
              width: "100%",
              height: "50px",
              backgroundColor: "#2D7ECB",
              position: "relative",
              top: "0px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "5px",
                top: "10px",
                cursor: "pointer",
              }}
            >
              {/* <BiArrowBack
                onClick={() => {
                  if (
                    window.confirm("Do you want to leave your assesment?") ===
                    true
                  ) {
                    window.location.reload(false);
                  }
                }}
                style={{ width: "30px", height: "30px" }}
              /> */}
              <div style={{ position: "absolute", left: "0px" }}>
                <img
                  width={50}
                  height={50}
                  src={logoImg}
                  alt="logo"
                  style={{ width: "50px", height: "36px" }}
                //  className="logoImg"
                />
                <span
                  id="PhysioAi"
                  style={{ width: "50px", height: "30px", position: 'absolute', fontSize: '20px', color: 'white' }}
                //className="itle"
                >
                  PHYSIOAI
                </span>
              </div>
            </div>

            {/* <div style={{ position: "absolute", right: "100px" }}>
              <Link style={{ color: "white" }} to="/patient/schedule">Schedule</Link>  {"   "}
              <Link style={{ color: "white" }} to="/">Assesment</Link>
            </div> */}
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
                    margin: "auto 10px 0px",
                    fontSize: "26px",
                    marginTop: "0px",
                  }}
                />{" "}
                Hello {userInfo.info.first_name.slice(0, 1).toUpperCase() + userInfo.info.first_name.slice(1, userInfo.info.first_name.length).toLowerCase()}
              </a>
            </Dropdown>
          </div>
        </>
      ) : (
        <div
          style={{ width: "100vw", height: "50px", backgroundColor: "#2D7ECB" }}
        >


        </div>
      )}
      <div
        style={{
          height: "15px",
          width: "100%",
          borderTop: "2px solid white",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          className="1"
          style={{
            height: "15px",
            width: `${props.Demographic}`,
            backgroundColor: "rgba(37, 119, 234, 0.5)",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        ></div>
        <div
          className="2"
          style={{
            height: "15px",
            width: `${props.part_1}`,
            backgroundColor: "rgba(37, 119, 234, 0.5)",
          }}
        ></div>
        <div
          className="3"
          style={{
            height: "15px",
            width: `${props.part_2}`,
            backgroundColor: "rgba(37, 119, 234, 0.5)",
          }}
        ></div>
        <div
          className="4"
          style={{
            height: "15px",
            width: `${props.part_3}`,
            backgroundColor: "rgba(37, 119, 234, 0.5)",
          }}
        ></div>
      </div>
    </>
  );
};

export default Navbar;
