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
              : [arr.question, [JSON.parse(arr.answer[0])], arr.answer[1]]
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
    console.log(flag);
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
      console.log(ans);
      let temp = {
        ...qst,
        answer:
          qst.id === "name"
            ? firstname + " " + lastname
            : tempText
            ? tempText
            : firstname + " " + lastname,
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
      if (localStorage.getItem("userId")) {
      } else {
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
          setChatArr([...chatArr, temp]);
          await localStorage.setItem(
            "chat",
            JSON.stringify([...chatArr, temp])
          );
          sendAnswers(
            "Demographic",
            JSON.parse(localStorage.getItem("chat")).slice(3)
          );
        }
      }
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

      setLoading(true);
      let condition = (await localStorage.getItem("userId"))
        ? JSON.parse(localStorage.getItem("qst")).length === 1
        : parseInt(localStorage.getItem("demographicLength")) - 1 ===
          JSON.parse(localStorage.getItem("chat")).length;
      if (condition) {
        setLoading(false);
        setRptLoading(true);
        let a = [];
        let b = part ? part : ans;
        a.push(
          `Dear ${firstname},thank you for initiating an assessment. I understand that you spend ${time} doing ${activity} activity and this leads to ${b} pain.`
        );
        a.push(
          `We'll Like to help you with this and for muscle strengthening & conditioning to get a better understanding of your condition and design a personalized therapy schedule.`
        );
        a.push(
          `I'd Like to know a few more details which may involve performing some action on and off camera to assess your range of motion.`
        );
        temp.rply = localStorage.getItem("userId")
          ? "Thank you for initiating an assesssment. We'll Like to help you with this and for muscle strengthening & conditioning to get a better understanding of your condition and design a personalized therapy schedule."
          : a;
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
        if (localStorage.getItem("userId")) {
          sendAnswers("Demographic", JSON.parse(localStorage.getItem("chat")));
        }
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
        if (parseInt(a.score).toFixed() < 40) {
          temp.scoreType = "high";
        } else if (parseInt(a.score).toFixed() < 70) {
          temp.scoreType = "mild";
        } else if (parseInt(a.score).toFixed() > 70) {
          temp.scoreType = "low";
        }
        temp.rply = `${parseInt(a.score).toFixed()}`;
        setGeneralScore(parseInt(a.score).toFixed());
        localStorage.setItem("generalScore", parseInt(a.score).toFixed());
        temp.type = "score";
        let a1 = [];
        a1.push(
          `Dear ${firstname}, Based on the information you have shared and my analysis, your General score for ${part} is at ${parseInt(
            a.score
          ).toFixed()}%(Lower scores indicate healthier condition).`
        );
        a1.push(
          `This puts you at a ${
            parseInt(a.score).toFixed() < 40
              ? "Low"
              : parseInt(a.score).toFixed() < 70 &&
                parseInt(a.score).toFixed() > 40
              ? "Mild"
              : "High"
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
        if (parseInt(a.score).toFixed() < 40) {
          temp.scoreType = "high";
        } else if (parseInt(a.score).toFixed() < 70) {
          temp.scoreType = "mild";
        } else if (parseInt(a.score).toFixed() > 70) {
          temp.scoreType = "low";
        }
        setPainscaleScore(parseInt(a.score).toFixed());
        localStorage.setItem("painscaleScore", parseInt(a.score).toFixed());
        temp.rply = `${parseInt(a.score).toFixed()}`;
        temp.type = "score";
        let a1 = [];
        a1.push(
          `Dear ${firstname}, Based on the information you have shared and my analysis, your PainScale score for ${part} is at ${parseInt(
            a.score
          ).toFixed()}%(Lower scores indicate healthier condition).`
        );
        a1.push(
          `This puts you at a ${
            parseInt(a.score).toFixed() < 40
              ? "Low"
              : parseInt(a.score).toFixed() < 70 &&
                parseInt(a.score).toFixed() > 40
              ? "Mild"
              : "High"
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
        !flag
      ) {
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
        parseInt(localStorage.getItem("demographicLength")) +
          parseInt(localStorage.getItem("GeneralLength")) +
          parseInt(localStorage.getItem("PainScaleLength")) +
          parseInt(localStorage.getItem("PostureFlexLength")) +
          parseInt(localStorage.getItem("AromFlexLength")) +
          parseInt(localStorage.getItem("ConsentLength")) ===
        JSON.parse(localStorage.getItem("chat")).length
      ) {
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
            console.log(true)
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
    console.log(event);
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
    let meterHeight = parseInt(height) / 100;
    let meterSquare = meterHeight ** 2;
    let bmi = parseInt(weight) / meterSquare;
    computeAns(bmi, crrqst);
    return <div>{false}</div>;
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
          {!isAuthenticated() && <Navigationbar />}
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
                {/* <div className="actions more">
            <i className="zmdi zmdi-more-vert"></i>
          </div>
          <div className="actions attachment">
            <i className="zmdi zmdi-attachment-alt"></i>
          </div>
          <div className="actions">
            <i className="zmdi zmdi-phone"></i>
          </div> */}
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
                                {item.type === "rpt" && (
                                  <>
                                    {rptLoading ? (
                                      <>
                                        <Space size="large">
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
                                          {item.login === true && (
                                            <Link
                                              style={{
                                                textDecoration: "none",
                                                fontSize: "15px",
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
                                {item.type === "score" && (
                                  <>
                                    {scoreLoading ? (
                                      <>
                                        <Space size="large">
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
                                        <Space size="large">
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
                                            Your {part} General Health Score is:{" "}
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
                                          {aromScore &&
                                              !postureDone && (
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
                                                            "I validate the posture and active range of motion by watching your motion. By skipping this check, your assessment may not be complete. Would you like to proceed with the posture & AROM check?"
                                                          ) === false
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
                                                            "I validate the posture and active range of motion by watching your motion. By skipping this check, your assessment may not be complete. Would you like to proceed with the posture & AROM check?"
                                                          ) === false
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
                          {/* {emailLoading && (
                            <Space size="middle">
                              <Spin size="large" tip="Loading..." />
                            </Space>
                          )} */}
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
