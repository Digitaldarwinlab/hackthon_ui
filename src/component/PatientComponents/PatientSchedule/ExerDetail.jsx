import {
  Col,
  Row,
  Descriptions,
  Space,
  Checkbox,
  Divider,
  Slider,
  Modal,
  Button,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import BackButton from "../shared/BackButton";
import { exercise_detail } from "../../PatientAPI/PatientDashboardApi";
import AchievedResult from "../shared/AchievedResult";
import CircularBar from "../shared/CircularProgress";
import { FaMedal, FaStopwatch } from "react-icons/fa";
import "./ExerciseDetail.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PATIENT_STATECHANGE } from "../../contextStore/actions/ParientAction";
import ReactPlayer from "react-player";
import {
  submitManuelAi,
  updatePainMeter,
  update_careplan,
} from "../../PatientAPI/PatientShedule";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

const ExerDetail = () => {
  const [exercises, setExercises] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pain, setPain] = useState(0);
  const [comp, setComp] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const history = useHistory();
  const marks1 = {
    0: <SmileOutlined id="smile" style={{ fontSize: 25 }} />,
    1: <i class="far fa-smile" style={{ fontSize: 25, color: "lime" }}></i>,
    2: <MehOutlined style={{ fontSize: 25, color: "limegreen" }} />,
    3: (
      <i
        class="far fa-frown"
        style={{ fontSize: 25, color: "lightsalmon" }}
      ></i>
    ),
    4: <FrownOutlined style={{ fontSize: 25, color: "orange" }} />,
    5: <i class="far fa-tired" style={{ fontSize: 25, color: "red" }}></i>,
  };
  useEffect(() => {
    const unblock = history.block((location, action) => {
      //  if (comp.length>0) {
      if (window.confirm("Exercise status will not get updated. Is it okay?")) {
        console.log("exercise data cleared");
        return true;
      } else {
        console.log("not cleared", location);
        return false;
      }
      //}
    });
    return () => {
      unblock();
    };
  }, [history]);
  useEffect(async () => {
    console.log(location.state.status_flag);
    const res = await exercise_detail(location.state.exNameList);
    console.log("exercises ", location.state.exercises);
    let yt_temp = [];
    location.state.exercises.map((ex) => {
      if (ex.name == "YouTube") {
        let a = {
          title: ex.name,
          video_path: ex.youtube_link,
        };
        yt_temp.push(a);
      }
    });
    console.log("exercises ", res);
    console.log("exercises ", yt_temp);
    setExercises([...res, ...yt_temp]);
  }, []);

  const finish = async () => {
    let tempId = [];
    comp.map((item) => {
      tempId.push(location.state.exercises[item].ex_em_id);
    });
    let tempName = [];
    comp.map((item) => {
      tempName.push(location.state.exercises[item].name);
    });
    // console.log(location.state.exercises);
    // console.log(location.state.exercises[0].ChoosenTime);
    // console.log(location.state.exercises[0].pp_cp_id);
    // console.log(pain);
    // console.log(temp);
    // console.log({
    //   id: location.state.exercises[0].pp_cp_id,
    //   time_slot: location.state.exercises[0].ChoosenTime,
    //   exercise: temp,
    // });
    let ChoosenTime = location.state.exercises[0].ChoosenTime;
    const date = new Date();
    let pp_cp_id = location.state.exercises[0].pp_cp_id;
    // let data = {
    //   id: pp_cp_id,
    //   is_ai: 0,
    //   date: date.toISOString().split("T")[0],
    //   exerciseId: tempId[0],
    //   pain: pain,
    //   output_json: {},
    // };
    let ch = {};
    tempName.map((item) => {
      ch[item] = {};
    });
    // data.output_json[ChoosenTime] = ch;
    // console.log(data);
    let res = await update_careplan(ch, [tempId[0]], 2, ChoosenTime, pp_cp_id);
    // temp.map( async (id) => {
    //   let res =  await update_careplan({},[id],2,ChoosenTime,pp_cp_id)
    // });
    // await submitManuelAi(location.state.exercises[0].pp_cp_id,location.state.exercises[0].ChoosenTime,temp)
    await updatePainMeter(location.state.exercises[0].pp_cp_id, pain);
    window.location.href = "/patient/schedule";
    //window.location.reload();
  };

  const upDel = (index) => {
    if (comp.indexOf(index) !== -1) {
      setComp(comp.filter((item) => item !== index));
    } else {
      setComp([...comp, index]);
    }
    console.log(comp);
  };
  const handleClick = () => {
    history.push({
      pathname: "/patient/ai",
      state: {
        exercise: location.state.exercises[0],
        exercises: location.state.exercises,
      },
    });
  };
console.log("final ",exercises)
  return (
    <div  className="exercise-detail" id="exercise-detail">
      <h3 className="fw-bold mt-2 ms-2">
        <BackButton />
      </h3>
      {exercises.length > 0 &&
        exercises.map((exercise, index) => (
          <>
            <Row className="main-container p-1" id="main-container">
              <Col className="left-box m-1">
                <div className="top-heading" id="top-heading">
                  <h2 style={{fontSize:'20px'}} className="heading" id="heading">
                    <b>{exercise.title}</b>
                  </h2>

                  {index == 0 && (
                    <h3 style={{fontSize:'20px'}} className="subtext" id="subtext">
                      <b style={{ color: "teal" }}>
                        {" "}
                        Find the Fun in Exercise and Track your Progress.......
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
                        src={`${process.env.REACT_APP_EXERCISE_URL}/${exercise.video_path}`}
                        type="video/mp4"
                      />
                    </video>
                  )}
                </div>
              </Col>
              <Col className="right-box">
                <div className="instructions" id="instructions">
                  {location.state.status_flag && (
                    <Row justify="end">
                      <Tooltip title="Mark after completion of each exercise">
                        <Space size={"large"}>
                          <span style={{ fontSize: "17px" }}>
                            Completed {" : "}
                          </span>
                          <Checkbox
                            style={{ paddingLeft: "5px" }}
                            className="AI_selection_checkbox"
                            // checked={state.status_flag}
                            onChange={() => upDel(index)}
                          >
                            {" "}
                            {/* {state.status_flag ? (
                              <span>Active {"  "}</span>
                            ) : (
                              <span>Inactive {"  "}</span>
                            )} */}
                          </Checkbox>
                        </Space>
                      </Tooltip>
                    </Row>
                  )}
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
                      <h5>{exercise.instruction1}</h5>
                    </Descriptions.Item>
                    <Descriptions.Item label="2">
                      <h5>{exercise.instruction2}</h5>
                    </Descriptions.Item>
                  </Descriptions>
                  {/* <p>Set : {location.state.repArr[index].set}</p>
                      {"       "}
                      <p>
                        Reps :{" "}
                        {location.state.repArr[index].rep_count}{" "}
                      </p> */}

                  {/* <center>
                        <h3>
                          <b>Step By Step Instructions</b>
                        </h3>
                      </center>
                      <ol className="instruction-list" id="instruction-list">
                        <li>{exercise.instruction1}</li>
                        <li>{exercise.instruction2}</li>
                      </ol> */}
                </div>
              </Col>
              <Divider />
            </Row>
          </>
        ))}
      <Row justify="end" style={{ margin: "15px" }}>
        <button
          style={{ float: "right" }}
          className="skip-button"
          //  id="skip-button"
          // disabled={this.props.location.state.status_flag}
          onClick={() => {
            setVisible(true);
          }}
        >
          Submit
        </button>
      </Row>
      <Modal visible={visible} footer={null} closable={false} keyboard={false}>
        <h3 className="fw-bold text-center">Congratulation</h3>
        <p className="p text-center mt-2">
          You have successfully completed the session.
        </p>
        <div
          className="painmeter"
          style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
        >
          <Slider
            marks={marks1}
            min={0}
            max={5}
            step={2}
            onChange={(value) => setPain(value)}
            defaultValue={0}
            style={{ width: "100%" }}
          />
        </div>
        <div className="text-end">
          <Button className="okay" onClick={finish}>
            Okay
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ExerDetail;
