import React, { useState } from "react";
import roboDoc from "../assets/robotdoc.jpg";
import Loading from "./Loading";
let qst = [ {
  id: Math.floor(Math.random() * 1000),
  question: `I would like to ask you a couple of questions to get to know you better.`,
  options: ["Done"],
  value: "",
  isInput: true,
},
{
  id: 'name',
  question: `Excited to meet you`,
  options: ["Done"],
  value: "",
  isInput: true,
},
{
  id: Math.floor(Math.random() * 1000),
  question: "How long have you been suffering from back pain / injury?",
  options: [
    "Back-More than a Week",
    "More than a Month",
    "More than 3 Months",
    "Not Sure",
  ],
  value: "",
  isInput: false,
},
{
  id: Math.floor(Math.random() * 1000),
  question: "How long have you been suffering from Neck pain / injury?",
  options: [
    "Neck-More than a Week",
    "More than a Month",
    "More than 3 Months",
    "Not Sure",
  ],
  value: "",
  isInput: false,
},
{
  id: Math.floor(Math.random() * 1000),
  question: "How long have you been suffering from Elbow pain / injury?",
  options: [
    "Elbow-More than a Week",
    "More than a Month",
    "More than 3 Months",
    "Not Sure",
  ],
  value: "",
  isInput: false,
}]
const Q = () => {
  const [questions, setQuestions] = useState(qst);
  const [count, setCount] = useState(0);
  const [tempText, setTempText] = useState("");
  const [check, setCheck] = useState(false);
  const [checkLoad, setLoadCheck] = useState(false);
  const randomWords = ["Aaha...", "Ok...", "Super...", "Hmm...", "Nice..."];
  const ChangeName = (id, value) => {
    let temp = qst;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id === id) {
        console.log(value);
        temp[i].options[0] = value;
      }
    }
    console.log(temp);
    setQuestions([...temp]);
    setCheck(true);
    setLoadCheck(true);
    setTimeout(() => {
      setCount(count + 1);
      setLoadCheck(false);
    }, 1200);
  };
  return (
    <div>
      <h2>Your Health Assessment</h2>
      {questions.map((que, index) => (
        <>
          {index <= count && (
            <div className="question__body">
              <div className="question">
                <img className="doctor__img" src={roboDoc} alt="" />
                <p>
                  {" "}
                  {que.question}{" "}
                  {que.isInput && (
                    <>
                      <br /> Lets Start with your name <br />{" "}
                      <input onChange={(e) => setTempText(e.target.value)} />
                    </>
                  )}
                </p>
              </div>
              {que.isInput ? (
                <div className="options">
                  <button
                    onClick={() => ChangeName(que.id, tempText)}
                    className="option"
                  >
                    {que.options[0]}
                  </button>
                </div>
              ) : (
                <div className="options">
                  {que.options.map((option, index) => (
                    <button className="option" key={index}>
                      {option}
                    </button>
                  ))}{" "}
                </div>
              )}
              {check && (
                <div className="question">
                  <img className="doctor__img" src={roboDoc} alt="" />
                  <p className="random-text">{randomWords[index]}</p>
                  {checkLoad && <Loading />}
                </div>
              )}
              {/* <div className="action">
                <>
                  <button className="answer">
                    {"Back-More than a Week"}{" "}
                    <i className="bi bi-pencil-square edit-icon"></i>
                  </button>
                  <div className="question">
                    <img className="doctor__img" src={roboDoc} alt="" />
                    <p className="random-text">Ok...</p>
                    <Loading />
                  </div>
                </>
              </div> */}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default Q;
