import { Col, Row, Descriptions, Space, Checkbox, Divider ,Alert} from "antd";
import { isAuthenticated } from "../../../API/userAuth";
import Navigationbar  from "../../../component/UtilityComponents/Navbar";
import React, { useEffect, useState } from "react";
import BackButton from "../shared/BackButton";
import { exercise_detail } from "../../PatientAPI/PatientDashboardApi";
import { BiArrowBack, BiStreetView } from "react-icons/bi";
import "./ExerciseDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PATIENT_STATECHANGE } from "../../../contextStore/actions/ParientAction";
import ReactPlayer from "react-player";

const ExerciseDetailsClass = () => {
  const [exercises, setExercises] = useState([]);
  const [view, setView] = useState()
  const [exOrg, setExOrg] = useState([]);
  const [count, setCount] = useState(0)
  const [comp, setComp] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const history = useHistory();
  const CallDetails = async () => {
    const res = await exercise_detail(location.state.exNameList);
    console.log("exercise array ", res)
    console.log("exercise array ", location.state.exNameList)
    // console.log("exercise array ",location.state.exercises)
    let yt_temp = [];
    location.state.exercises.map((ex, index) => {
      if (ex.name == "YouTube") {
        let a = {
          title: ex.name,
          video_path: ex.youtube_link,
        };
        yt_temp.push(a);
      }
      res.map(e => {
        if (ex.ex_em_id == e.ex_em_id) {
          ex.startingPosition = e.flex_field_1
          ex.initialPosture = e.start_posture
          ex.derivedPosture = e.hold_posture
          ex.hold = e.hold_flag
        }
      })
    });
    // setExercises([...yt_temp,...res]);
    let temp = []
    location.state.exercises.map(ex => {
      let te = [...yt_temp, ...res].find(e => e.ex_em_id == ex.ex_em_id)
      console.log("exercise array ", te)
      temp.push(te)
    })
    setExercises(temp)
    console.log("exercise array ", [...res, ...yt_temp])
    console.log("exercise array ", temp)
    console.log("exercise array ", location.state.exercises)
  }
  useEffect(() => {
    CallDetails()
    const box = document.getElementById('box' + location.state.exercises.length - 1);
    setView(box)
    return () => {
      console.log("calls on unmount")
    }
  }, []);

  // componentWillUnmount(){
  //   const unblock = () => {
  //     if(window.confirm("alert ")){
  //       return true;
  //     }
  //   }
  //   return () => {
  //     unblock();
  //   };
  // }
  // handleSubmit = () => {

  // }
  const handleClick = () => {
    history.push({
      pathname: "/patient/ai",
      state: {
        exercise: location.state.exercises[0],
        exercises: location.state.exercises,
      },
    });
  };

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
  }


  //const message = document.querySelector('#message');
  if(document.getElementById("exercise-detail")){
    document.getElementById("exercise-detail").addEventListener('scroll',()=>console.log("scrolling"))
  }
  // document.addEventListener('scroll', function () {
  //   console.log("scroll ")
  //   let messageText = "The box is not visible in the viewport"
  //   if (view) {
  //     messageText = isInViewport(view) ?
  //       'The box is visible in the viewport' :
  //       'The box is not visible in the viewport';

  //   }
  //   console.log(messageText)

  // }, {
  //   passive: true
  // });


  return (
    <>
    {isAuthenticated() && <Navigationbar />}
    <div className="exercise-detail" id="exercise-detail">
      {/* <h3 className="fw-bold mt-2 ms-2">
        <BiArrowBack />
      </h3> */}
       <h3 className="fw-bold mt-2 ms-2">
        <BackButton />
      <Alert message="Please scroll down and review all the exercise materials before starting the exercise" type="info" showIcon closable />
      </h3>
      <button
        style={{ float: "right" }}
        className="skip-button"
        id="skip-button"
        // disabled={location.state.status_flag}
        onClick={handleClick}
      >
        Start
      </button>
      {/* <Row justify="space-between">
        <Col span={6}>
          <Button disabled={count==0} onClick={()=>{
            setCount(count-1)
          }}>{`<< Previous`}</Button>
          </Col>
          <Col span={6}>
          <Button disabled={count==exercises.length-1} onClick={()=>{
            setCount(count+1)
          }}>{`Next >>`}</Button>
           <Button disabled={count==exercises.length-1} onClick={()=>{
            setCount(count+1)
          }}>{`Start Doing`}</Button>
          </Col>
        </Row> */}
      <div className="scrollmenu">
        {exercises.length > 0 &&
          exercises.map((exercise, index) => (
            <>
              {/* {
              index==count&&  */}
              <Row className="main-container p-1" id="main-container">
                <Col id={`box${index}`} className="left-box m-1">
                  <div className="top-heading" id="top-heading">
                    <h2 style={{ fontSize: '28px' }} className="heading" id="heading">
                      <b>{exercise.title}</b>
                    </h2>
                    {index == 0 && (
                      <h3 style={{ fontSize: '20px' }} className="subtext" id="subtext">
                        <b style={{ color: "teal" }}>
                          {" "}
                          Find the Fun in Exercise and Track your
                          Progress.......
                        </b>{" "}
                      </h3>
                    )}
                  </div>
                  <div className={`video box${index}`}>
                    {exercise.title == "YouTube" ? (
                      <ReactPlayer
                        playing={true}
                        loop={true}
                        controls={true}
                        className="react-player"
                        url={exercise.video_path}
                        width="100%"
                      //  height="auto"
                      />
                    ) : (
                      <video controls autoPlay loop id="video1" width="100%">
                        <source
                          src={`https://hackathon.physioai.care/${exercise.video_path}`}
                          type="video/mp4"
                        />
                      </video>
                    )}
                  </div>
                </Col>
                <Col className="right-box">
                  <div className="instructions" id="instructions">
                    <p></p>
                    <Descriptions
                      bordered
                      column={{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                    >
                      <Descriptions.Item label={<h5>Sets</h5>}>
                        <h5>{location.state.repArr[index].set}</h5>
                      </Descriptions.Item>
                      <Descriptions.Item label={<h5>Reps</h5>}>
                        <h5>{location.state.repArr[index].rep_count}</h5>
                      </Descriptions.Item>
                    </Descriptions>
                    <p></p>
                    <Descriptions
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                      title={<h3 style={{ fontSize: '20px' }}>Step By Step Instructions</h3>}
                    >
                      <Descriptions.Item label="1">
                        <h5 style={{ fontSize: '16px' }}>{exercise.instruction1}</h5>
                      </Descriptions.Item>
                      <Descriptions.Item label="2">
                        <h5 style={{ fontSize: '16px' }}>{exercise.instruction2}</h5>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </Col>
                <Divider />
              </Row>
              {/* } */}
            </>
          ))}
      </div>
      {/* <button
        style={{ float: "right" }}
        className="skip-button"
        id="skip-button"
        onClick={handleClick}
      >
        Skip
      </button>
      <Row >
      {exercises.length > 0 &&
        exercises.map((exercise, index) => (
          <>
              <Row className="main-container p-1" id="main-container">
                <Col className="left-box m-1">
                  <div className="top-heading" id="top-heading">
                    <h2 style={{fontSize:'28px'}} className="heading" id="heading">
                      <b>{exercise.title}</b>
                    </h2> 

                    {index == 0 && (
                      <h3 style={{fontSize:'20px'}} className="subtext" id="subtext">
                        <b style={{ color: "teal" }}>
                          {" "}
                          Find the Fun in Exercise and Track your
                          Progress.......
                        </b>{" "}
                      </h3>
                    )}
                  </div>
                  <div className="video">
                  {exercise.title == "YouTube" ? (
                    <ReactPlayer
                      playing={true}
                      loop={true}
                      controls={true}
                      className="react-player"
                      url={exercise.video_path}
                      width="100%"
                    //  height="auto"
                    />
                  ) : (
                    <video controls autoPlay loop id="video1" width="100%">
                      <source
                        src={`https://hackathon.physioai.care/${exercise.video_path}`}
                        type="video/mp4"
                      />
                    </video>
                  )}
                </div>
                </Col>
                <Col className="right-box">
                  <div className="instructions" id="instructions">
                    <p></p>
                    <Descriptions
                      bordered
                      column={{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                    >
                      <Descriptions.Item label={<h5>Sets</h5>}>
                        <h5>{location.state.repArr[index].set}</h5>
                      </Descriptions.Item>
                      <Descriptions.Item label={<h5>Reps</h5>}>
                        <h5>{location.state.repArr[index].rep_count}</h5>
                      </Descriptions.Item>
                    </Descriptions>
                    <p></p>
                    <Descriptions
                      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                      title={<h3 style={{fontSize:'20px'}}>Step By Step Instructions</h3>}
                    >
                      <Descriptions.Item label="1">
                        <h5 style={{fontSize:'16px'}}>{exercise.instruction1}</h5>
                      </Descriptions.Item>
                      <Descriptions.Item label="2">
                        <h5 style={{fontSize:'16px'}}>{exercise.instruction2}</h5>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </Col>
                <Divider />
              </Row>
          </>
        ))}
        </Row> */}
    </div>
    </>
  );
};

export default ExerciseDetailsClass;
