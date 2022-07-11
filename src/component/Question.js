import React, { useState } from "react";
import roboDoc from "../assets/robotdoc.jpg";
import Loading from "./Loading";

const randomWords = ["Aaha...", "Ok...", "Super...", "Hmm...", "Nice..."];

export default function Question({
  last,
  index,
  isInput,
  setBMI,
  question,
  value,
  setName,
  key,
  que,
  questions,
  setQuestions,
  id,
  time,
  setTime,
  tempText,
  setTempText,
  part,
  setPart,
  activity,
  setActivity,
  options,
  count,
  setCount,
  setRandomizedWords,
  randomizedWords,
  ttemp,
}) {
  const [answer, setAnswer] = useState("");
  //const [tempText, setTempText] = useState("");
  // const [activity, setActivity] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleClick = (ans, ansIndex) => {
    if (edit) {
      setAnswer(ans);
      setShowAnswer(true);
    } else {
      console.log("random", Math.ceil(Math.random() * randomWords.length));
      setRandomizedWords((prevWords) => [
        ...prevWords,
        randomWords[Math.ceil(Math.random() * (randomWords.length - 1))],
      ]);
      setAnswer(ans);
      setLoading(true);
      setShowAnswer(true);
      console.log(index, last);
      if (last !== index + 1) {
        setTimeout(() => {
          setCount((prev) => prev + 1);
          setLoading(false);
        }, 1200);
      } else {
        setCount((prev) => prev + 1);
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    console.log(tempText);
    setShowAnswer(false);
    setEdit(true);
  };

  console.log(randomizedWords);

  const updateName = (id) => {
    let tempQst = questions;
    for (let i = 0; i < tempQst.length; i++) {
      if (tempQst[i].id === id) {
        let index = tempQst.findIndex((x) => x.id === id);
        let a = tempText + " " + ttemp[index + 1].question;
        tempQst[index + 1].question = a;
      }
    }
    setQuestions([...tempQst]);
  };
  const updateActivity = (id, value) => {
    let tempQst = questions;
    for (let i = 0; i < tempQst.length; i++) {
      if (tempQst[i].id === id) {
        let index = tempQst.findIndex((x) => x.id === id);
        let a = tempQst[index + 1].question.replaceAll("this activity", value);
        tempQst[index + 1].question = a;
      }
    }
    setQuestions([...tempQst]);
  };
  return (
    <>
      {index <= count && (
        <>
          {/* {que.nrmTxt &&
            <div className="question__body">
              <div className="question">
                <img className="doctor__img" src={roboDoc} alt="" />
                <p>
                  {" "}
                  {question}
                </p>
              </div>
            </div>
           } */}
          <div className="question__body">
            <div className="question">
              <img className="doctor__img" src={roboDoc} alt="" />
              <p>
                {" "}
                {question}
                <br /> <br />{" "}
                {isInput && (
                  <input
                    placeholder={que.placeHolder}
                    onChange={(e) => {
                      if (que.id === "BMI") {
                        setBMI(e.target.value);
                      } else if (que.id === "activity") {
                        setActivity(e.target.value);
                      } else if(que.id==="name") {
                        setTempText(e.target.value);
                        updateName(id)
                      }
                    }}
                  />
                )}
              </p>
            </div>

            {!showAnswer && (
              <div className="options">
                {options.map((option, index) => (
                  <button
                    className="option"
                    key={index}
                    onClick={() => {
                      handleClick(option, index);
                      if(que.id==="name") {
                        updateName(id)
                      }
                      if (que.id === "activity") {
                        setActivity(option);
                        updateActivity(id, option);
                      }
                      if (que.id === "part") {
                        setPart(option);
                      }
                      if (que.id === "time") {
                        setTime(option);
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}{" "}
              </div>
            )}

            <div className="action">
              {showAnswer && (
                <>
                  <button className="answer">
                    {answer}{" "}
                    <i
                      onClick={handleEdit}
                      className="bi bi-pencil-square edit-icon"
                    ></i>
                  </button>
                  <div className="question">
                    <img className="doctor__img" src={roboDoc} alt="" />
                    <p className="random-text">{randomizedWords[index]}</p>
                    {loading && <Loading />}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
