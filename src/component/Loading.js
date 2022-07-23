import React from "react";
import "./Loading.css";

export default function Loading(props) {
  return (
    //     <div className="center">
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    //   <div className="wave"></div>
    // </div>
    <div className="loader">
      <span
        className={
          props.flag === true ? "span color-answer" : "span color-question"
        }
      ></span>
      <span
        className={
          props.flag === true ? "span color-answer" : "span color-question"
        }
      ></span>
      <span
        className={
          props.flag === true ? "span color-answer" : "span color-question"
        }
      ></span>
      <span
        className={
          props.flag === true ? "span color-answer" : "span color-question"
        }
      ></span>
      <span
        className={
          props.flag === true ? "span color-answer" : "span color-question"
        }
      ></span>
    </div>
  );
}
