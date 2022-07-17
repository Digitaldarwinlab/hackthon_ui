import React, { useEffect, useState } from "react";
import Question from "./Question";
import { Form, Input, InputNumber } from "antd";
import roboDoc from "../assets/robotdoc.jpg";
import Navbar from "./Navbar";
import IntroDoc from "../assets/introDoctor.png";
import { BsFillPencilFill } from "react-icons/bs";
import "./Quiz.css";
import Loading from "./Loading";
import { joint_questions } from "./stat";
import PostureClass from "./PostureClass";

const Quiz = () => {
  const randomWords = ["Aaha...", "Ok...", "Super...", "Hmm...", "Nice..."];

  // let dm2 = getQuestions();
  // console.log(dm2);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("qst"))
  );
  const [response, setresponse] = useState();
  const [score, setScore] = useState("");

  //const [count, setCount] = useState(0);
  // useEffect(()=>{
  //   if(JSON.parse(localStorage.getItem("qst"))==null){
  //     localStorage.setItem("qst", JSON.stringify(dm))
  //   }
  // },[])
  const getQuestions = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = {
        section: "Demographic",
      };
      // console.log('Id:',id);
      const response = await fetch(
        "https://dev.physioai.care/api/enterprise_ques/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      localStorage.setItem("demographicLength", responseData.length);
      // console.log(responseData);

      // console.log("listing data ",responseData)
      // const data = Decode(responseData)
      // console.log("listing data ",data)
      // if (response.status !== 200 && response.status !== 201) {
      //     return [];
      // }
      return responseData;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const sendAnswers = async (section, array) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      let part = localStorage.getItem("part");
      // const id = JSON.parse(localStorage.getItem("userId"))
      let encodedData = {
        employee_id: "1",
      };
      if (section === "Demographic") {
        encodedData = {
          employee_id: "1",
          Demographic: {
            General: array.map((arr) => [arr.question, arr.answer]),
          },
        };
      } else if (section === "General") {
        encodedData.part = {
          General: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      } else if (section === "Flexibility") {
        encodedData.part = {
          Flexibility: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      } else if (section === "PainScale") {
        encodedData.part = {
          Painscale: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      }

      // console.log('Id:',id);
      const response = await fetch(
        "https://hackathon.physioai.care/api/submit_answer/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      // console.log(responseData);

      // console.log("listing data ",responseData)
      // const data = Decode(responseData)
      // console.log("listing data ",data)
      // if (response.status !== 200 && response.status !== 201) {
      //     return [];
      // }
      return responseData;
    } catch (err) {
      console.log(err);
      return [];
    }
  };
  async function middle() {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = {
        part_name: localStorage.getItem("part"),
      };
      // console.log('Id:',id);
      const response = await fetch(
        "https://dev.physioai.care/api/middle_ques/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      // let joint_questions_filtered = joint_questions.filter(
      //   (itm) => itm.part_name === localStorage.getItem("part")
      // );
      // console.log("joint questions ", joint_questions_filtered);
      //   temp.rply = `Dear ${name}, I understand that you spend ${time} in ${activity} activity.
      // This results in ${part} pains.
      // We will be able to help you with it and in general
      // strengthening and conditioning of your muscles.
      // We would like to get a better understanding of the condition that may require
      // an in-camera assessment to design a Personalized therapy schedule for you`;

      // }, 3000);
      responseData["PostureFlex"] = [
        {
          section: "PostureFlex",
          part_name: "Wrist or Hands",
          question: "Posture Analysis",
          option: [
            ["Yes", 1],
            ["No", 2],
          ],
          pp_qs_id: 1097,
        },
      ];
      responseData["AromFlex"] = [
        {
          section: "AromFlex",
          part_name: "Wrist or Hands",
          question: "AROM Analysis",
          option: [
            ["Yes", 1],
            ["No", 2],
          ],
          pp_qs_id: 1097,
        },
      ];
      responseData["Consent"] = [
        {
          section: "Consent",
          part_name: "Wrist or Hands",
          question: "Consent form",
          option: [
            ["Yes", 1],
            ["No", 2],
          ],
          pp_qs_id: 1097,
        },
      ];
      return responseData;
    } catch (err) {
      setLoading(false);
      console.log(err);
      return [];
    }
  }
  async function mainFunction() {
    let responseData = await getQuestions();
    // console.log(responseData);
    setTempText("dummy");
    let check = JSON.parse(localStorage.getItem("chat"));
    if (check) {
      let a = JSON.parse(localStorage.getItem("qst")).findIndex(
        (it) => it.pp_qs_id === check[check.length - 1].pp_qs_id
      );
      setChatArr(check);
      if (check.length !== JSON.parse(localStorage.getItem("qst")).length) {
        // console.log(
        //   "chat",
        //   check.length !== JSON.parse(localStorage.getItem("qst")).length
        // );
        // console.log("chat", JSON.parse(localStorage.getItem("qst")).length);
        // console.log("chat", check.length);
        // console.log("inside else", a);
        if (a !== -1) {
          setCrrQst(JSON.parse(localStorage.getItem("qst"))[a + 1]);
          setCrrAns(JSON.parse(localStorage.getItem("qst"))[a + 1].option);
          setLoading(false);
        }
        setTempText("dummy");
      } else {
        setLoading(false);
      }
    } else {
      localStorage.setItem("qst", JSON.stringify(responseData));
      JSON.parse(localStorage.getItem("qst"));
      setCrrQst(JSON.parse(localStorage.getItem("qst"))[0]);
      if (JSON.parse(localStorage.getItem("qst"))[0].isInput) {
        // console.log(JSON.parse(localStorage.getItem("qst"))[0].option);
        setCrrAns(JSON.parse(localStorage.getItem("qst"))[0].option);
      }
    }

    // else {
    //   responseData = await middle();
    //   let sectionArray = ["Flexibility", "PainScale"];
    //   localStorage.removeItem('chat')
    //   for (const sections of sectionArray) {
    //     let response = responseData[sections];
    //     let check = JSON.parse(localStorage.getItem("chat"));
    //     console.log(check)
    //     if (check) {
    //       console.log(true)
    //       let a = JSON.parse(localStorage.getItem("qst")).findIndex(
    //         (it) => it.id === check[check.length - 1].id
    //       );
    //       console.log(a)
    //       setChatArr(check);
    //       if (check.length !== JSON.parse(localStorage.getItem("qst")).length) {
    //         console.log(
    //           "chat",
    //           check.length !== JSON.parse(localStorage.getItem("qst")).length
    //         );
    //         console.log("chat", JSON.parse(localStorage.getItem("qst")).length);
    //         console.log("chat", check.length);
    //         console.log("inside else", a);
    //         if (a !== -1) {
    //           setCrrQst(JSON.parse(localStorage.getItem("qst"))[a + 1]);
    //           setCrrAns(JSON.parse(localStorage.getItem("qst"))[a + 1].option);
    //           setLoading(false);
    //         }
    //       } else {
    //         setLoading(false);
    //       }
    //     } else {
    //       console.log(false)
    //       localStorage.setItem("qst", JSON.stringify(response));
    //       JSON.parse(localStorage.getItem("qst"));
    //       setCrrQst(JSON.parse(localStorage.getItem("qst"))[0]);
    //       if (JSON.parse(localStorage.getItem("qst"))[0].isInput) {
    //         // console.log(JSON.parse(localStorage.getItem("qst"))[0].option);
    //         setCrrAns(JSON.parse(localStorage.getItem("qst"))[0].option);
    //       }
    //     }
    //   }
    // }
  }

  useEffect(() => {
    let responseData = [
      {
        section: "Demographic",
        part_name: "General",
        question: "Hello, I am Dr. PhyBOT. Can I get your name Please?",
        option: ["Done"],
        pp_qs_id: 1,
        type: "qst",
        isInput: true,
        id: "name",
      },
      {
        section: "Demographic",
        part_name: "General",
        question: "Can I get your emailId Please?",
        option: ["Done"],
        pp_qs_id: 2,
        type: "qst",
        isInput: true,
        id: "email",
      },
      {
        section: "Demographic",
        part_name: "General",
        question: "Please enter the OTP we have send to your email",
        option: ["Done"],
        pp_qs_id: 3,
        type: "qst",
        isInput: true,
        id: "otp",
      },
    ];
    localStorage.setItem("qst", JSON.stringify(responseData));
    JSON.parse(localStorage.getItem("qst"));
    setCrrQst(JSON.parse(localStorage.getItem("qst"))[0]);
    if (JSON.parse(localStorage.getItem("qst"))[0].isInput) {
      // console.log(JSON.parse(localStorage.getItem("qst"))[0].option);
      setCrrAns(JSON.parse(localStorage.getItem("qst"))[0].option);
    }
    // mainFunction();
  }, []);

  const [tempText, setTempText] = useState("");
  const [demographicWidth, setdemographicWidth] = useState("");
  const [startAssesment, setStartAssesment] = useState(false);
  const [chatArr, setChatArr] = useState([]);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [otp, setOtp] = useState(localStorage.getItem("otp"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [age, setAge] = useState(localStorage.getItem("age"));
  const [weight, setWeight] = useState(localStorage.getItem("weight"));
  const [height, setHeight] = useState(localStorage.getItem("height"));
  const [time, setTime] = useState(localStorage.getItem("time"));
  const [activity, setActivity] = useState(localStorage.getItem("activity"));
  const [part, setPart] = useState(localStorage.getItem("part"));
  const [crrqst, setCrrQst] = useState({});
  const [crrans, setCrrAns] = useState([]);
  const [posturePopUp, setPosturePopUp] = useState(false);
  // const [sectionArray, setsectionArray] = useState([
  //   "Flexibility",
  //   "PainScale",
  // ]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [generateReport, setGenerateReport] = useState(false);
  const [form] = Form.useForm();
  const [cntrlArr, setCntrlArr] = useState(
    JSON.parse(localStorage.getItem("qst"))
  );
  const replaceText = (qst, rplTxt) => {
    console.log(qst.id);
    let ind = JSON.parse(localStorage.getItem("qst")).findIndex(
      (itm) => itm.pp_qs_id === qst.pp_qs_id
    );
    console.log(ind + 1);
    let txt = JSON.parse(localStorage.getItem("qst"))[
      ind + 1
    ].question.replaceAll(
      JSON.parse(localStorage.getItem("qst"))[ind + 1].replaceText,
      rplTxt
    );
    console.log(JSON.parse(localStorage.getItem("qst"))[ind + 1]);
    // console.log("replace ", ind);
    // console.log("replace ", txt);
    return {
      ...JSON.parse(localStorage.getItem("qst"))[ind + 1],
      question: txt,
    };
  };
  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }, [chatArr, crrqst]);
  // useEffect(() => {
  //   let check = JSON.parse(localStorage.getItem("chat"));
  //   if (check) {
  //     if (JSON.parse(localStorage.getItem('qst')).length == check.length) {
  //       setTimeout(() => {
  //         setGenerateReport(true);
  //         let obj = {
  //           id: "report",
  //           question: `Dear ${name}, I understand that you spend ${time} in ${activity} activity.
  //           This results in ${part} pains.
  //           We will be able to help you with it and in general
  //           strengthening and conditioning of your muscles.
  //           We would like to get a better understanding of the condition that may require
  //           an in-camera assessment to design a Personalized therapy schedule for you`,
  //           options: ["Ok"],
  //           isInput: false,
  //         };
  //         // setChatArr([...chatArr, obj]);
  //         // setCrrQst(joint_questions[0]);
  //         // setCrrAns(joint_questions[0].options);
  //       }, 3000);
  //     }
  //   }
  // }, [JSON.parse(localStorage.getItem("chat")), questions]);
  // console.log(crrqst)
  // console.log(crrans)
  // const otpSection = async () => {
  //   try {
  //     const headers = {
  //       Accept: "application/json",
  //       "Content-type": "application/json",
  //     };
  //     // const id = JSON.parse(localStorage.getItem("userId"))

  //     const encodedData = {
  //       email: otpEmail,
  //       otp:otp
  //     };
  //     // console.log('Id:',id);
  //     const response = await fetch(
  //       "https://hackathon.physioai.care/api/verify_otp/",
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(encodedData),
  //       }
  //     );

  //     const responseData = await response.json();
  //     localStorage.setItem('otpValue',true)
  //     let sectionArray = [
  //       "General",
  //       "PainScale",
  //       "Flexibility",
  //       "PostureFlex",
  //       "AromFlex",
  //       "Consent",
  //     ];
  //     for (const sec of sectionArray) {
  //       let responseData = await middle();
  //       setresponse(responseData);
  //       localStorage.setItem(`${sec}Length`, responseData[sec].length);
  //       localStorage.setItem(
  //         "qst",
  //         JSON.stringify([
  //           ...JSON.parse(localStorage.getItem("qst")),
  //           ...responseData[sec],
  //         ])
  //       );
  //       for (const res of sec) {
  //         setCrrQst(res);
  //         setCrrAns(res.option);
  //       }
  //     }
  //     computeAns();
  //     return responseData;
  //   } catch (err) {
  //     console.log(err);
  //     return [];
  //   }

  // };
  // const getOtp = async () => {
  //   try {
  //     const headers = {
  //       Accept: "application/json",
  //       "Content-type": "application/json",
  //     };
  //     // const id = JSON.parse(localStorage.getItem("userId"))

  //     const encodedData = {
  //       email: otpEmail,
  //     };
  //     // console.log('Id:',id);
  //     const response = await fetch(
  //       "https://hackathon.physioai.care/api/send_otp/",
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(encodedData),
  //       }
  //     );

  //     const responseData = await response.json();
  //     setotpNumber('Done')
  //     localStorage.setItem("otpNumber", 'Done');
  //     return responseData;
  //   } catch (err) {
  //     console.log(err);
  //     return [];
  //   }
  // };
  const computeAns = async (ans, qst) => {
    let check = JSON.parse(localStorage.getItem("chat"));
    let sectionArray = [
      "General",
      "PainScale",
      "Flexibility",
      "PostureFlex",
      "AromFlex",
      "Consent",
    ];
    // let no = 0
    let ind = JSON.parse(localStorage.getItem("qst")).findIndex(
      (itm) => itm.pp_qs_id === qst.pp_qs_id
    );
    console.log(ind);
    // let sectionArray = ["Flexibility", "PainScale"];
    // console.log(ind);
    if (crrqst.isInput) {
      let temp = {
        ...qst,
        answer: tempText,
        rply: randomWords[Math.floor(Math.random() * 5)],
      };
      // console.log(temp);
      // console.log(JSON.parse(localStorage.getItem("qst")).length - 1);
      setLoading(true);
      setChatArr([...chatArr, temp]);
      localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      setCrrQst({});
      setCrrAns([]);
      setTimeout(() => {
        setLoading(false);
        setCrrQst(replaceText(qst, tempText));
        setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
      }, 3000);
    } else {
      let temp = {
        ...qst,
        answer: ans,
        rply: randomWords[Math.floor(Math.random() * 5)],
      };
      // console.log("chat ", temp, " ", chatArr);
      // console.log(ind);
      // console.log(JSON.parse(localStorage.getItem("qst")).length - 1);

      setLoading(true);
      setChatArr([...chatArr, temp]);
      localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));

      if (
        parseInt(localStorage.getItem("demographicLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = [];
        a.push(
          `Dear ${name},Thank you for initiating an assesssment.I understand that you spend ${time} doing ${activity} activity.This results in ${part} pains.`
        );
        a.push(
          `We'll Like to help you with it and for muscle Strengthening & conditioning`
        );
        a.push(
          `To get a better understanding of your condition and design a Personalized therapy schedule.I'd Like to know a few more detailswhich may involve performing some action on and off camera to assess your range of motion.`
        );
        temp.rply = a;
        temp.type = "rpt";
        setChatArr([...chatArr, temp]);
        await localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        for (const sec of sectionArray) {
          let responseData = await middle();
          setresponse(responseData);
          localStorage.setItem(`${sec}Length`, responseData[sec].length);
          localStorage.setItem(
            "qst",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("qst")),
              ...responseData[sec],
            ])
          );
          for (const res of sec) {
            setCrrQst(res);
            setCrrAns(res.option);
          }
        }
        sendAnswers("Demographic", JSON.parse(localStorage.getItem("chat")));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        let a = await sendAnswers(
          "General",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength"))
          )
        );
        temp.rply = parseInt(a.score).toFixed();
        temp.type = "score";
        setChatArr([...chatArr, temp]);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        let a = await sendAnswers(
          "PainScale",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength"))
          )
        );
        temp.rply = parseInt(a.score).toFixed();
        temp.type = "score";
        setChatArr([...chatArr, temp]);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("FlexibilityLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        let a = await sendAnswers(
          "Flexibility",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength"))
          )
        );
        temp.rply = parseInt(a.score).toFixed();
        temp.type = "score";
        setChatArr([...chatArr, temp]);
      } else if (
        JSON.parse(localStorage.getItem("qst")).length ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
      }
      // if (responseData || response) {
      //   responseData = responseData ? responseData : response
      //   // console.log("Flexibility");
      //   for (const res of responseData["Flexibility"]) {
      //     setCrrQst(res);
      //     setCrrAns(res.option);
      //   }
      //   setCrrQst({});
      //   setCrrAns([]);
      //   // console.log("else ", qst);
      //   setTimeout(() => {
      //     setLoading(false);
      //     //setChatArr([...chatArr, temp]);
      //     // console.log(JSON.parse(localStorage.getItem("qst")).length-1)
      //     // console.log(ind)
      //     if (ind !== JSON.parse(localStorage.getItem("qst")).length - 1) {
      //       // console.log(ind);
      //       setCrrQst(replaceText(qst, ans));
      //       setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
      //       // console.log(ind+1)
      //       // console.log(replaceText(qst, ans));
      //       // console.log(
      //       //   JSON.parse(localStorage.getItem("qst"))[ind + 1].option
      //       // );
      //     }
      //   }, 3000);
      // } else {
      setCrrQst({});
      setCrrAns([]);
      setTimeout(() => {
        setLoading(false);
        //setChatArr([...chatArr, temp]);
        if (ind !== JSON.parse(localStorage.getItem("qst")).length - 1) {
          setCrrQst(replaceText(qst, ans));
          setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
        }
      }, 3000);
      // }
    }
  };
  // const rpt = (qst) => {
  //   return (
  //     <div className="card">
  //       <div className="card-details">
  //         <div className="name">{name}</div>

  //         {/* <div className="card-about">
  //           <div className="item">
  //             <span className="value">{age}</span>
  //             <span className="label">Age</span>
  //           </div>
  //           <div className="item">
  //             <span className="value">{weight} kg </span>
  //             <span className="label">Weight</span>
  //           </div>
  //           <div className="item">
  //             <span className="value">{height} cm</span>
  //             <span className="label">Height</span>
  //           </div>
  //         </div> */}
  //         <div className="skills">
  //           <span className="value">{qst}</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const handleEdit = (item) => {
    let ind = chatArr.filter((itm) => itm.pp_qs_id !== item.pp_qs_id);
    setChatArr(ind);
    setGenerateReport(false);
    localStorage.setItem("chat", JSON.stringify(ind));
    setCrrQst(item);
    setCrrAns(item.option);
    setLoading(false);
  };
  return (
    <>
      {startAssesment === false ? (
        <>
          <Navbar />
          <div className="introBox">
            <img src={IntroDoc} className="introDoc" />
            <span className="introFirst">Hi, I am Dr PhyBot</span>
            <span className="introSecond">
              I am your own virtual assistant for the assessment
            </span>

            <button
              className="introButton"
              onClick={() => {
                setStartAssesment(true);
                // mainFunction();
              }}
            >
              {chatArr.length === 0
                ? "Start your assesment"
                : "Revisit your assessment"}
            </button>
            {chatArr.length > 0 && (
              <span
                style={{
                  fontSize: "16px",
                  marginTop: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  localStorage.clear();
                  setTimeout(() => {
                    window.location.reload(false);
                  }, 1000);
                }}
              >
                Clear previous assessment
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <Navbar assesment={true} />
          <center style={{ marginTop: "50px" }}>
            {/* <h2>Your Health Assessment</h2> */}
            <div className="question__body">
              {chatArr !== [] &&
                chatArr.length > 0 &&
                chatArr.map((item, index) => (
                  <>
                    <>
                      <div className="question">
                        <img className="doctor__img" src={roboDoc} alt="" />
                        <p>{item.question}</p>
                      </div>
                      <div className="action">
                        <button
                          className={
                            index + 1 === chatArr.length
                              ? "answer"
                              : "alreadyAnswer"
                          }
                          key={index}
                        >
                          {Array.isArray(item.answer)
                            ? item.answer[0]
                            : item.answer}
                          {index + 1 === chatArr.length && (
                            <i
                              onClick={() => handleEdit(item)}
                              className="bi bi-pencil-square edit-icon"
                            ></i>
                          )}
                        </button>
                      </div>
                      {item.type !== "rpt" && item.type !== "score" && (
                        <div className="in">
                          <div className="question">
                            {/* <img className="doctor__img" src={roboDoc} alt="" /> */}
                            {/* <p className="random-text">
                            {JSON.parse(localStorage.getItem("qst")).length -
                              1 ===
                            index
                              ? `Report generating....`
                              : item.rply}
                          </p> */}
                            {loading && index + 1 === chatArr.length && (
                              <>
                                <img
                                  className="doctor__img2"
                                  src={roboDoc}
                                  alt=""
                                />
                                <Loading />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {/* report */}
                      {item.type === "rpt" && (
                        <div className="card">
                          <div className="card-details">
                            {/* <div className="name">{name}</div> */}

                            {/* <div className="card-about">
                              <div className="item">
                                <span className="value">{age}</span>
                                <span className="label">Age</span>
                              </div>
                              <div className="item">
                                <span className="value">{weight} kg </span>
                                <span className="label">Weight</span>
                              </div>
                              <div className="item">
                                <span className="value">{height} cm</span>
                                <span className="label">Height</span>
                              </div>
                            </div> */}
                            <div className="skills">
                              {item.rply.map((rply) => (
                                <p className="value">{rply}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {item.type === "score" && (
                        <div className="score">
                          <div id="outer-circle">
                            <span className="percentage">{item.rply}%</span>
                          </div>
                          <div className="scoreMessage">
                            Dear ,Thank you for initiating an assesssment.I
                            understand that you spend ${time} doing ${activity}{" "}
                            activity.This results in $ pains.\n We'll Like to
                            help you with it and for muscle Strengthening &
                            conditioning\n
                          </div>
                        </div>
                      )}
                    </>

                    {/* {item.type == "rpt" && (
                <>
                  {rpt(item.question)}
                  <br />
                  <br />
                </>
              )} */}
                  </>
                ))}

              {Object.keys(crrqst).length > 0 && (
                <>
                  <Form>
                    <div className="question">
                      <img className="doctor__img" src={roboDoc} alt="" />
                      <div>
                        {crrqst.question}
                        <br />
                        <br />
                        {crrqst.isInput && (
                          <Input
                            required
                            onChange={(e) => {
                              setTempText(e.target.value);
                              if (crrqst.id === "name") {
                                setName(e.target.value);
                                localStorage.setItem("name", e.target.value);
                              }
                              if (crrqst.id === "email") {
                                setEmail(e.target.value);
                                localStorage.setItem("email", e.target.value);
                              }
                              if (crrqst.id === "name") {
                                setOtp(e.target.value);
                                localStorage.setItem("otp", e.target.value);
                              }
                              if (crrqst.id === "height") {
                                setHeight(e.target.value);
                                localStorage.setItem("height", e.target.value);
                              }
                              if (crrqst.id === "weight") {
                                setWeight(e.target.value);
                                localStorage.setItem("weight", e.target.value);
                              }
                            }}
                            className="inpt"
                          />
                        )}
                        {crrqst.section == "PostureFlex" && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      //    console.log("chat ")
                                      setPosturePopUp(true);
                                    }}
                                    type="submit"
                                    className="option"
                                    key={option}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                        {crrqst.section == "AromFlex" && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      //    console.log("chat ")
                                      setPosturePopUp(true);
                                    }}
                                    type="submit"
                                    className="option"
                                    key={option}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                        {crrqst.section == "Consent" && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      //    console.log("chat ")
                                      setPosturePopUp(true);
                                    }}
                                    type="submit"
                                    className="option"
                                    key={option}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                        {!["PostureFlex", "AromFlex", "Consent"].includes(
                          crrqst.section
                        ) && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      //    console.log("chat ")
                                      if (tempText.length > 0) {
                                        if (crrqst.id === "activity") {
                                          setActivity(option);
                                          localStorage.setItem(
                                            "activity",
                                            option
                                          );
                                        }
                                        if (crrqst.id === "time") {
                                          setTime(option);
                                          localStorage.setItem("time", option);
                                        }
                                        if (crrqst.id === "part") {
                                          setPart(option);
                                          localStorage.setItem("part", option);
                                        }
                                        if (crrqst.id === "age") {
                                          setAge(option);
                                          localStorage.setItem("age", option);
                                        }
                                        computeAns(option, crrqst);
                                      }
                                    }}
                                    type="submit"
                                    className="option"
                                    key={option}
                                  >
                                    {Array.isArray(option) ? option[0] : option}
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </div>
            {/* {generateReport && (
        <div className="card">
          <div className="card-details">
            <div className="name">{name}</div>

            <div className="card-about">
              <div className="item">
                <span className="value">{age}</span>
                <span className="label">Age</span>
              </div>
              <div className="item">
                <span className="value">{weight} kg </span>
                <span className="label">Weight</span>
              </div>
              <div className="item">
                <span className="value">{height} cm</span>
                <span className="label">Height</span>
              </div>
            </div>
            <div className="skills">
              <span className="value">
                Dear {name}, I understand that you spend {time} in {activity}{" "}
                activity. This results in {part} pains. We will be able to help
                you with it and in general strengthening and conditioning of
                your muscles. We would like to get a better understanding of the
                condition that may require an in-camera assessment to design a
                Personalized therapy schedule for you
              </span>
            </div>
          </div>
        </div>
      )} */}

            {posturePopUp && (
              <PostureClass
                setPosturePopUp={setPosturePopUp}
                isModalVisible={posturePopUp}
              />
            )}
          </center>
        </>
      )}
    </>
  );
};

export default Quiz;
