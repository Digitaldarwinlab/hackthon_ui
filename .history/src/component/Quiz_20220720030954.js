import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, message, Button } from "antd";
import roboDoc from "../assets/robotdoc.jpg";
import Navbar from "./Navbar";
import IntroDoc from "../assets/introDoctor.png";
import { BsFillPencilFill } from "react-icons/bs";
import "./Quiz.css";
import Loading from "./Loading";
import { joint_questions } from "./stat";
import PostureClass from "./PostureClass";
import Arom from "./Arom";

const Quiz = () => {
  const randomWords = ["Aaha...", "Ok...", "Super...", "Hmm...", "Nice..."];
  const jointPoints = {
    Knee: [6, 7],
    Neck: [8, 9],
    Shoulder: [0, 1],
    UpperBack: [0, 1],
    LowerBack: [10, 11],
    Hip: [4, 5],
    WristorHands: [12, 13],
    LowerlegsCalfMuscles: [],
    Elbow: [2, 3],
    Ankle: [14, 15],
  };

  // let dm2 = getQuestions();
  // console.log(dm2);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("qst"))
  );
  const [response, setresponse] = useState();
  const [error, setError] = useState("");
  const [postureQst, setPostureQst] = useState();
  const [aromQst, setAromQst] = useState();
  const [thankYou, setThankyou] = useState(false);
  // const [postureAnswer, setPostureAnswer] = useState(false);

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

      return responseData;
    } catch (err) {
      // console.log(err);
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
      let employee_id = parseInt(localStorage.getItem("employee_id"));
      // const id = JSON.parse(localStorage.getItem("userId"))
      let encodedData = {
        employee_id: employee_id,
      };
      if (section === "Demographic") {
        encodedData = {
          employee_id: employee_id,
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
      } else if (section === "PainScale") {
        encodedData[part] = {
          Painscale: array.map((arr) => [
            arr.question,
            arr.answer[0],
            arr.answer[1],
          ]),
        };
      } else if (section === "AromFlex") {
        encodedData[part] = {
          AromFlex: array.map((arr) => [arr.question, arr.answer]),
        };
      } else if (section === "PostureFlex") {
        encodedData[part] = {
          PostureFlex: array.map((arr) => [arr.question, arr.answer]),
        };
      }
      // else if (section === "Consent") {
      //   encodedData[part] = {
      //     Consent: array.map((arr) => [
      //       arr.question,
      //       arr.answer[0],
      //       arr.answer[1],
      //     ]),
      //   };
      // }

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
      return responseData;
    } catch (err) {
      // console.log(err);
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
      return responseData;
    } catch (err) {
      setLoading(false);
      // console.log(err);
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
          if (JSON.parse(localStorage.getItem("qst"))[a + 1].posture_type) {
            setCrrposterType(
              JSON.parse(localStorage.getItem("qst"))[a + 1].posture_type
            );
          }
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
      if (JSON.parse(localStorage.getItem("qst"))[0].posture_type) {
        setCrrposterType(
          JSON.parse(localStorage.getItem("qst"))[0].posture_type
        );
      }
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
  const [rptLoading, setRptLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [finalrptLoading, setFinalRptLoading] = useState(false);

  const [chatArr, setChatArr] = useState([]);
  const [firstname, setfirstName] = useState(localStorage.getItem("firstname"));
  const [lastname, setlastName] = useState(localStorage.getItem("lastname"));
  const [otp, setOtp] = useState(localStorage.getItem("otp"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [age, setAge] = useState(localStorage.getItem("age"));
  const [gender, setGender] = useState(localStorage.getItem("gender"));
  const [weight, setWeight] = useState(localStorage.getItem("weight"));
  const [height, setHeight] = useState(localStorage.getItem("height"));
  const [time, setTime] = useState(localStorage.getItem("time"));
  const [activity, setActivity] = useState(localStorage.getItem("activity"));
  const [part, setPart] = useState(localStorage.getItem("part"));
  const [crrqst, setCrrQst] = useState({});
  const [crrans, setCrrAns] = useState([]);
  const [crrposterType, setCrrposterType] = useState("");

  const [posturePopUp, setPosturePopUp] = useState(false);
  const [aromPopUp, setAromPopUp] = useState(false);

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
    // console.log(qst.id);
    let ind = JSON.parse(localStorage.getItem("qst")).findIndex(
      (itm) => itm.pp_qs_id === qst.pp_qs_id
    );
    let txt = JSON.parse(localStorage.getItem("qst"))[
      ind + 1
    ].question.replaceAll(
      JSON.parse(localStorage.getItem("qst"))[ind + 1].replaceText,
      rplTxt
    );
    // console.log(JSON.parse(localStorage.getItem("qst"))[ind + 1]);
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

  const sendEmail = async () => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = {
        email: email,
      };
      // console.log('Id:',id);
      const response = await fetch(
        "https://hackathon.physioai.care/api/consent",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();
      return responseData;
    } catch {
      return [];
    }
  };
  const otpGetter = async () => {
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
      return responseData;
    } catch {
      return [];
    }
  };
  const sendOtp = async () => {
    try {
      const responseData = await otpGetter();
      if (responseData === [] || responseData.status_code === 300) {
        setError("Invalid otp entered");
        setTimeout(() => {
          document.getElementById("error").click();
        }, 1000);
      } else {
        setError("Otp Verified");
        setTimeout(() => {
          document.getElementById("success").click();
        }, 1000);
        let resp = await getQuestions();
        localStorage.setItem(`${resp[0].section}Length`, resp.length);
        localStorage.setItem(
          "qst",
          JSON.stringify([...JSON.parse(localStorage.getItem("qst")), ...resp])
        );
        setLoading(false);
        setCrrQst(resp[0]);
        setCrrAns(resp[0].option);
        if (resp[0].posture_type) {
          setCrrposterType(resp[0].posture_type);
        }
        setCrransquesimg(resp[0].question_image);
        setCrrAnsemoji(resp[0].emoji_image);
        setCrransoptimg(resp[0].option_image);
      }
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
      if (responseData.status_code === 300) {
      } else {
        localStorage.setItem("employee_id", responseData.employee_id);
      }
      return responseData;
    } catch (err) {
      // console.log(err);
      return [];
    }
  };
  const computeAns = async (ans, qst) => {
    let check = JSON.parse(localStorage.getItem("chat"));
    let sectionArray = [
      "General",
      "PainScale",
      "PostureFlex",
      "AromFlex",
      "Consent",
    ];
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
      setCrrposterType("");
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
        if (JSON.parse(localStorage.getItem("qst"))[ind + 1].posture_type) {
          setCrrposterType(
            JSON.parse(localStorage.getItem("qst"))[ind + 1].posture_type
          );
        }
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
        answer:
          qst.section === "AromFlex"
            ? qst["Excercise"]
              ? JSON.parse(ans)
              : ans
            : ans,
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
        setRptLoading(true);
        let a = [];
        let b = part ? part : ans;
        a.push(
          `Dear ${firstname},Thank you for initiating an assesssment.I understand that you spend ${time} doing ${activity} activity.`
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
            if (res.posture_type) {
              setCrrposterType(res.posture_type);
            }
            setCrransquesimg(res.question_image);
            setCrrAnsemoji(res.emoji_image);
            setCrransoptimg(res.option_image);
          }
        }
        sendAnswers(
          "Demographic",
          JSON.parse(localStorage.getItem("chat")).slice(3)
        );
        setTimeout(async () => {
          setRptLoading(false);
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setScoreLoading(true);
        let a = await sendAnswers(
          "General",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) + 3
          )
        );
        if (parseInt(a.score).toFixed() < 40) {
          temp.scoreType = "high";
        } else if (parseInt(a.score).toFixed() < 70) {
          temp.scoreType = "mild";
        } else if (parseInt(a.score).toFixed() > 70) {
          temp.scoreType = "low";
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        temp.scoreRply = `Dear ${firstname}, Based on the information you have shared and my analysis; your General score for ${part} is at ${parseInt(
          a.score
        ).toFixed()}%. This puts you at a ${
          parseInt(a.score).toFixed() < 40
            ? "Mild"
            : parseInt(a.score).toFixed() < 70
            ? "Medium"
            : "High"
        } risk. To help you manage it, please help us with a few more detail`;
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setTimeout(async () => {
          setScoreLoading(false);
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setScoreLoading(true);
        let a = await sendAnswers(
          "PainScale",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              3
          )
        );
        if (parseInt(a.score).toFixed() < 40) {
          temp.scoreType = "high";
        } else if (parseInt(a.score).toFixed() < 80) {
          temp.scoreType = "mild";
        } else if (parseInt(a.score).toFixed() > 80) {
          temp.scoreType = "low";
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setTimeout(async () => {
          setScoreLoading(false);
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = await sendAnswers(
          "PostureFlex",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(
              localStorage.getItem("demographicLength") +
                parseInt(localStorage.getItem("GeneralLength")) +
                parseInt(localStorage.getItem("PainScaleLength"))
            ) + 3
          )
        );
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) +
          parseInt(localStorage.getItem("AromFlexLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setFinalRptLoading(true);
        let a = await sendAnswers(
          "AromFlex",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength")) +
              parseInt(localStorage.getItem("PostureFlexLength")) +
              3
          )
        );
        temp.type = "finalrpt";
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setTimeout(async () => {
          setFinalRptLoading(false);
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) +
          parseInt(localStorage.getItem("AromFlexLength")) +
          parseInt(localStorage.getItem("ConsentLength")) +
          3 ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setRptLoading(true);
        let a = await sendAnswers(
          "Consent",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength")) +
              parseInt(localStorage.getItem("PostureFlexLength")) +
              parseInt(localStorage.getItem("AromFlexLength")) +
              3
          )
        );
        await sendEmail();
        temp.rply = `Dear ${firstname},Thank you for taking an assesssment.Your UserId and password has been send to your Email Id`;
        temp.type = "rpt";
        temp.login = true;
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setTimeout(async () => {
          setRptLoading(false);
        }, 2000);
      }

      setCrrQst({});
      setCrrAns([]);
      setCrrposterType("");
      setCrransquesimg([]);
      setCrrAnsemoji([]);
      setCrransoptimg([]);
      setTimeout(() => {
        setLoading(false);
        //setChatArr([...chatArr, temp]);
        if (ind !== JSON.parse(localStorage.getItem("qst")).length - 1) {
          setCrrQst(replaceText(qst, ans));
          setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + 1].option);
          if (JSON.parse(localStorage.getItem("qst"))[ind + 1].posture_type) {
            setCrrposterType(
              JSON.parse(localStorage.getItem("qst"))[ind + 1].posture_type
            );
          }
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

  const handleEdit = (item) => {
    let ind = chatArr.filter((itm) => itm.pp_qs_id !== item.pp_qs_id);
    setChatArr(ind);
    setGenerateReport(false);
    localStorage.setItem("chat", JSON.stringify(ind));
    setCrrQst(item);
    setCrrAns(item.option);
    if (item.posture_type) {
      setCrrposterType(item.posture_type);
    }
    setCrransquesimg(item.question_image);
    setCrrAnsemoji(item.emoji_image);
    setCrransoptimg(item.option_image);
    setLoading(false);
  };
  // console.log(crrans, crransemoji);
  const setEmoji = (opt, item, emoji) => {
    let src;
    opt.forEach((opt, index) => {
      if (opt[1] === item[1]) {
        src = emoji[index];
      }
    });
    return <img src={src} width="40" height="40" />;
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
          <Button
            style={{ display: "none" }}
            id="error"
            onClick={() => {
              message.error(error);
            }}
          ></Button>
          <Button
            style={{ display: "none" }}
            id="success"
            onClick={() => {
              message.success(error);
            }}
          ></Button>
          {/* <img src='https://i.gifer.com/ZZ5H.gif' width={60} height={60}/>
          <p style={{marginTop:'10px',fontSize:'20px'}}>Loading Result....</p> */}
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
                            index + 1 === chatArr.length &&
                            item.id !== "part" &&
                            item.id !== "otp"
                              ? "answer"
                              : "alreadyAnswer"
                          }
                          key={index}
                        >
                          {item.emoji_image.length > 0 ? (
                            <>
                              {setEmoji(
                                item.option,
                                item.answer,
                                item.emoji_image
                              )}
                              {/* {item.option.map((opt,index) => 
                                   <img src={opt === item.answer ? item.emoji_image[index] : ''} width="40" height="40" />
                              )} */}
                            </>
                          ) : (
                            <>
                              {item.section === "PostureFlex" &&
                              item.answer[0] !== "No" ? (
                                <img
                                  src={item.answer[0]}
                                  width={200}
                                  height={200}
                                />
                              ) : (
                                <>
                                  {item.section === "AromFlex" &&
                                  item.answer[0] !== "No" ? (
                                    <span>Done</span>
                                  ) : (
                                    <>
                                      {Array.isArray(item.answer)
                                        ? item.answer[0]
                                        : item.answer}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}

                          {index + 1 === chatArr.length &&
                            item.id !== "part" &&
                            item.id !== "otp" && (
                              <i
                                onClick={() => handleEdit(item)}
                                className="bi bi-pencil-square edit-icon"
                              ></i>
                            )}
                        </button>
                      </div>

                      {item.type !== "rpt" &&
                        item.type !== "score" &&
                        item.type !== "finalrpt" && (
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
                        <>
                          {rptLoading ? (
                            <>
                              <img
                                src="https://i.gifer.com/ZZ5H.gif"
                                width={40}
                                height={40}
                              />
                              <p
                                style={{ marginTop: "10px", fontSize: "15px" }}
                              >
                                Loading Result....
                              </p>
                            </>
                          ) : (
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
                                {item.login === true && (
                                  <a
                                    style={{
                                      textDecoration: "none",
                                      fontSize: "15px",
                                    }}
                                    onClick={() => {
                                      localStorage.clear();
                                    }}
                                    href="/login"
                                    rel="noopener noreferrer"
                                  >
                                    Go to Login Page {">>"}
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {item.type === "score" && (
                        <>
                          {scoreLoading ? (
                            <>
                              <img
                                src="https://i.gifer.com/ZZ5H.gif"
                                width={40}
                                height={40}
                              />
                              <p
                                style={{ marginTop: "10px", fontSize: "15px" }}
                              >
                                Loading Result....
                              </p>
                            </>
                          ) : (
                            <div
                              className="score"
                              id={
                                item.scoreType === "high"
                                  ? "score-low"
                                  : item.scoreType === "mild"
                                  ? "score-mild"
                                  : item.scoreType === "low"
                                  ? "score-high"
                                  : null
                              }
                            >
                              <div
                                id={
                                  item.scoreType === "high"
                                    ? "outer-circle-low"
                                    : item.scoreType === "mild"
                                    ? "outer-circle-mild"
                                    : item.scoreType === "low"
                                    ? "outer-circle-high"
                                    : null
                                }
                              >
                                <span
                                  className="percentage"
                                  id={
                                    item.scoreType === "high"
                                      ? "percentage-low"
                                      : item.scoreType === "mild"
                                      ? "percentage-mild"
                                      : item.scoreType === "low"
                                      ? "percentage-high"
                                      : null
                                  }
                                >
                                  {item.rply}%
                                </span>
                              </div>
                              <div className="scoreMessage">
                                <p>
                                  Dear {firstname},This is the report of your
                                  issues generated by our system.
                                </p>
                                <p>We'll Like to help you with it.</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {item.type === "finalrpt" && (
                        <>
                          {finalrptLoading ? (
                            <>
                              <img
                                src="https://i.gifer.com/ZZ5H.gif"
                                width={40}
                                height={40}
                              />
                              <p
                                style={{ marginTop: "10px", fontSize: "15px" }}
                              >
                                Loading Result....
                              </p>
                            </>
                          ) : (
                            <div className="card">
                              <div className="finalskills">
                                <span className="finalValue">
                                  Dear {firstname},
                                </span>
                                <br />
                                <p className="finalValue">
                                  Here is what you have shared.
                                </p>
                                <span className="finalValue">
                                  Your Age: {age} , Gender: {gender}{" "}
                                </span>
                                <br />
                                <span className="finalValue">
                                  Complaint in {part} with Pain : Pain Scale
                                </span>
                                <br />
                                <p className="finalValue">
                                  The following is my observation about your
                                  Posture:
                                </p>
                                <p className="finalValue">
                                  I see that the deviations are :{" "}
                                </p>
                                <div className="imgcards">
                                  {chatArr.map((item, index) => (
                                    <>
                                      {item.section === "PostureFlex" && (
                                        <>
                                          {item.answer[0] !== "No" && (
                                            <>
                                              <img
                                                src={`${item.answer[0]}`}
                                                style={{
                                                  margin: "auto",
                                                  marginBottom: "10px",
                                                }}
                                                className="showImgs"
                                              />
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ))}
                                </div>{" "}
                                <br />
                                <p className="finalValue">
                                  {chatArr.map((item, index) => (
                                    <>
                                      {item.section === "AromFlex" && (
                                        <>
                                          {item.answer[0] !== "No" ? (
                                            <>
                                              <span>
                                                Your Flexibility for the join as
                                                per the assessment is better
                                                than average
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span>
                                                You didn't attempt the Arom test
                                              </span>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ))}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
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
                              <>
                                {crrqst.id === "height" ||
                                crrqst.id === "weight" ? (
                                  <>
                                    <input
                                      type={"number"}
                                      max={1000}
                                      min={5}
                                      onChange={(e) => {
                                        setTempText(e.target.value);
                                        if (crrqst.id === "height") {
                                          setHeight(e);
                                          localStorage.setItem("height", e);
                                        }
                                        if (crrqst.id === "weight") {
                                          setWeight(e.target.value);
                                          localStorage.setItem("weight", e);
                                        }
                                      }}
                                      className="inptNo"
                                      style={{
                                        margin: "auto",
                                        marginTop: "13px",
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>
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

                                        if (crrqst.id === "otp") {
                                          setOtp(e.target.value);
                                          localStorage.setItem(
                                            "otp",
                                            e.target.value
                                          );
                                        }
                                        if (crrqst.id === "gender") {
                                          setGender(e.target.value);
                                          localStorage.setItem(
                                            "gender",
                                            e.target.value
                                          );
                                        }
                                      }}
                                      className="inpt"
                                      style={{
                                        margin: "auto",
                                        marginTop: "13px",
                                      }}
                                    />
                                  </>
                                )}
                              </>
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
                                          onClick={async () => {
                                            if (
                                              firstname !== null &&
                                              lastname !== null
                                            ) {
                                              if (
                                                tempText.length > 0 ||
                                                (firstname.length > 0 &&
                                                  lastname.length > 0)
                                              ) {
                                                if (crrqst.id === "email") {
                                                  if (
                                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                                      email
                                                    )
                                                  ) {
                                                    getOtp();
                                                    computeAns(option, crrqst);
                                                  } else {
                                                    setError(
                                                      "Invalid Email Id"
                                                    );
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById("error")
                                                        .click();
                                                    }, 1000);
                                                  }
                                                } else if (
                                                  crrqst.id === "otp"
                                                ) {
                                                  let a = await sendOtp();
                                                  // console.log(a);
                                                  if (
                                                    a.status_code !== 300 &&
                                                    a.status_code !== 400
                                                  ) {
                                                    computeAns(option, crrqst);
                                                  }
                                                } else if (
                                                  crrqst.id === "weight"
                                                ) {
                                                  console.log(weight);
                                                  if (weight !== null) {
                                                    computeAns(option, crrqst);
                                                  } else {
                                                    setError(
                                                      "Please enter your weight"
                                                    );
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById("error")
                                                        .click();
                                                    }, 1000);
                                                  }
                                                } else if (
                                                  crrqst.id === "height"
                                                ) {
                                                  console.log(height);
                                                  if (height !== null) {
                                                    computeAns(option, crrqst);
                                                  } else {
                                                    setError(
                                                      "Please enter your height"
                                                    );
                                                    setTimeout(() => {
                                                      document
                                                        .getElementById("error")
                                                        .click();
                                                    }, 1000);
                                                  }
                                                } else {
                                                  if (
                                                    crrqst.id === "activity"
                                                  ) {
                                                    setActivity(option);
                                                    localStorage.setItem(
                                                      "activity",
                                                      option
                                                    );
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
                                                    let joinPart =
                                                      option.replace("/", "");
                                                    joinPart =
                                                      joinPart.replaceAll(
                                                        " ",
                                                        ""
                                                      );
                                                    let joint =
                                                      jointPoints[joinPart];
                                                    localStorage.setItem(
                                                      "jointValues",
                                                      JSON.stringify(joint)
                                                    );
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
                                              }
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
                                      if (Array.isArray(option)) {
                                        if (option[0] === "Yes") {
                                          setPostureQst(crrqst);
                                          setPosturePopUp(true);
                                        } else {
                                          computeAns(option, crrqst);
                                        }
                                      } else {
                                        if (option === "Yes") {
                                          setPosturePopUp(true);
                                        } else {
                                          computeAns(option, crrqst);
                                        }
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
                        {crrqst.section == "AromFlex" && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      if (Array.isArray(option)) {
                                        if (option[0] === "Yes") {
                                          setAromQst(crrqst);
                                          setAromPopUp(true);
                                        } else {
                                          computeAns(option, crrqst);
                                        }
                                      } else {
                                        if (option === "Yes") {
                                          setAromPopUp(true);
                                        } else {
                                          computeAns(option, crrqst);
                                        }
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
                        {crrqst.section === "Consent" && (
                          <div className="options">
                            {crrans !== undefined && (
                              <>
                                {crrans.map((option) => (
                                  <button
                                    onClick={() => {
                                      if (Array.isArray(option)) {
                                        if (option[0] === "Yes") {
                                          computeAns(option, crrqst);
                                        } else {
                                          if (
                                            window.confirm(
                                              "All data related to assessment will be cleared?"
                                            ) === true
                                          ) {
                                            localStorage.clear();
                                            window.location.reload(false);
                                          }
                                        }
                                      } else {
                                        if (option === "Yes") {
                                          computeAns(option, crrqst);
                                        } else {
                                          computeAns(option, crrqst);
                                        }
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

            {posturePopUp && postureQst !== undefined && (
              <PostureClass
                setPosturePopUp={setPosturePopUp}
                isModalVisible={posturePopUp}
                question={postureQst}
                computeAns={computeAns}
                closeModal={() => {
                  setPosturePopUp(false);
                }}
                lvalue={crrposterType === "Front" ? 1 : 2}
              />
            )}
            {aromPopUp && aromQst !== undefined && (
              <Arom
                setAromPopUp={setAromPopUp}
                closeModal={() => {
                  setAromPopUp(false);
                }}
                question={aromQst}
                computeAns={computeAns}
                isModalVisible={aromPopUp}
                jointValue={JSON.parse(localStorage.getItem("jointValues"))}
              />
            )}
          </center>
        </>
      )}
    </>
  );
};

export default Quiz;
