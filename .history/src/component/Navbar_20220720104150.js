import React from "react";
import logoImg from "../assets/newlogo1.png";
import { BiArrowBack } from "react-icons/bi";

const Navbar = (props) => {
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
              <BiArrowBack
                onClick={() => {
                  if (
                    window.confirm("Do you want to leave your assesment?") ===
                    true
                  ) {
                    window.location.reload(false);
                  }
                }}
                style={{ width: "30px", height: "30px" }}
              />
            </div>
            <div style={{ float:''}}>
              <img
                width={50}
                height={50}
                src={logoImg}
                alt="logo"
                className="logoImg"
              />
              <span
                id="PhysioAi"
                style={{ position: "absolute", top: "15px", color: "white" }}
                className="itle"
              >
                PHYSIOAI
              </span>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{ width: "100vw", height: "50px", backgroundColor: "#2D7ECB" }}
        >
          <div style={{ position: "absolute", left: "0px" }}>
            <img
              width={50}
              height={50}
              src={logoImg}
              alt="logo"
              className="logoImg"
            />
            <span
              id="PhysioAi"
              style={{ position: "absolute", top: "15px", color: "white" }}
              className="itle"
            >
              PHYSIOAI
            </span>
          </div>
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
