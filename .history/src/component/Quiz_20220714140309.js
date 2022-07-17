import React, { useEffect, useState } from "react";
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
  const [scoreHigh, setScoreHigh] = useState(false);
  const [scoreLow, setScoreLow] = useState(false);
  const [scoreMild, setScoreMild] = useState(false);

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
        "https://hackathon.physioai.care/api/enterprise_ques/",
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
        employee_id: 1,
      };
      if (section === "Demographic") {
        encodedData = {
          employee_id: 1,
          Demographic: {
            General: array.map((arr) => [arr.question, arr.answer]),
          },
        };
      } else if (section === "General") {
        encodedData[part] = {
          General: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      } else if (section === "Flexibility") {
        encodedData[part] = {
          Flexibility: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      } else if (section === "PainScale") {
        encodedData[part] = {
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
        "https://hackathon.physioai.care/api/middle_ques/",
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
      // responseData["Consent"] = [
      //   {
      //     section: "Consent",
      //     part_name: "Wrist or Hands",
      //     question: "Consent form",
      //     option: [
      //       ["Yes", 1],
      //       ["No", 2],
      //     ],
      //     pp_qs_id: 1097,
      //   },
      // ];
      return responseData;
    } catch (err) {
      setLoading(false);
      console.log(err);
      return [];
    }
  }
  async function mainFunction() {
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
        option_image: [],
        emoji_image: [],
        question_image: [],
      },
      {
        section: "Demographic",
        part_name: "General",
        question: "Please can I get your Email Id Please?",
        option: ["Done"],
        pp_qs_id: 2,
        type: "qst",
        isInput: true,
        id: "email",
        option_image: [],
        emoji_image: [],
        question_image: [],
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
        option_image: [],
        emoji_image: [],
        question_image: [],
      },
    ];
    // setTempText("dummy");
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
          setCrransquesimg(
            JSON.parse(localStorage.getItem("qst"))[a + 1].question_image
          );
          setCrransoptimg(
            JSON.parse(localStorage.getItem("qst"))[a + 1].option_image
          );
          setCrrAnsemoji(
            JSON.parse(localStorage.getItem("qst"))[a + 1].emoji_image
          );
          setLoading(false);
        }
        // setTempText("dummy");
      } else {
        setLoading(false);
      }
    } else {
      localStorage.setItem("qst", JSON.stringify(responseData));
      JSON.parse(localStorage.getItem("qst"));
      setCrrQst(JSON.parse(localStorage.getItem("qst"))[0]);
      // if (JSON.parse(localStorage.getItem("qst"))[0].isInput) {
      // console.log(JSON.parse(localStorage.getItem("qst"))[0].option);
      setCrrAns(JSON.parse(localStorage.getItem("qst"))[0].option);

      setCrransoptimg(JSON.parse(localStorage.getItem("qst"))[0].option_image);
      setCrrAnsemoji(JSON.parse(localStorage.getItem("qst"))[0].emoji_image);
      setCrransquesimg(
        JSON.parse(localStorage.getItem("qst"))[0].question_image
      );
    }
  }

  useEffect(() => {
    mainFunction();
  }, []);
  const [crransemoji, setCrrAnsemoji] = useState([]);
  const [tempText, setTempText] = useState("");
  const [crransoptimg, setCrransoptimg] = useState([]);
  const [crransquesimg, setCrransquesimg] = useState([]);

  const [demographicWidth, setdemographicWidth] = useState("");
  const [startAssesment, setStartAssesment] = useState(false);
  const [chatArr, setChatArr] = useState([]);
  const [firstname, setfirstName] = useState(localStorage.getItem("firstname"));
  const [lastname, setlastName] = useState(localStorage.getItem("lastname"));
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
  const sendOtp = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = {
        email: email,
        otp: otp,
      };
      // console.log('Id:',id);
      const response = await fetch(
        "https://hackathon.physioai.care/api/verify_otp/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      let resp = await getQuestions();
      localStorage.setItem(`${resp[0].section}Length`, resp.length);
      localStorage.setItem(
        "qst",
        JSON.stringify([...JSON.parse(localStorage.getItem("qst")), ...resp])
      );
      setLoading(false);
      setCrrQst(resp[0]);
      setCrrAns(resp[0].option);
      setCrransquesimg(resp[0].question_image);
      setCrrAnsemoji(resp[0].emoji_image);
      setCrransoptimg(resp[0].option_image);
      return responseData;
    } catch (err) {
      console.log(err);
      return [];
    }
  };
  const getOtp = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = {
        email: email,
        first_name: firstname,
        last_name: lastname,
      };
      // console.log('Id:',id);
      const response = await fetch(
        "https://hackathon.physioai.care/api/add-employee/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      console.log(err);
      return [];
    }
  };
  const computeAns = async (ans, qst) => {
    let check = JSON.parse(localStorage.getItem("chat"));
    let sectionArray = ["General", "PainScale", "Flexibility"];
    // let no = 0
    let ind = JSON.parse(localStorage.getItem("qst")).findIndex(
      (itm) => itm.pp_qs_id === qst.pp_qs_id
    );
    // let sectionArray = ["Flexibility", "PainScale"];
    // console.log(ind);
    if (crrqst.isInput) {
      let temp = {
        ...qst,
        answer: tempText ? tempText : firstname + " " + lastname,
        rply: randomWords[Math.floor(Math.random() * 5)],
      };
      // console.log(temp);
      // console.log(JSON.parse(localStorage.getItem("qst")).length - 1);
      setLoading(true);
      setChatArr([...chatArr, temp]);
      localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      setCrrQst({});
      setCrrAns([]);
      setCrrAnsemoji([]);
      setCrransoptimg([]);
      setCrransquesimg([]);
      setTimeout(() => {
        setLoading(false);
        setCrrQst(
          replaceText(qst, tempText ? tempText : firstname + " " + lastname)
        );
        setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
        setCrrAnsemoji(
          JSON.parse(localStorage.getItem("qst"))[ind + 1].emoji_image
        );
        setCrransoptimg(
          JSON.parse(localStorage.getItem("qst"))[ind + 1].option_image
        );

        setCrransquesimg(
          JSON.parse(localStorage.getItem("qst"))[ind + 1].question_image
        );
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
        parseInt(localStorage.getItem("demographicLength")) + 3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = [];
        a.push(
          `Dear ${firstname},Thank you for initiating an assesssment.I understand that you spend ${time} doing ${activity} activity.This results in ${part} pains.`
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
            setCrransquesimg(res.question_image);
            setCrrAnsemoji(res.emoji_image);
            setCrransoptimg(res.option_image);
          }
        }
        sendAnswers(
          "Demographic",
          JSON.parse(localStorage.getItem("chat")).slice(3)
        );
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = await sendAnswers(
          "General",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength") + 3)
          )
        );
        if (parseInt(a.score).toFixed() < 40) {
          setScoreHigh(true);
        } else if (parseInt(a.score).toFixed() < 80) {
          setScoreMild(true);
        } else if (parseInt(a.score).toFixed() > 80) {
          setScoreLow(true);
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = await sendAnswers(
          "PainScale",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength") + 3)
          )
        );
        if (parseInt(a.score).toFixed() < 40) {
          setScoreHigh(true);
        } else if (parseInt(a.score).toFixed() < 80) {
          setScoreMild(true);
        } else if (parseInt(a.score).toFixed() > 80) {
          setScoreLow(true);
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("FlexibilityLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = await sendAnswers(
          "Flexibility",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength") + 3)
          )
        );
        if (parseInt(a.score).toFixed() < 40) {
          setScoreHigh(true);
        } else if (parseInt(a.score).toFixed() < 80) {
          setScoreMild(true);
        } else if (parseInt(a.score).toFixed() > 80) {
          setScoreLow(true);
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      } else if (
        JSON.parse(localStorage.getItem("qst")).length ===
          JSON.parse(localStorage.getItem("chat")).length &&
        JSON.parse(localStorage.getItem("chat")).length > 5
      ) {
        temp.rply = "Done";
        temp.type = "consent";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
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
      setCrransquesimg([]);
      setCrrAnsemoji([]);
      setCrransoptimg([]);
      setTimeout(() => {
        setLoading(false);
        //setChatArr([...chatArr, temp]);
        if (ind !== JSON.parse(localStorage.getItem("qst")).length - 1) {
          setCrrQst(replaceText(qst, ans));
          setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
          setCrransquesimg(
            JSON.parse(localStorage.getItem("qst"))[ind + 1].question_image
          );
          setCrrAnsemoji(
            JSON.parse(localStorage.getItem("qst"))[ind + 1].emoji_image
          );
          setCrransoptimg(
            JSON.parse(localStorage.getItem("qst"))[ind + 1].option_image
          );
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
    setCrransquesimg(item.question_image);
    setCrrAnsemoji(item.emoji_image);
    setCrransoptimg(item.option_image);
    setLoading(false);
  };
  // console.log(crrans, crransemoji);
  const setEmoji = async(opt, item,emoji) => {
    let src =''
    for (let i = 0; i < opt.length; i++) {
      console.log(opt[i],item)
      // if(opt[i]=== item){
      // }
    }
    return <img src={src} width="40" height="40" />
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
                          {item.emoji_image.length > 0 ? (
                            <>
                              {setEmoji(item.option, item.answer,item.emoji_image)}
                              {/* {item.option.map((opt,index) => 
                                   <img src={opt === item.answer ? item.emoji_image[index] : ''} width="40" height="40" />
                              )} */}
                            </>
                          ) : (
                            <>
                              {Array.isArray(item.answer)
                                ? item.answer[0]
                                : item.answer}
                            </>
                          )}

                          {index + 1 === chatArr.length && (
                            <i
                              onClick={() => handleEdit(item)}
                              className="bi bi-pencil-square edit-icon"
                            ></i>
                          )}
                        </button>
                      </div>
                      {item.type !== "rpt" &&
                        item.type !== "score" &&
                        item.type !== "Consent" && (
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
                              {Array.isArray(item.rply) ? (
                                <>
                                  {item.rply.map((rply) => (
                                    <p className="value">{rply}</p>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <p className="value">{item.rply}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {item.type === "score" && (
                        <div
                          className="score"
                          id={
                            scoreHigh
                              ? "score-high"
                              : scoreMild
                              ? "score-mild"
                              : scoreLow
                              ? "score-low"
                              : null
                          }
                        >
                          <div
                            id={
                              scoreHigh
                                ? "outer-circle-high"
                                : scoreMild
                                ? "outer-circle-mild"
                                : scoreLow
                                ? "outer-circle-low"
                                : null
                            }
                          >
                            <span className="percentage">{item.rply}%</span>
                          </div>
                          <div className="scoreMessage">
                            <p>
                              Dear {firstname},Thank you for initiating an
                              assesssment.I understand that you spend {time}{" "}
                              doing {activity} activity.This results in pain{" "}
                              {part}
                            </p>
                            <p>
                              We'll Like to help you with it and for muscle
                              Strengthening and conditioning
                            </p>
                          </div>
                        </div>
                      )}
                      {item.type === "consent" && (
                        <>
                          <p>
                            Dear {firstname},Thank you for completing an
                            assesssment
                          </p>
                          <div className="options">
                            <button
                              onClick={() => {
                                window.location.reload(false);
                              }}
                              type="submit"
                              className="option"
                            >
                              Done!!
                            </button>
                          </div>
                        </>
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
                      <div
                        style={{
                          backgroundColor: "#ffff",
                          borderRadius: "10px",
                          padding: "2%",
                        }}
                      >
                        {crransquesimg !== undefined &&
                          (crransquesimg.length > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {crrqst.question}
                              <img
                                src={crransquesimg[0]}
                                style={{
                                  width: "100%",
                                  height: "250px",
                                }}
                              />
                            </div>
                          ) : (
                            <>{crrqst.question}</>
                          ))}
                        <br />

                        {crrqst.isInput && (
                          <>
                            {crrqst.id === "name" ? (
                              <>
                                <Input
                                  required
                                  placeholder="First Name"
                                  onChange={(e) => {
                                    if (crrqst.id === "name") {
                                      setfirstName(e.target.value);
                                      localStorage.setItem(
                                        "firstname",
                                        e.target.value
                                      );
                                    }
                                  }}
                                  className="inpt"
                                  style={{ margin: "auto", marginTop: "13px" }}
                                />
                                <Input
                                  required
                                  placeholder="Last Name"
                                  onChange={(e) => {
                                    if (crrqst.id === "name") {
                                      setlastName(e.target.value);
                                      localStorage.setItem(
                                        "lastname",
                                        e.target.value
                                      );
                                    }
                                  }}
                                  className="inpt"
                                  style={{ margin: "auto", marginTop: "13px" }}
                                />
                              </>
                            ) : (
                              <Input
                                required
                                onChange={(e) => {
                                  setTempText(e.target.value);
                                  if (crrqst.id === "email") {
                                    setEmail(e.target.value);
                                    localStorage.setItem(
                                      "email",
                                      e.target.value
                                    );
                                  }
                                  if (crrqst.id === "height") {
                                    setHeight(e.target.value);
                                    localStorage.setItem(
                                      "height",
                                      e.target.value
                                    );
                                  }
                                  if (crrqst.id === "weight") {
                                    setWeight(e.target.value);
                                    localStorage.setItem(
                                      "weight",
                                      e.target.value
                                    );
                                  }
                                  if (crrqst.id === "otp") {
                                    setOtp(e.target.value);
                                    localStorage.setItem("otp", e.target.value);
                                  }
                                }}
                                className="inpt"
                                style={{ margin: "auto", marginTop: "13px" }}
                              />
                            )}
                          </>
                        )}
                        {!["PostureFlex", "AromFlex", "Consent"].includes(
                          crrqst.section
                        ) && (
                          <div className="options">
                            {crransoptimg !== undefined &&
                              crrans !== undefined &&
                              crransemoji !== undefined && (
                                <>
                                  {crransemoji.length === 0 ? (
                                    <>
                                      {crrans.map((option, index) => (
                                        <button
                                          onClick={() => {
                                            //    console.log("chat ")
                                            if (
                                              tempText.length > 0 ||
                                              (firstname.length > 0 &&
                                                lastname.length > 0)
                                            ) {
                                              if (crrqst.id === "activity") {
                                                setActivity(option);
                                                localStorage.setItem(
                                                  "activity",
                                                  option
                                                );
                                              }
                                              if (crrqst.id === "email") {
                                                getOtp();
                                              }
                                              if (crrqst.id === "otp") {
                                                sendOtp();
                                              }

                                              if (crrqst.id === "time") {
                                                setTime(option);
                                                localStorage.setItem(
                                                  "time",
                                                  option
                                                );
                                              }
                                              if (crrqst.id === "part") {
                                                setPart(option);
                                                localStorage.setItem(
                                                  "part",
                                                  option
                                                );
                                              }
                                              if (crrqst.id === "age") {
                                                setAge(option);
                                                localStorage.setItem(
                                                  "age",
                                                  option
                                                );
                                              }
                                              computeAns(option, crrqst);
                                            }
                                          }}
                                          type="submit"
                                          className="option"
                                          key={option}
                                        >
                                          <>
                                            {crransoptimg.length > 0 ? (
                                              <>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  {Array.isArray(option)
                                                    ? option[0]
                                                    : option}
                                                  <img
                                                    src={crransoptimg[index]}
                                                    style={{
                                                      width: "80%",
                                                      height: "170px",
                                                    }}
                                                  />
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                {Array.isArray(option)
                                                  ? option[0]
                                                  : option}
                                              </>
                                            )}
                                          </>
                                        </button>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {crransemoji.map((option, index) => (
                                        <button
                                          onClick={() => {
                                            //    console.log("chat ")
                                            if (
                                              tempText.length > 0 ||
                                              (firstname.length > 0 &&
                                                lastname.length > 0)
                                            ) {
                                              for (
                                                let i = 0;
                                                i <= crrans.length;
                                                i++
                                              ) {
                                                if (i === index) {
                                                  computeAns(crrans[i], crrqst);
                                                }
                                              }
                                            }
                                          }}
                                          type="submit"
                                          className="option"
                                          key={option}
                                        >
                                          <img
                                            src={option}
                                            width="40"
                                            height="40"
                                          />
                                        </button>
                                      ))}
                                    </>
                                  )}
                                </>
                              )}
                          </div>
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
