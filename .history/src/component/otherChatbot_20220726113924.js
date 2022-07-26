import React, { useEffect, useState, useRef } from "react";
import { Form, Input, InputNumber, message, Button, Space, Spin } from "antd";
import AnsGif from "../assets/other.gif";
import IntroDoc from "../assets/introDoctor.webp";
import { isAuthenticated } from "../API/userAuth";
import Navigationbar from "./UtilityComponents/Navbar";
import roboDoc from "../assets/robotdoc.webp";
import "./whatsapp.css";
import { BsFillPencilFill } from "react-icons/bs";
import "./otherchatbot.css";
import Loading from "./Loading";
import { joint_questions } from "./stat";
import PostureClass from "./PostureClass";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Arom from "./Arom";
import { Link } from "react-router-dom";

const ChatBot = () => {
  const baseUrl = "https://hackathon.physioai.care/";
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
  const aromData = [
    "Please ensure your complete body is visible to camera.",
    "Once visible, White strawman Skeletal structure will get created on your image.",
    "When you are ready, and the white lines appear, pls raise your hand above the shoulder.",
    "You can follow the video for the motion.",
    "After the camera has captured your motion it will automatically shut off.",
  ];
  // let dm2 = getQuestions();
  // console.log(dm2);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("qst"))
  );
  const [response, setresponse] = useState();
  const [aromScore, setAromScore] = useState(localStorage.getItem("aromScore"));
  const [error, setError] = useState("");
  const [postureQst, setPostureQst] = useState();
  const [aromQst, setAromQst] = useState();
  const [bmi, setBmi] = useState(localStorage.getItem("bmi"));

  const [thankYou, setThankyou] = useState(false);
  const [postureDone, setPostureDone] = useState(
    JSON.parse(localStorage.getItem("postureDone"))
  );
  const [emailLoading, setEmailLoading] = useState(false);
  // const [postureAnswer, setPostureAnswer] = useState(false);

  //const [count, setCount] = useState(0);
  // useEffect(()=>{
  //   if(JSON.parse(localStorage.getItem("qst"))==null){
  //     localStorage.setItem("qst", JSON.stringify(dm))
  //   }
  // },[])
  const getQuestions = async (flag) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = flag
        ? {
            section: "Demographic",
            is_login: 1,
          }
        : {
            section: "Demographic",
            is_login: 0,
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

      let responseData = await response.json();

      localStorage.setItem(
        "demographicLength",
        localStorage.getItem("userId")
          ? responseData.length
          : parseInt(responseData.length) + 3
      );
      return responseData;
    } catch (err) {
      // console.log(err);
      return [];
    }
  };
  // const getAnswers = async () => {
  //   try {
  //     const headers = {
  //       Accept: "application/json",
  //       "Content-type": "application/json",
  //     };
  //     // const id = JSON.parse(localStorage.getItem("userId"))

  //     const encodedData = {
  //       id: parseInt(localStorage.getItem("employee_id")),
  //     };
  //     // console.log('Id:',id);
  //     const response = await fetch(
  //       "https://hackathon.physioai.care/api/get_emp_answer/",
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(encodedData),
  //       }
  //     );

  //     const responseData = await response.json();

  //     return responseData;
  //   } catch (err) {
  //     // console.log(err);
  //     return [];
  //   }
  // };

  const sendAnswers = async (section, array) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      let part = localStorage.getItem("part");
      let employee_id = localStorage.getItem("userId")
        ? parseInt(localStorage.getItem("userId"))
        : parseInt(localStorage.getItem("employee_id"));
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
          AromFlex: array.map((arr) =>
            arr.answer[0] === "Skip"
              ? [arr.question, arr.answer[0], arr.answer[1]]
              : [arr.question, JSON.parse(arr.answer[0]), arr.answer[1]]
          ),
        };
        console.log(encodedData);
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
      console.log(responseData);
      if (section === "AromFlex") {
        if (responseData.score !== 0) {
          setAromScore(responseData.score);
          localStorage.setItem("aromScore", responseData.score);
        }
      }

      return responseData;
    } catch (err) {
      // console.log(err);
      return [];
    }
  };
  async function middle(flag) {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      // const id = JSON.parse(localStorage.getItem("userId"))

      const encodedData = flag
        ? {
            part_name: localStorage.getItem("part"),
            is_login: 1,
          }
        : {
            part_name: localStorage.getItem("part"),
            is_login: 0,
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
    let responseData;
    if (localStorage.getItem("userId")) {
      responseData = await getQuestions(true);
    } else {
      responseData = [
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
        // {
        //   section: "Demographic",
        //   part_name: "General",
        //   question: "Please can I get your Email Id?",
        //   option: ["Done"],
        //   pp_qs_id: 2,
        //   type: "qst",
        //   isInput: true,
        //   id: "email",
        //   option_image: [],
        //   emoji_image: [],
        //   question_image: [],
        // },
        // {
        //   section: "Demographic",
        //   part_name: "General",
        //   question: "Please enter the OTP we have send to your email",
        //   option: ["Done"],
        //   pp_qs_id: 3,
        //   type: "qst",
        //   isInput: true,
        //   id: "otp",
        //   option_image: [],
        //   emoji_image: [],
        //   question_image: [],
        // },
      ];
    }
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
          if (localStorage.getItem("index")) {
            let b = parseInt(localStorage.getItem("index"));
            setCrrQst(JSON.parse(localStorage.getItem("qst"))[a + b]);
            setCrrAns(JSON.parse(localStorage.getItem("qst"))[a + b].option);
            setCrransquesimg(
              JSON.parse(localStorage.getItem("qst"))[a + b].question_image
            );
            setCrransoptimg(
              JSON.parse(localStorage.getItem("qst"))[a + b].option_image
            );
            setCrrAnsemoji(
              JSON.parse(localStorage.getItem("qst"))[a + b].emoji_image
            );
            setLoading(false);
            if (JSON.parse(localStorage.getItem("qst"))[a + b].posture_type) {
              setCrrposterType(
                JSON.parse(localStorage.getItem("qst"))[a + b].posture_type
              );
            }
          } else {
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
  const [generalScore, setGeneralScore] = useState(
    localStorage.getItem("generalScore")
  );
  const [painscaleScore, setPainscaleScore] = useState(
    localStorage.getItem("painscaleScore")
  );

  const [startAssesment, setStartAssesment] = useState(false);
  const [rptLoading, setRptLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [finalrptLoading, setFinalRptLoading] = useState(false);
  const [chatArr, setChatArr] = useState([]);
  const [firstname, setfirstName] = useState(
    localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("user"))["info"].first_name
      : localStorage.getItem("firstname")
  );
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
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [generateReport, setGenerateReport] = useState(false);
  const [form] = Form.useForm();
  const [cntrlArr, setCntrlArr] = useState(
    JSON.parse(localStorage.getItem("qst"))
  );
  const replaceText = (qst, rplTxt, flag, index) => {
    // console.log(qst.pp_qs_id,id)
    let ind = JSON.parse(localStorage.getItem("qst")).findIndex(
      (itm) => itm.pp_qs_id === qst.pp_qs_id
    );
    if (flag === true) {
      let txt = JSON.parse(localStorage.getItem("qst"))[
        ind + index
      ].question.replaceAll(
        JSON.parse(localStorage.getItem("qst"))[ind + index].replaceText,
        rplTxt
      );
      // console.log(JSON.parse(localStorage.getItem("qst"))[ind + 1]);
      // console.log("replace ", ind);
      // console.log("replace ", txt);
      return {
        ...JSON.parse(localStorage.getItem("qst"))[ind + index],
        question: txt,
      };
    } else {
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
    }
  };
  const messageRef = useRef();

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatArr, crrqst, rptLoading]);
  const autoCareplan = async (emp) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };

      const encodedData = {
        employee_id: emp,
      };
      const response = await fetch(
        "https://hackathon.physioai.care/api/auto_careplan/",
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
  const sendEmail = async (flag) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
      };
      //consent APi
      let emp = localStorage.getItem("userId")
        ? parseInt(localStorage.getItem("userId"))
        : parseInt(localStorage.getItem("employee_id"));
      const encodedData = flag
        ? {
            email: email,
            consent: 0,
          }
        : {
            email: email,
            consent: 1,
          };
      // console.log('Id:',id);
      const response = await fetch(
        "https://hackathon.physioai.care/api/consent/",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(encodedData),
        }
      );

      const responseData = await response.json();

      //careplan api
      if (!flag) {
        autoCareplan(emp);
      }

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
        setError("Invalid OTP entered");
        setTimeout(() => {
          document.getElementById("error").click();
        }, 1000);
      } else {
        setError("OTP Verified");
        setTimeout(() => {
          document.getElementById("success").click();
        }, 1000);
        let resp = await getQuestions(false);
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
  const getOtp = async (option, crrqst) => {
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
        setEmailLoading(false);
        setError("Email already registered");
        setTimeout(() => {
          document.getElementById("error").click();
        }, 1000);
      } else {
        setEmailLoading(false);
        computeAns(option, crrqst);
        localStorage.setItem("employee_id", responseData.employee_id);
      }
      return responseData;
    } catch (err) {
      // console.log(err);
      return [];
    }
  };
  const computeAns = async (ans, qst, flag, index) => {
    console.log(ans);
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

    if (crrqst.isInput) {
      let temp = {
        ...qst,
        answer:
          qst.id === "name"
            ? firstname + " " + lastname
            : qst.id === "bmi"
            ? ans
            : tempText
            ? tempText
            : firstname + " " + lastname,
        rply: randomWords[Math.floor(Math.random() * 5)],
      };
      setChatArr([...chatArr, temp]);
      localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      
      qst.id !== 'bmi' && setLoading(true);
      if (!localStorage.getItem("userId")) {
        if (JSON.parse(localStorage.getItem("qst")).length === 1) {
          let responseData = [
            {
              section: "Demographic",
              part_name: "General",
              question: `${firstname}, can I get your Email Id?`,
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
              question: `We would like to know it's really you ${firstname}. Please Enter the OTP recieved on your email from support@physioai.care. Kindly check the SPAM folder if you don' see it in your inbox`,
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
          localStorage.setItem(
            "qst",
            JSON.stringify([
              ...JSON.parse(localStorage.getItem("qst")),
              ...responseData,
            ])
          );
        } else if (
          parseInt(localStorage.getItem("demographicLength")) ===
          JSON.parse(localStorage.getItem("chat")).length
        ) {
          setLoading(false);
          setRptLoading(true);
          let a = [];
          let bmiScore = bmi ? bmi : ans;
          a.push(
            `Dear ${firstname}, thank you for initiating an assessment. I understand that you spend ${time} doing ${activity} activity and this leads to ${part} pain. Your BMI was assessed as ${bmiScore} and puts you in ${
              bmiScore < 18.5
                ? "Underweight"
                : bmiScore > 18.5 && bmiScore < 24.9
                ? "Normal"
                : bmiScore > 24.9 && bmiScore < 29.9
                ? "Overweight"
                : bmiScore > 29.9 && bmiScore < 34.9
                ? "Obese"
                : "Extremely Obese"
            }.`
          );
          a.push(
            `We'll Like to help you with this and for muscle strengthening & conditioning to get a better understanding of your condition and design a personalized therapy schedule.`
          );
          a.push(
            `I'd Like to know a few more details which may involve performing some action on and off camera to assess your range of motion.`
          );
          temp.rply = a;
          temp.type = "rpt";
          temp.image = true
          setChatArr([...chatArr, temp]);
          await localStorage.setItem(
            "chat",
            JSON.stringify([...chatArr, temp])
          );
          sendAnswers(
            "Demographic",
            JSON.parse(localStorage.getItem("chat")).slice(3)
          );
          for (const sec of sectionArray) {
            let responseData = await middle(
              localStorage.getItem("userId") ? true : false
            );
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
          setTimeout(async () => {
            setRptLoading(false);
          }, 1000);
        }
      }
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
      setChatArr([...chatArr, temp]);
      localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      let finalCondition =
        localStorage.getItem("index") !== null
          ? parseInt(localStorage.getItem("demographicLength")) +
            parseInt(localStorage.getItem("GeneralLength")) +
            parseInt(localStorage.getItem("PainScaleLength")) +
            parseInt(localStorage.getItem("PostureFlexLength")) +
            parseInt(localStorage.getItem("AromFlexLength")) +
            parseInt(localStorage.getItem("ConsentLength")) -
            (parseInt(localStorage.getItem("AromFlexLength")) - 1)
          : parseInt(localStorage.getItem("demographicLength")) +
            parseInt(localStorage.getItem("GeneralLength")) +
            parseInt(localStorage.getItem("PainScaleLength")) +
            parseInt(localStorage.getItem("PostureFlexLength")) +
            parseInt(localStorage.getItem("AromFlexLength")) +
            parseInt(localStorage.getItem("ConsentLength"));
      setLoading(true);
      if (
        localStorage.getItem("userId") &&
        JSON.parse(localStorage.getItem("qst")).length === 1
      ) {
        setLoading(false);
        setRptLoading(true);
        temp.rply =
          "Thank you for initiating an assesssment. We'll Like to help you with this and for muscle strengthening & conditioning to get a better understanding of your condition and design a personalized therapy schedule.";
        temp.type = "rpt";
        setChatArr([...chatArr, temp]);
        await localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        for (const sec of sectionArray) {
          let responseData = await middle(
            localStorage.getItem("userId") ? true : false
          );
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
        setTimeout(async () => {
          setRptLoading(false);
        }, 2000);
        sendAnswers("Demographic", JSON.parse(localStorage.getItem("chat")));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setScoreLoading(true);
        let a = await sendAnswers(
          "General",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength"))
          )
        );
        let scor = 100 - parseInt(a.score).toFixed();
        if (scor < 40) {
          temp.scoreType = "low";
        } else if (scor < 70) {
          temp.scoreType = "mild";
        } else if (scor > 70) {
          temp.scoreType = "high";
        }
        temp.rply = `${scor}`;
        setGeneralScore(scor);
        localStorage.setItem("generalScore", scor);
        temp.type = "score";
        let a1 = [];
        a1.push(
          `Dear ${firstname}, Based on the information you have shared and my analysis, your General score for ${part} is at ${scor}%(Higher scores indicate healthier condition).`
        );
        a1.push(
          `This puts you at a ${
            scor < 40 ? "High" : scor < 70 && scor > 40 ? "Mild" : "Low"
          } risk.`
        );
        a1.push(`Kindly share a few more details for better analysis.`);
        temp.scoreRply = a1;
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setTimeout(async () => {
          setScoreLoading(false);
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        setScoreLoading(true);
        let a = await sendAnswers(
          "PainScale",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength"))
          )
        );
        let scor = 100 - parseInt(a.score).toFixed();
        if (scor < 40) {
          temp.scoreType = "low";
        } else if (scor < 70) {
          temp.scoreType = "mild";
        } else if (scor > 70) {
          temp.scoreType = "high";
        }
        setPainscaleScore(scor);
        localStorage.setItem("painscaleScore", scor);
        temp.rply = `${scor}`;
        temp.type = "score";
        let a1 = [];
        a1.push(
          `Dear ${firstname}, Based on the information you have shared and my analysis, your PainScale score for ${part} is at ${scor}%(Higher scores indicate healthier condition).`
        );
        a1.push(
          `This puts you at a ${
            scor < 40 ? "High" : scor < 70 && scor > 40 ? "Mild" : "Low"
          } risk.`
        );
        a1.push(`Kindly share a few more details for better analysis.`);
        temp.scoreRply = a1;
        setTimeout(async () => {
          setScoreLoading(false);
          temp.arom = true;
          setChatArr([...chatArr, temp]);
          localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        }, 2000);
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
        setLoading(false);
        let a = await sendAnswers(
          "PostureFlex",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength"))
          )
        );
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
      } else if (
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) +
          parseInt(localStorage.getItem("AromFlexLength")) ===
          JSON.parse(localStorage.getItem("chat")).length &&
        localStorage.getItem("index") === null
      ) {
        console.log("arom");
        setLoading(false);
        setFinalRptLoading(true);
        let a = await sendAnswers(
          "AromFlex",
          JSON.parse(localStorage.getItem("chat")).slice(
            parseInt(localStorage.getItem("demographicLength")) +
              parseInt(localStorage.getItem("GeneralLength")) +
              parseInt(localStorage.getItem("PainScaleLength")) +
              parseInt(localStorage.getItem("PostureFlexLength"))
          )
        );
        // await getAnswers();
        temp.type = "finalrpt";

        setTimeout(async () => {
          setFinalRptLoading(false);
          if (localStorage.getItem("userId")) {
            setChatArr([...chatArr, temp]);
            localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
            setTimeout(() => {
              const array = [
                "chat",
                "qst",
                "demographicLength",
                "aromScore",
                "employee_id",
                "firstname",
                "lastname",
                "email",
                "otp",
                "part",
                "jointValues",
                "GeneralLength",
                "PainScaleLength",
                "PostureFlexLength",
                "AromFlexLength",
                "ConsentLength",
              ];
              array.forEach((a) => {
                localStorage.removeItem(a);
              });
            }, 3000);
          } else {
            temp.condition = true;
            setChatArr([...chatArr, temp]);
            localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
          }
        }, 2000);
      } else if (
        finalCondition === JSON.parse(localStorage.getItem("chat")).length
      ) {
        console.log("consent");
        setLoading(false);
        setRptLoading(true);
        sendEmail(false);
        let today = new Date();
        let date =
          (await today.getDate()) +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getFullYear();

        temp.rply = `Dear ${firstname}, Thank you for taking an assessment on ${date}. We have shared your username and password on your email. Please login to access your therapy plans`;
        temp.type = "rpt";
        temp.login = true;
        setChatArr([...chatArr, temp]);
        localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
        setRptLoading(false);
        setTimeout(() => {
          localStorage.clear();
        }, 3000);
      } else if (flag) {
        setLoading(false);
        setFinalRptLoading(true);
        temp.type = "finalrpt";
        setTimeout(async () => {
          setFinalRptLoading(false);
          if (localStorage.getItem("userId")) {
            setChatArr([...chatArr, temp]);
            localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
            setTimeout(() => {
              const array = [
                "chat",
                "qst",
                "demographicLength",
                "aromScore",
                "employee_id",
                "firstname",
                "lastname",
                "email",
                "otp",
                "part",
                "jointValues",
                "GeneralLength",
                "PainScaleLength",
                "PostureFlexLength",
                "AromFlexLength",
                "ConsentLength",
              ];
              array.forEach((a) => {
                localStorage.removeItem(a);
              });
            }, 3000);
          } else {
            temp.condition = true;
            setChatArr([...chatArr, temp]);
            localStorage.setItem("chat", JSON.stringify([...chatArr, temp]));
          }
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
          setCrrQst(
            replaceText(
              qst,
              ans,
              flag,
              parseInt(localStorage.getItem("AromFlexLength")) - index + 1
            )
          );
          if (flag === true) {
            console.log(true);
            localStorage.setItem(
              "index",
              parseInt(localStorage.getItem("AromFlexLength")) - index + 1
            );
            let a =
              parseInt(localStorage.getItem("AromFlexLength")) - index + 1;
            console.log(a, ind);
            setCrrAns(JSON.parse(localStorage.getItem("qst"))[ind + a].option);
            if (JSON.parse(localStorage.getItem("qst"))[ind + a].posture_type) {
              setCrrposterType(
                JSON.parse(localStorage.getItem("qst"))[ind + a].posture_type
              );
            }
            setCrransquesimg(
              JSON.parse(localStorage.getItem("qst"))[ind + a].question_image
            );
            setCrrAnsemoji(
              JSON.parse(localStorage.getItem("qst"))[ind + a].emoji_image
            );
            setCrransoptimg(
              JSON.parse(localStorage.getItem("qst"))[ind + a].option_image
            );
          } else {
            localStorage.removeItem("index");
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
        }
      }, 2000);
      // }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      document.getElementById("doneForm").click();
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
    return <img src={baseUrl + src} width="40" height="40" />;
  };

  const getBmi = (crrqst) => {
    let bmi;
    let meterHeight = parseInt(height) / 100;
    console.log(meterHeight);
    let meterSquare = meterHeight * meterHeight;
    console.log(meterSquare);
    bmi = parseInt(weight) / meterSquare;
    setBmi(bmi.toFixed(2));
    localStorage.setItem("bmi", bmi.toFixed(2));
    computeAns(bmi.toFixed(2), crrqst);
    return [];
  };

  const noConsent = (ans, qst) => {
    let temp = {
      ...qst,
      answer: ans,
    };
    setLoading(false);
    setRptLoading(true);
    temp.type = "rpt";
    temp.rply =
      "Thank you for taking an assessment. We have not created therapy plan for you as you have not agreed with our terms and condition. ";
    setChatArr([...chatArr, temp]);
    setCrrQst({});
    setCrrAns([]);
    setCrrposterType("");
    setCrransquesimg([]);
    setCrrAnsemoji([]);
    setCrransoptimg([]);
    sendEmail(true);
    setRptLoading(false);
    setTimeout(() => {
      localStorage.clear();
    }, 3000);
  };
  return (
    <>
      {startAssesment === false ? (
        <>
          <Navigationbar />
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
                localStorage.setItem("startAssesment", true);
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
                  fontSize: "14px",
                  marginTop: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (localStorage.getItem("userId")) {
                    const array = [
                      "chat",
                      "qst",
                      "demographicLength",
                      "aromScore",
                      "employee_id",
                      "firstname",
                      "lastname",
                      "email",
                      "otp",
                      "part",
                      "jointValues",
                      "GeneralLength",
                      "PainScaleLength",
                      "PostureFlexLength",
                      "AromFlexLength",
                      "ConsentLength",
                    ];
                    array.forEach((a) => {
                      localStorage.removeItem(a);
                    });
                  } else {
                    localStorage.clear();
                  }
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
          {/* <Navbar assesment={true} /> */}
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
          <div className="chat">
            <div className="chat-container">
              <div id="call" className="user-bar">
                <div
                  class="back"
                  onClick={() => {
                    setStartAssesment(false);
                    localStorage.setItem("startAssesment", false);
                  }}
                >
                  <i class="zmdi zmdi-arrow-left"></i>
                </div>
                <div className="avatar">
                  <img src={roboDoc} alt="Avatar" />
                </div>
                <div className="name">
                  <span id="name">Dr.PhyBot</span>
                  {loading ? (
                    <span className="status">Typing....</span>
                  ) : (
                    <span className="status">Online</span>
                  )}
                </div>
              </div>
              <div className="conversation">
                <div className="conversation-container">
                  <div style={{ marginTop: "90px" }} ref={messageRef}>
                    {/* <h2>Your Health Assessment</h2> */}
                    {localStorage.getItem("userId") && (
                      <div className="minBoxlocal">
                        <div
                          className="outercard "
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div className="card-details">
                            <div className="skills">
                              <div className="value">
                                Hello, This is your Dr. PhyBOT! Thank you for
                                your interest in doing another assessment. You
                                can visit your previous assessments here.
                              </div>
                              <div className="value">
                                If you believe conditions have changed and you
                                would like another assessment. I would be happy
                                to engage in a conversation with you
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="question__body">
                      {chatArr !== [] &&
                        chatArr.length > 0 &&
                        chatArr.map((item, index) => (
                          <>
                            {item.id !== "bmi" && (
                              <>
                                <div className="question">
                                  <p>{item.question}</p>
                                </div>

                                <div className="action">
                                  <button
                                    className={
                                      loading === false &&
                                      index + 1 === chatArr.length &&
                                      item.id !== "part" &&
                                      item.section !== "Consent" &&
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
                                        item.answer[0] !== "Skip" ? (
                                          <img
                                            src={item.answer[0]}
                                            width={200}
                                            height={200}
                                          />
                                        ) : (
                                          <>
                                            {item.section === "AromFlex" &&
                                            item.answer[0] !== "Skip" ? (
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

                                    {loading === false &&
                                      index + 1 === chatArr.length &&
                                      item.id !== "part" &&
                                      item.section !== "Consent" &&
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
                                    <>
                                      <div className="in">
                                        {loading &&
                                          index + 1 === chatArr.length && (
                                            <>
                                              <div
                                                className="formp"
                                                style={{ padding: "10px" }}
                                              >
                                                <Loading flag={false} />
                                                {/* <img className="formp" src='https://cdn.dribbble.com/users/1415337/screenshots/10781083/loadingdots2.gif' width={100} height={50} /> */}
                                              </div>
                                            </>
                                          )}
                                      </div>
                                    </>
                                  )}
                                {/* report */}
                                
                                {item.type === "score" && (
                                  <>
                                    {scoreLoading ? (
                                      <>
                                        <Space
                                          size="large"
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Spin
                                            size="large"
                                            tip="Loading Results..."
                                          />
                                        </Space>
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
                                          style={{
                                            width: 200,
                                            height: 200,
                                            margin: "auto",
                                          }}
                                        >
                                          <CircularProgressbar
                                            className="percentage"
                                            text={`${item.rply}%`}
                                            value={parseInt(item.rply)}
                                            styles={buildStyles({
                                              // Text size
                                              textSize: "16px",
                                              // Colors
                                              pathColor:
                                                item.scoreType === "high"
                                                  ? `#008450`
                                                  : item.scoreType === "mild"
                                                  ? "#EFB700"
                                                  : "rgb(208, 42, 42)",
                                              textColor:
                                                item.scoreType === "high"
                                                  ? `#008450`
                                                  : item.scoreType === "mild"
                                                  ? "#EFB700"
                                                  : "rgb(208, 42, 42)",
                                              trailColor: "gray",
                                              backgroundColor: "#3e98c7",
                                            })}
                                          />
                                        </div>
                                        <div className="scoreMessage">
                                          {Array.isArray(item.scoreRply) ? (
                                            <>
                                              {item.scoreRply.map((rply) => (
                                                <div className="value">
                                                  {rply}
                                                </div>
                                              ))}
                                            </>
                                          ) : (
                                            <>
                                              <p className="value">
                                                {item.scoreRply}
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                                {item.type === "finalrpt" && (
                                  <>
                                    {finalrptLoading ? (
                                      <>
                                        <Space
                                          size="large"
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Spin
                                            size="large"
                                            tip="Loading Results..."
                                          />
                                        </Space>
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
                                            Your {part} General Health Score is:{" "}
                                            {generalScore}%
                                          </span>
                                          <br />
                                          <span className="finalValue">
                                            Your {part} PainScale Health Score is:{" "}
                                            {painscaleScore}%
                                          </span>
                                          <br />
                                          {chatArr.map((item, index) => (
                                            <>
                                              {item.section ===
                                                "PostureFlex" && (
                                                <>
                                                  {item.answer[0] !==
                                                    "Skip" && <></>}
                                                </>
                                              )}
                                            </>
                                          ))}
                                          {postureDone && (
                                            <div className="finalValue">
                                              The following is my observation
                                              about your Posture:
                                            </div>
                                          )}
                                          {postureDone && (
                                            <div className="finalValue">
                                              Your posture deviations can be
                                              seen in the attached image and are
                                              explained in the table.
                                            </div>
                                          )}
                                          {postureDone && (
                                            <ul style={{ marginLeft: "-19px" }}>
                                              <li>
                                                Green lines indicate the ideal
                                                posture and Red lines indicate
                                                your current posture.
                                              </li>
                                              <li>
                                                The difference is shown as the
                                                angle of deviation at certain
                                                points in the table.
                                              </li>
                                              <li>
                                                Any deviation of over 5* should
                                                be worked on for correction.
                                              </li>
                                              <li>
                                                Posture check is a measurement
                                                at a point in time. You should
                                                ensure your posture is correct
                                                through the day and remain
                                                aligned with the green lines.
                                              </li>
                                            </ul>
                                          )}
                                          {aromScore && !postureDone && (
                                            <div className="finalValue">
                                              You chose not to undertake a
                                              Posture test. Hence I can not give
                                              details for the Posture
                                              correctness.
                                            </div>
                                          )}
                                          {!postureDone && !aromScore && (
                                            <div className="finalValue">
                                              You chose not to undertake a
                                              Posture and AROM test. Hence I can
                                              not give details for the Posture
                                              correctness and Joint Flexibility.
                                            </div>
                                          )}
                                        </div>
                                        {chatArr.map((item, index) => (
                                          <>
                                            {item.section === "PostureFlex" && (
                                              <>
                                                {item.answer[0] !== "Skip" && (
                                                  <>
                                                    <div className="imgcards">
                                                      <img
                                                        src={`${item.answer[0]}`}
                                                        style={{
                                                          margin: "auto",
                                                          marginBottom: "10px",
                                                        }}
                                                        className="showImgs"
                                                      />
                                                      <table className="showImgs">
                                                        <tr>
                                                          <th></th>
                                                          <th>Deviation</th>
                                                        </tr>
                                                        {item.answer[1].map(
                                                          (i) => (
                                                            <tbody>
                                                              <tr>
                                                                <td>
                                                                  {i.label}
                                                                </td>
                                                                <td>
                                                                  {i.angle}
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          )
                                                        )}
                                                      </table>
                                                    </div>{" "}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                        ))}

                                        <br />
                                        <div className="finalskills">
                                          <span className="finalValue">
                                            {aromScore &&
                                              `Your ${part} Join Flexibility as
                                              per the assessment is :
                                              ${aromScore}`}
                                            {!aromScore &&
                                              postureDone &&
                                              "You chose not to undertake a AROM test. Hence I can not give details for the Joint Flexibility."}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}

                                {item.arom === true && (
                                  <>
                                    <div className="othercard">
                                      <div className="card-details">
                                        <div
                                          className="skills"
                                          style={{ textAlign: "left" }}
                                        >
                                          <div className="value">
                                            Next, you would be required to
                                            perform a few assessments in-front
                                            of the camera. We ensure privacy and
                                            don't record the videos. We'll
                                            assess your motion and share the
                                            analysis.
                                          </div>
                                          <ul style={{ marginLeft: "-19px" }}>
                                            <li>
                                              Please ensure your complete body
                                              is visible to camera.
                                            </li>
                                            <li>
                                              Once visible, White strawman
                                              Skeletal structure will get
                                              created on your image.
                                            </li>
                                            <li>
                                              When you are ready, and the white
                                              lines appear, pls raise your hand
                                              above the shoulder.
                                            </li>
                                            <li>
                                              You can follow the video for the
                                              motion.
                                            </li>
                                            <li>
                                              After the camera has captured your
                                              motion it will automatically shut
                                              off.
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {item.condition === true && (
                                  <>
                                    <div className="othercard">
                                      <div className="card-details">
                                        <div
                                          className="skills"
                                          style={{ textAlign: "left" }}
                                        >
                                          <ul style={{ marginLeft: "-19px" }}>
                                            <li>
                                              For any posture deviation, more
                                              than 10* and reduction in
                                              flexibility of the joint with
                                              flexibility assessed as
                                              “Impaired”, the person should seek
                                              clinical examination with a
                                              trained Physiotherapist.
                                            </li>
                                            <li>
                                              For other categories, the person
                                              can take charge of the posture
                                              correction and increase in the
                                              strength and flexibility of the
                                              muscles by religiously following
                                              the exercise plan suggested.
                                            </li>
                                            <li>
                                              At any point in time, if any
                                              exercise leads to pain or any
                                              other discomfort in the body, you
                                              should immediately stop and seek
                                              clinical assistance. You can
                                              schedule a TeleTherapy call with
                                              our therapist,{" "}
                                              <a
                                                href={baseUrl + "/login"}
                                                target="_blank"
                                                rel="noopener"
                                              >
                                                Here
                                              </a>
                                              .
                                            </li>
                                            <li>
                                              Based on the assessment, we
                                              recommend creation of a short
                                              therapy plan for you. Please
                                              provide your acceptance for the
                                              terms and next steps. You can
                                              refer to{" "}
                                              <a
                                                href={baseUrl + "/terms"}
                                                target="_blank"
                                                rel="noopener"
                                              >
                                                Terms and Conditions
                                              </a>
                                              . We are here to help you and take
                                              you on a path of recovery and
                                              muscle strength
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                            {item.type === "rpt" && (
                                  <>
                                    {rptLoading ? (
                                      <>
                                        <Space
                                          size="large"
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Spin
                                            size="large"
                                            tip="Loading Results..."
                                          />
                                        </Space>
                                      </>
                                    ) : (
                                      <div className="card">
                                        <div className="card-details">
                                          <div className="skills">
                                            {Array.isArray(item.rply) ? (
                                              <>
                                                {item.rply.map((rply) => (
                                                  <p className="value">
                                                    {rply}
                                                  </p>
                                                ))}
                                              </>
                                            ) : (
                                              <>
                                                <p className="value">
                                                  {item.rply}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                          {item.image === true && <img src="data:image/jpeg;base64,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" width={100}  height={100}/> 
                                          {item.login === true && (
                                            <Link
                                              style={{
                                                textDecoration: "none",
                                                fontSize: "15px",
                                                display: "flex",
                                                justifyContent: "center",
                                              }}
                                              onClick={() => {
                                                localStorage.clear();
                                              }}
                                              to="/login"
                                              // rel="noopener noreferrer"
                                            >
                                              Go to Login Page {">>"}
                                            </Link>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                          </>
                        ))}

                      {Object.keys(crrqst).length > 0 && (
                        <>
                          {crrqst.id !== "bmi" && (
                            <Form>
                              <div className="question">
                                <div
                                  style={{
                                    backgroundColor: "#ffff",
                                    padding: "2%",
                                  }}
                                  className="formp"
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
                                          src={baseUrl + crransquesimg[0]}
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
                                    <div id="form" class="conversation-compose">
                                      {/* <input id="val" class="input-msg" name="input" placeholder="Type a message" autocomplete="off" autofocus></input> */}
                                      {crrqst.isInput && (
                                        <>
                                          {crrqst.id === "name" ? (
                                            <>
                                              <Input
                                                required
                                                placeholder="First Name"
                                                onKeyPress={handleKeyDown}
                                                onChange={(e) => {
                                                  if (crrqst.id === "name") {
                                                    setfirstName(
                                                      e.target.value
                                                    );
                                                    localStorage.setItem(
                                                      "firstname",
                                                      e.target.value
                                                    );
                                                  }
                                                }}
                                                value={firstname}
                                                id="val"
                                                className="input-msg"
                                                style={{
                                                  margin: "auto",
                                                  marginTop: "13px",
                                                  border:
                                                    "2px solid black !important",
                                                  backgroundColor:
                                                    "rgba(243, 246, 255, 0.985) !important",
                                                }}
                                              />
                                              <Input
                                                required
                                                placeholder="Last Name"
                                                value={lastname}
                                                onKeyPress={handleKeyDown}
                                                onChange={(e) => {
                                                  if (crrqst.id === "name") {
                                                    setlastName(e.target.value);
                                                    localStorage.setItem(
                                                      "lastname",
                                                      e.target.value
                                                    );
                                                  }
                                                }}
                                                id="val"
                                                className="input-msg"
                                                style={{
                                                  margin: "auto",
                                                  marginTop: "13px",
                                                  border:
                                                    "2px solid black !important",
                                                  backgroundColor:
                                                    "rgba(243, 246, 255, 0.985) !important",
                                                }}
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
                                                    placeholder={
                                                      crrqst.id === "weight"
                                                        ? "Weight"
                                                        : "Height"
                                                    }
                                                    onKeyPress={handleKeyDown}
                                                    value={
                                                      crrqst.id === "weight"
                                                        ? weight
                                                        : height
                                                    }
                                                    min={5}
                                                    onChange={(e) => {
                                                      setTempText(
                                                        e.target.value
                                                      );
                                                      if (
                                                        crrqst.id === "height"
                                                      ) {
                                                        setHeight(
                                                          e.target.value
                                                        );
                                                        localStorage.setItem(
                                                          "height",
                                                          e
                                                        );
                                                      }
                                                      if (
                                                        crrqst.id === "weight"
                                                      ) {
                                                        setWeight(
                                                          e.target.value
                                                        );
                                                        localStorage.setItem(
                                                          "weight",
                                                          e
                                                        );
                                                      }
                                                    }}
                                                    // className="inptNo"
                                                    style={{
                                                      margin: "auto",
                                                      marginTop: "13px",
                                                      border:
                                                        "2px solid black !important",
                                                      backgroundColor:
                                                        "rgba(243, 246, 255, 0.985) !important",
                                                    }}
                                                    id="val"
                                                    className="input-msg"
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <Input
                                                    required
                                                    placeholder={
                                                      crrqst.id === "email"
                                                        ? "Email"
                                                        : "OTP"
                                                    }
                                                    value={
                                                      crrqst.id === "email"
                                                        ? email
                                                        : otp
                                                    }
                                                    onKeyPress={handleKeyDown}
                                                    onChange={(e) => {
                                                      setTempText(
                                                        e.target.value
                                                      );
                                                      if (
                                                        crrqst.id === "email"
                                                      ) {
                                                        setEmail(
                                                          e.target.value
                                                        );
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
                                                    }}
                                                    id="val"
                                                    className="input-msg"
                                                    style={{
                                                      margin: "auto",
                                                      marginTop: "13px",
                                                      border:
                                                        "2px solid black !important",
                                                      backgroundColor:
                                                        "rgba(243, 246, 255, 0.985) !important",
                                                    }}
                                                  />
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {![
                                        "PostureFlex",
                                        "AromFlex",
                                        "Consent",
                                      ].includes(crrqst.section) && (
                                        <>
                                          {crransoptimg !== undefined &&
                                            crrans !== undefined &&
                                            crransemoji !== undefined && (
                                              <>
                                                {crransemoji.length === 0 && (
                                                  <>
                                                    {crrans.map(
                                                      (option, index) => (
                                                        <>
                                                          {crrqst.isInput && (
                                                            <span class="send">
                                                              <div
                                                                class="circle"
                                                                id="doneForm"
                                                                onClick={async () => {
                                                                  if (
                                                                    firstname !==
                                                                      null &&
                                                                    lastname !==
                                                                      null
                                                                  ) {
                                                                    if (
                                                                      tempText.length >
                                                                        0 ||
                                                                      (firstname.length >
                                                                        0 &&
                                                                        lastname.length >
                                                                          0)
                                                                    ) {
                                                                      if (
                                                                        crrqst.id ===
                                                                        "name"
                                                                      ) {
                                                                        if (
                                                                          firstname.length <
                                                                            3 ||
                                                                          lastname.length <
                                                                            3
                                                                        ) {
                                                                          setError(
                                                                            "First and Last Name should contain atleast 3 characters"
                                                                          );
                                                                          setTimeout(
                                                                            () => {
                                                                              document
                                                                                .getElementById(
                                                                                  "error"
                                                                                )
                                                                                .click();
                                                                            },
                                                                            1000
                                                                          );
                                                                        } else {
                                                                          computeAns(
                                                                            option,
                                                                            crrqst
                                                                          );
                                                                        }
                                                                      } else if (
                                                                        crrqst.id ===
                                                                        "email"
                                                                      ) {
                                                                        if (
                                                                          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                                                            email
                                                                          )
                                                                        ) {
                                                                          setEmailLoading(
                                                                            true
                                                                          );
                                                                          getOtp(
                                                                            option,
                                                                            crrqst
                                                                          );
                                                                        } else {
                                                                          setError(
                                                                            "Invalid Email Id"
                                                                          );
                                                                          setTimeout(
                                                                            () => {
                                                                              document
                                                                                .getElementById(
                                                                                  "error"
                                                                                )
                                                                                .click();
                                                                            },
                                                                            1000
                                                                          );
                                                                        }
                                                                      } else if (
                                                                        crrqst.id ===
                                                                        "otp"
                                                                      ) {
                                                                        let a =
                                                                          await sendOtp();
                                                                        // console.log(a);
                                                                        if (
                                                                          a.status_code !==
                                                                            300 &&
                                                                          a.status_code !==
                                                                            400
                                                                        ) {
                                                                          computeAns(
                                                                            option,
                                                                            crrqst
                                                                          );
                                                                        }
                                                                      } else if (
                                                                        crrqst.id ===
                                                                        "weight"
                                                                      ) {
                                                                        if (
                                                                          weight !==
                                                                          null
                                                                        ) {
                                                                          computeAns(
                                                                            option,
                                                                            crrqst
                                                                          );
                                                                        } else {
                                                                          setError(
                                                                            "Please enter your weight"
                                                                          );
                                                                          setTimeout(
                                                                            () => {
                                                                              document
                                                                                .getElementById(
                                                                                  "error"
                                                                                )
                                                                                .click();
                                                                            },
                                                                            1000
                                                                          );
                                                                        }
                                                                      } else if (
                                                                        crrqst.id ===
                                                                        "height"
                                                                      ) {
                                                                        if (
                                                                          height !==
                                                                          null
                                                                        ) {
                                                                          computeAns(
                                                                            option,
                                                                            crrqst
                                                                          );
                                                                        } else {
                                                                          setError(
                                                                            "Please enter your height"
                                                                          );
                                                                          setTimeout(
                                                                            () => {
                                                                              document
                                                                                .getElementById(
                                                                                  "error"
                                                                                )
                                                                                .click();
                                                                            },
                                                                            1000
                                                                          );
                                                                        }
                                                                      } else {
                                                                        if (
                                                                          crrqst.id ===
                                                                          "activity"
                                                                        ) {
                                                                          setActivity(
                                                                            option
                                                                          );
                                                                          localStorage.setItem(
                                                                            "activity",
                                                                            option
                                                                          );
                                                                        }
                                                                        if (
                                                                          crrqst.id ===
                                                                          "time"
                                                                        ) {
                                                                          setTime(
                                                                            option
                                                                          );
                                                                          localStorage.setItem(
                                                                            "time",
                                                                            option
                                                                          );
                                                                        }
                                                                        if (
                                                                          crrqst.id ===
                                                                          "part"
                                                                        ) {
                                                                          setPart(
                                                                            option
                                                                          );
                                                                          let joinPart =
                                                                            option.replace(
                                                                              "/",
                                                                              ""
                                                                            );
                                                                          joinPart =
                                                                            joinPart.replaceAll(
                                                                              " ",
                                                                              ""
                                                                            );
                                                                          let joint =
                                                                            jointPoints[
                                                                              joinPart
                                                                            ];
                                                                          localStorage.setItem(
                                                                            "jointValues",
                                                                            JSON.stringify(
                                                                              joint
                                                                            )
                                                                          );
                                                                          localStorage.setItem(
                                                                            "part",
                                                                            option
                                                                          );
                                                                        }
                                                                        if (
                                                                          crrqst.id ===
                                                                          "gender"
                                                                        ) {
                                                                          setGender(
                                                                            option
                                                                          );
                                                                          localStorage.setItem(
                                                                            "gender",
                                                                            option
                                                                          );
                                                                        }
                                                                        if (
                                                                          crrqst.id ===
                                                                          "age"
                                                                        ) {
                                                                          setAge(
                                                                            option
                                                                          );
                                                                          localStorage.setItem(
                                                                            "age",
                                                                            option
                                                                          );
                                                                        }
                                                                        computeAns(
                                                                          option,
                                                                          crrqst
                                                                        );
                                                                      }
                                                                    }
                                                                  }
                                                                  if (
                                                                    localStorage.getItem(
                                                                      "userId"
                                                                    )
                                                                  ) {
                                                                    if (
                                                                      crrqst.id ===
                                                                      "part"
                                                                    ) {
                                                                      setPart(
                                                                        option
                                                                      );
                                                                      let joinPart =
                                                                        option.replace(
                                                                          "/",
                                                                          ""
                                                                        );
                                                                      joinPart =
                                                                        joinPart.replaceAll(
                                                                          " ",
                                                                          ""
                                                                        );
                                                                      let joint =
                                                                        jointPoints[
                                                                          joinPart
                                                                        ];
                                                                      localStorage.setItem(
                                                                        "jointValues",
                                                                        JSON.stringify(
                                                                          joint
                                                                        )
                                                                      );
                                                                      localStorage.setItem(
                                                                        "part",
                                                                        option
                                                                      );
                                                                      // computeAns(option, crrqst);
                                                                    }
                                                                    computeAns(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  }
                                                                }}
                                                              >
                                                                <i
                                                                  id="msend"
                                                                  class="zmdi zmdi-mail-send"
                                                                ></i>
                                                              </div>
                                                            </span>
                                                          )}
                                                        </>
                                                      )
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            )}
                                        </>
                                      )}
                                    </div>
                                  )}

                                  {![
                                    "PostureFlex",
                                    "AromFlex",
                                    "Consent",
                                  ].includes(crrqst.section) && (
                                    <div className="options">
                                      {crransoptimg !== undefined &&
                                        crrans !== undefined &&
                                        crransemoji !== undefined && (
                                          <>
                                            {!crrqst.isInput && (
                                              <>
                                                {crransemoji.length === 0 ? (
                                                  <>
                                                    {crrans.map(
                                                      (option, index) => (
                                                        <button
                                                          onClick={async () => {
                                                            if (
                                                              firstname !==
                                                                null &&
                                                              lastname !== null
                                                            ) {
                                                              if (
                                                                tempText.length >
                                                                  0 ||
                                                                (firstname.length >
                                                                  0 &&
                                                                  lastname.length >
                                                                    0)
                                                              ) {
                                                                if (
                                                                  crrqst.id ===
                                                                  "name"
                                                                ) {
                                                                  if (
                                                                    firstname.length <
                                                                      3 ||
                                                                    lastname.length <
                                                                      3
                                                                  ) {
                                                                    setError(
                                                                      "First and Last Name should contain atleast 3 characters"
                                                                    );
                                                                    setTimeout(
                                                                      () => {
                                                                        document
                                                                          .getElementById(
                                                                            "error"
                                                                          )
                                                                          .click();
                                                                      },
                                                                      1000
                                                                    );
                                                                  } else {
                                                                    computeAns(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  }
                                                                } else if (
                                                                  crrqst.id ===
                                                                  "email"
                                                                ) {
                                                                  if (
                                                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                                                                      email
                                                                    )
                                                                  ) {
                                                                    setEmailLoading(
                                                                      true
                                                                    );
                                                                    getOtp(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  } else {
                                                                    setError(
                                                                      "Invalid Email Id"
                                                                    );
                                                                    setTimeout(
                                                                      () => {
                                                                        document
                                                                          .getElementById(
                                                                            "error"
                                                                          )
                                                                          .click();
                                                                      },
                                                                      1000
                                                                    );
                                                                  }
                                                                } else if (
                                                                  crrqst.id ===
                                                                  "otp"
                                                                ) {
                                                                  let a =
                                                                    await sendOtp();
                                                                  // console.log(a);
                                                                  if (
                                                                    a.status_code !==
                                                                      300 &&
                                                                    a.status_code !==
                                                                      400
                                                                  ) {
                                                                    computeAns(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  }
                                                                } else if (
                                                                  crrqst.id ===
                                                                  "weight"
                                                                ) {
                                                                  if (
                                                                    weight !==
                                                                    null
                                                                  ) {
                                                                    computeAns(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  } else {
                                                                    setError(
                                                                      "Please enter your weight"
                                                                    );
                                                                    setTimeout(
                                                                      () => {
                                                                        document
                                                                          .getElementById(
                                                                            "error"
                                                                          )
                                                                          .click();
                                                                      },
                                                                      1000
                                                                    );
                                                                  }
                                                                } else if (
                                                                  crrqst.id ===
                                                                  "height"
                                                                ) {
                                                                  if (
                                                                    height !==
                                                                    null
                                                                  ) {
                                                                    computeAns(
                                                                      option,
                                                                      crrqst
                                                                    );
                                                                  } else {
                                                                    setError(
                                                                      "Please enter your height"
                                                                    );
                                                                    setTimeout(
                                                                      () => {
                                                                        document
                                                                          .getElementById(
                                                                            "error"
                                                                          )
                                                                          .click();
                                                                      },
                                                                      1000
                                                                    );
                                                                  }
                                                                } else {
                                                                  if (
                                                                    crrqst.id ===
                                                                    "activity"
                                                                  ) {
                                                                    setActivity(
                                                                      option
                                                                    );
                                                                    localStorage.setItem(
                                                                      "activity",
                                                                      option
                                                                    );
                                                                  }
                                                                  if (
                                                                    crrqst.id ===
                                                                    "time"
                                                                  ) {
                                                                    setTime(
                                                                      option
                                                                    );
                                                                    localStorage.setItem(
                                                                      "time",
                                                                      option
                                                                    );
                                                                  }
                                                                  if (
                                                                    crrqst.id ===
                                                                    "part"
                                                                  ) {
                                                                    setPart(
                                                                      option
                                                                    );
                                                                    let joinPart =
                                                                      option.replace(
                                                                        "/",
                                                                        ""
                                                                      );
                                                                    joinPart =
                                                                      joinPart.replaceAll(
                                                                        " ",
                                                                        ""
                                                                      );
                                                                    let joint =
                                                                      jointPoints[
                                                                        joinPart
                                                                      ];
                                                                    localStorage.setItem(
                                                                      "jointValues",
                                                                      JSON.stringify(
                                                                        joint
                                                                      )
                                                                    );
                                                                    localStorage.setItem(
                                                                      "part",
                                                                      option
                                                                    );
                                                                  }
                                                                  if (
                                                                    crrqst.id ===
                                                                    "gender"
                                                                  ) {
                                                                    setGender(
                                                                      option
                                                                    );
                                                                    localStorage.setItem(
                                                                      "gender",
                                                                      option
                                                                    );
                                                                  }
                                                                  if (
                                                                    crrqst.id ===
                                                                    "age"
                                                                  ) {
                                                                    setAge(
                                                                      option
                                                                    );
                                                                    localStorage.setItem(
                                                                      "age",
                                                                      option
                                                                    );
                                                                  }
                                                                  computeAns(
                                                                    option,
                                                                    crrqst
                                                                  );
                                                                }
                                                              }
                                                            }
                                                            if (
                                                              localStorage.getItem(
                                                                "userId"
                                                              )
                                                            ) {
                                                              if (
                                                                crrqst.id ===
                                                                "part"
                                                              ) {
                                                                setPart(option);
                                                                let joinPart =
                                                                  option.replace(
                                                                    "/",
                                                                    ""
                                                                  );
                                                                joinPart =
                                                                  joinPart.replaceAll(
                                                                    " ",
                                                                    ""
                                                                  );
                                                                let joint =
                                                                  jointPoints[
                                                                    joinPart
                                                                  ];
                                                                localStorage.setItem(
                                                                  "jointValues",
                                                                  JSON.stringify(
                                                                    joint
                                                                  )
                                                                );
                                                                localStorage.setItem(
                                                                  "part",
                                                                  option
                                                                );
                                                                // computeAns(option, crrqst);
                                                              }
                                                              computeAns(
                                                                option,
                                                                crrqst
                                                              );
                                                            }
                                                          }}
                                                          type="submit"
                                                          className="option"
                                                          key={option}
                                                        >
                                                          <>
                                                            {crransoptimg.length >
                                                            0 ? (
                                                              <>
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    justifyContent:
                                                                      "center",
                                                                    alignItems:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  {Array.isArray(
                                                                    option
                                                                  )
                                                                    ? option[0]
                                                                    : option}
                                                                  <img
                                                                    src={
                                                                      baseUrl +
                                                                      crransoptimg[
                                                                        index
                                                                      ]
                                                                    }
                                                                    style={{
                                                                      width:
                                                                        "80%",
                                                                      height:
                                                                        "170px",
                                                                    }}
                                                                  />
                                                                </div>
                                                              </>
                                                            ) : (
                                                              <>
                                                                {Array.isArray(
                                                                  option
                                                                )
                                                                  ? option[0]
                                                                  : option}
                                                              </>
                                                            )}
                                                          </>
                                                        </button>
                                                      )
                                                    )}
                                                  </>
                                                ) : (
                                                  <>
                                                    {crransemoji.map(
                                                      (option, index) => (
                                                        <button
                                                          onClick={() => {
                                                            //    console.log("chat ")

                                                            for (
                                                              let i = 0;
                                                              i <=
                                                              crrans.length;
                                                              i++
                                                            ) {
                                                              if (i === index) {
                                                                computeAns(
                                                                  crrans[i],
                                                                  crrqst
                                                                );
                                                              }
                                                            }
                                                          }}
                                                          type="submit"
                                                          className="option"
                                                          key={option}
                                                        >
                                                          <img
                                                            src={
                                                              baseUrl + option
                                                            }
                                                            width="40"
                                                            height="40"
                                                          />
                                                        </button>
                                                      )
                                                    )}
                                                  </>
                                                )}
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
                                                  if (option[0] === "Capture") {
                                                    setPostureQst(crrqst);
                                                    setPosturePopUp(true);
                                                  } else {
                                                    if (
                                                      window.confirm(
                                                        "AROM & Posture Check enable real time assessment of joint flexibility and lifestyle induced postural problems. Privacy is ensured as no video is recorded and only joint data is stored. Are you sure you would not like to go ahead with an in depth analysis of your problem?"
                                                      ) === true
                                                    ) {
                                                      computeAns(
                                                        option,
                                                        crrqst
                                                      );
                                                    }
                                                  }
                                                } else {
                                                  if (option === "Capture") {
                                                    setPosturePopUp(true);
                                                  } else {
                                                    if (
                                                      window.confirm(
                                                        "AROM & Posture Check enable real time assessment of joint flexibility and lifestyle induced postural problems. Privacy is ensured as no video is recorded and only joint data is stored. Are you sure you would not like to go ahead with an in depth analysis of your problem?"
                                                      ) === true
                                                    ) {
                                                      computeAns(
                                                        option,
                                                        crrqst
                                                      );
                                                    }
                                                  }
                                                }
                                              }}
                                              type="submit"
                                              className="option"
                                              key={option}
                                            >
                                              {Array.isArray(option)
                                                ? option[0]
                                                : option}
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
                                          {parseInt(
                                            localStorage.getItem(
                                              "demographicLength"
                                            )
                                          ) +
                                            parseInt(
                                              localStorage.getItem(
                                                "GeneralLength"
                                              )
                                            ) +
                                            parseInt(
                                              localStorage.getItem(
                                                "PainScaleLength"
                                              )
                                            ) +
                                            parseInt(
                                              localStorage.getItem(
                                                "PostureFlexLength"
                                              )
                                            ) ===
                                          JSON.parse(
                                            localStorage.getItem("chat")
                                          ).length ? (
                                            <>
                                              {crrans.map((option, index) => (
                                                <button
                                                  onClick={() => {
                                                    console.log(index);
                                                    if (Array.isArray(option)) {
                                                      if (
                                                        option[0] === "Capture"
                                                      ) {
                                                        setAromQst(crrqst);
                                                        setAromPopUp(true);
                                                      } else {
                                                        if (
                                                          window.confirm(
                                                            "AROM & Posture Check enable real time assessment of joint flexibility and lifestyle induced postural problems. Privacy is ensured as no video is recorded and only joint data is stored. Are you sure you would not like to go ahead with an in depth analysis of your problem?"
                                                          ) === true
                                                        ) {
                                                          localStorage.removeItem(
                                                            "aromScore"
                                                          );
                                                          setAromScore(null);
                                                          computeAns(
                                                            option,
                                                            crrqst,
                                                            true,
                                                            index
                                                          );
                                                        }
                                                      }
                                                    } else {
                                                      if (
                                                        option === "Capture"
                                                      ) {
                                                        setAromPopUp(true);
                                                      } else {
                                                        if (
                                                          window.confirm(
                                                            "AROM & Posture Check enable real time assessment of joint flexibility and lifestyle induced postural problems. Privacy is ensured as no video is recorded and only joint data is stored. Are you sure you would not like to go ahead with an in depth analysis of your problem?"
                                                          ) === true
                                                        ) {
                                                          localStorage.removeItem(
                                                            "aromScore"
                                                          );
                                                          setAromScore(null);
                                                          computeAns(
                                                            option,
                                                            crrqst,
                                                            true,
                                                            index
                                                          );
                                                        }
                                                      }
                                                    }
                                                  }}
                                                  type="submit"
                                                  className="option"
                                                  key={option}
                                                >
                                                  {Array.isArray(option)
                                                    ? option[0]
                                                    : option}
                                                </button>
                                              ))}
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => {
                                                  setAromQst(crrqst);
                                                  setAromPopUp(true);
                                                }}
                                                type="submit"
                                                className="option"
                                                key={["Capture", 10]}
                                              >
                                                Capture
                                              </button>
                                            </>
                                          )}
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
                                                        "You have selected Not to go ahead with creation of an exercise plan or arrange a call with the therapist. After having taken an assessment, we suggest you proceed with these steps to get your best physical self. Would you like to agree to the terms & conditions and proceed ahead?"
                                                      ) === true
                                                    ) {
                                                      computeAns(
                                                        option,
                                                        crrqst
                                                      );
                                                    } else if (
                                                      window.confirm(
                                                        "You have selected Not to go ahead with creation of an exercise plan or arrange a call with the therapist. After having taken an assessment, we suggest you proceed with these steps to get your best physical self. Would you like to agree to the terms & conditions and proceed ahead?"
                                                      ) === false
                                                    ) {
                                                      noConsent(option, crrqst);
                                                    }
                                                  }
                                                } else {
                                                  if (option === "Yes") {
                                                    computeAns(option, crrqst);
                                                  } else {
                                                    if (
                                                      window.confirm(
                                                        "You have selected Not to go ahead with creation of an exercise plan or arrange a call with the therapist. After having taken an assessment, we suggest you proceed with these steps to get your best physical self. Would you like to agree to the terms & conditions and proceed ahead?"
                                                      ) === true
                                                    ) {
                                                      computeAns(
                                                        option,
                                                        crrqst
                                                      );
                                                    } else if (
                                                      window.confirm(
                                                        "You have selected Not to go ahead with creation of an exercise plan or arrange a call with the therapist. After having taken an assessment, we suggest you proceed with these steps to get your best physical self. Would you like to agree to the terms & conditions and proceed ahead?"
                                                      ) === false
                                                    ) {
                                                      noConsent(option, crrqst);
                                                    }
                                                  }
                                                }
                                              }}
                                              type="submit"
                                              className="option"
                                              key={option}
                                            >
                                              {Array.isArray(option)
                                                ? option[0]
                                                : option}
                                            </button>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="action">
                                {emailLoading && (
                                  <button className="answer">
                                    {/* <img  src={AnsGif} width={100} height={50} /> */}
                                    <Loading flag={true} />
                                  </button>
                                )}
                              </div>
                            </Form>
                          )}
                          {crrqst.id === "bmi" && <>{getBmi(crrqst)}</>}
                        </>
                      )}
                    </div>

                    {posturePopUp && postureQst !== undefined && (
                      <PostureClass
                        setPosturePopUp={setPosturePopUp}
                        setPostureDone={setPostureDone}
                        isModalVisible={posturePopUp}
                        question={postureQst}
                        computeAns={computeAns}
                        closeModal={() => {
                          setPosturePopUp(false);
                        }}
                        lvalue={~~crrposterType}
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
                        jointValue={JSON.parse(
                          localStorage.getItem("jointValues")
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatBot;
