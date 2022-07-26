import { Row, Col, Modal, Slider } from "antd";
import VideoScreen from "../shared/VideScreen";
import { isAuthenticated } from "../../";
const Navigationbar = lazy(() => import("./component/UtilityComponents/Navbar"));
import BackButton from "../shared/BackButton";
import { FaMedal, FaStopwatch } from "react-icons/fa";
import AchievedResult from "../shared/AchievedResult";
import { Button } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import styled from "styled-components";
import UseStopwatchDemo from "./components/UseStopwatchDemo";
import { STATECHANGE } from "../../../contextStore/actions/Assesment";
import {
  updatePainMeter,
  update_careplan,
} from "../../PatientAPI/PatientShedule";
import "./PatientAI.css";
import ReactPlayer from "react-player";
//colors
const colors = [
  "#74b551",
  "#80bb51",
  "#97c24c",
  "#97c24c",
  "#c0ca43",
  "#f1ca2d",
  "#ebb231",
  "#e29830",
  "#db7f2c",
  "#d6662c",
  "#d04b29",
  "#c43839",
];
//styles
const styles = {
  painmeter: {
    width: "100%",
    height: 30,
    borderColor: "black",
    marginBottom: 50,
    display: "flex",
    position: "relative",
    marginTop: 20,
  },
};

// const joints = [
//   { value: 0, label: "leftShoulder" },
//   { value: 1, label: "rightShoulder" },
//   { value: 2, label: "leftElbow" },
//   { value: 3, label: "rightElbow" },
//   { value: 4, label: "leftHip" },
//   { value: 5, label: "rightHip" },
//   { value: 6, label: "leftKnee" },
//   { value: 7, label: "rightKnee" },
//   { value: 8, label: "leftNeck" },
//   { value: 9, label: "rightNeck" },
//   { value: 10, label: "leftPelvic" },
//   { value: 11, label: "rightPelvic" },
//   { value: 12, label: "leftWrist" },
//   { value: 13, label: "rightWrist" },
//   { value: 14, label: "leftAnkle" },
//   { value: 15, label: "rightAnkle" },
//   { value: 16, label: "leftHipAdductionAdbuction" },
//   { value: 17, label: "rightHipAdductionAdbuction" },
//   { value: 18, label: "cervicalForwardFlexion" },
// ];

const joints = {
  leftShoulder: [0, 1],
  rightShoulder: [0, 1],
  leftElbow: [2, 3],
  rightElbow: [2, 3],
  leftHip: [4, 5],
  rightHip: [4, 5],
  leftKnee: [6, 7],
  rightKnee: [6, 7],
  leftNeck: [8, 9],
  rightNeck: [8, 9],
  leftPelvic: [10, 11],
  rightPelvic: [10, 11],
  leftWrist: [12, 13],
  rightWrist: [12, 13],
  leftAnkle: [14, 15],
  rightAnkle: [14, 15],
  leftHipAdductionAdbuction: [16, 17],
  rightHipAdductionAdbuction: [16, 17],
  cervicalForwardFlexion: [18, 18],
};

//let data = "";
const Separator = styled.div`
  height: 0px;
  margin-top: 30px;
  border: dashed 2px #404549;
`;
const userInfo = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : { role: "physio", info: { first_name: "User" } };
const marks1 = {
  0: <SmileOutlined id="smile" style={{ fontSize: 25 }} />,
  1: <i class="far fa-smile" style={{ fontSize: 25, color: "lime" }}></i>,
  2: <MehOutlined style={{ fontSize: 25, color: "limegreen" }} />,
  3: (
    <i class="far fa-frown" style={{ fontSize: 25, color: "lightsalmon" }}></i>
  ),
  4: <FrownOutlined style={{ fontSize: 25, color: "orange" }} />,
  5: <i class="far fa-tired" style={{ fontSize: 25, color: "red" }}></i>,
};
let arr = [
  {
    currenRep: 0,
    currenset: 0,
  },
];
//Component
class PatientAI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starttimer: false,
      pain: 0,
      exerciseName: "",
      video: "",
      visible: false,
      currentexercise: false,
      rep_count: 0, //repition
      currenRep: 0,
      currenset: 0,
      exSetValue: 0, // set value
      selectedJoint: "", // selected joints
      rom: { min: "", max: "" }, // set rom
      exerciseData: {},
      careplanId: this.props.history.location.state.exercise.careplanId,
      exerciseTime: 0,
      checkComplete: false,
      selJoints: [],
      temp: [],
      launch: "start",
      video_url: "",
    };

    const video = document.getElementById("video");
    if (video != null) {
      const mediaStream = video.srcObject;
      try {
        const tracks = mediaStream.getTracks();
        tracks[0].stop();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
    }

    // this.AiModel = this.AiModel.bind(this);
    console.log("selected joint :" + this.state.selectedJoint);
    console.log("exercises ", this.props.history.location.state.exercises);
  }

  handleChange1 = async (key, value, id = 0) => {
    this.props.FirstAssesment("PainMeter", value + 1);
    this.props.FirstAssesment("pain", value + 1);
    this.setState({ pain: value + 1 });
    console.log("pain iss" + (value + 1));
  };

  updateCarePlan = async (
    exerciseData,
    currentexercise,
    pain,
    exerciseTime,
    careplanId
  ) => {
    console.log("inside update careplan function ");
    const response = await update_careplan(
      exerciseData,
      currentexercise,
      1,
      pain,
      exerciseTime,
      careplanId
    );
  };
  componentWillUnmount() {
    const video = document.getElementById("video");
    if (video != null) {
      const mediaStream = video.srcObject;
      try {
        const tracks = mediaStream.getTracks();
        tracks[0].stop();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
}
  // Pain Meter
  PainMeter = () => {
    return (
      <div
        className="painmeter"
        style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
      >
        <Slider
          marks={marks1}
          min={0}
          max={5}
          step={2}
          onChange={(value) => this.handleChange1("PainMeter", value)}
          defaultValue={this.props.FirstAssesment.PainMeter}
          style={{ width: "100%" }}
        />
      </div>
    );
  };
  //Ai Model
  AiModel = () => {
    console.log("Inside AiModel ");
    try {
      window.darwin.addProgressListener((setCount, repCount, counterCount, id) => {
        console.log(
          "Inside addProgressListener : " + setCount + ":" + repCount
        );
        console.log("countercount ", counterCount);
        if (id === "stop") {
          // this.setState({ starttimer: false })
          const data = window.darwin.getCarePlanData();
          console.log("stop ", data);
          this.setState({ exerciseData: data });
          console.log("current stop repCount ", repCount);
          console.log("current stop setCount ", setCount);
          console.log("current stop id ", id);
          console.log("current stop counterCount ", counterCount);
          console.log(
            "current stop exercise id ",
            this.props.history.location.state.exercises[counterCount - 1]
              .ex_em_id
          );
          console.log(
            "current stop exercise name ",
            this.props.history.location.state.exercises[counterCount - 1].name
          );
          console.log(
            "current stop exercise time ",
            this.props.history.location.state.exercises[counterCount - 1]
              .ChoosenTime
          );
          console.log(
            "current stop exercise careplanid ",
            this.props.history.location.state.exercises[counterCount - 1]
              .pp_cp_id
          );
          console.log(
            "current stop exercise video url ",
            this.props.history.location.state.exercises[counterCount - 1]
              .video_url
          );
          this.updateCarePlan(
            data,
            [
              this.props.history.location.state.exercises[counterCount - 1]
                .ex_em_id,
              this.props.history.location.state.exercises[counterCount - 1]
                .name,
            ],
            2,
            this.props.history.location.state.exercises[counterCount - 1]
              .ChoosenTime,
              this.props.history.location.state.exercises.careplanId
          );
          this.setState({ visible: true });
          //  this.state.visible = true
        }

        // to get each exercise data
        if (id === "abandan") {
          if (
            this.props.history.location.state.exercises[counterCount] &&
            this.props.history.location.state.exercises[counterCount].name !==
              undefined
          ) {
            console.log(
              "current getData exercise name ",
              this.props.history.location.state.exercises[counterCount].name
            );
            this.setState({
              exerciseName:
                this.props.history.location.state.exercises[counterCount].name,
            });
          }
          if (
            this.props.history.location.state.exercises[counterCount] &&
            this.props.history.location.state.exercises[counterCount]
              .video_url !== undefined
          ) {
            console.log(
              "current getData exercise video url ",
              this.props.history.location.state.exercises[counterCount]
                .video_url
            );
            if(this.props.history.location.state.exercises[counterCount].name=="YouTube"){
              this.setState({video:this.props.history.location.state.exercises[counterCount].video_url})
            }else{
              var video = document.getElementById("exercise_video");
              var source = document.getElementById("video_source");
              source.setAttribute(
                "src",
                `${"https://hackathon.physioai.care"}/${this.props.history.location.state.exercises[counterCount].video_url}`
              );
              video.load();
              video.play();
            }
            //  this.setState({ video: this.props.history.location.state.exercises[counterCount].video_url })
            // this.setState({ video_url :this.props.history.location.state.exercises[counterCount].video_url})
          }
        }
        if (id === "getData") {
          const data = window.darwin.getCarePlanData();
          console.log("getData", data);
          console.log("current getData repCount ", repCount);
          console.log("current getData setCount ", setCount);
          console.log("current getData id ", id);
          console.log("current getData counterCount ", counterCount);
          //   console.log('current getData exercise id ',this.props.history.location.state.exercises[counterCount].ex_em_id)
          //  console.log('current getData exercise name ',this.props.history.location.state.exercises[counterCount].name)
          //   console.log('current getData exercise time ',this.props.history.location.state.exercises[counterCount].ChoosenTime)
          //  console.log('current getData exercise careplanid ',this.props.history.location.state.exercises[counterCount].pp_cp_id)
          this.updateCarePlan(
            data,
            [
              this.props.history.location.state.exercises[counterCount - 1]
                .ex_em_id,
              this.props.history.location.state.exercises[counterCount - 1]
                .name,
            ],
            2,
            this.props.history.location.state.exercises[counterCount - 1]
              .ChoosenTime,
              this.props.history.location.state.exercises.careplanId
          );
          if (
            this.props.history.location.state.exercises[counterCount] &&
            this.props.history.location.state.exercises[counterCount].name !==
              undefined
          ) {
            console.log(
              "current getData exercise name ",
              this.props.history.location.state.exercises[counterCount].name
            );
            this.setState({
              exerciseName:
                this.props.history.location.state.exercises[counterCount].name,
            });
          }
          if (
            this.props.history.location.state.exercises[counterCount] &&
            this.props.history.location.state.exercises[counterCount]
              .video_url !== undefined
          ) {
            console.log(
              "current getData exercise video url ",
              this.props.history.location.state.exercises[counterCount]
                .video_url
            );
            if(this.props.history.location.state.exercises[counterCount].name=="YouTube"){
              this.setState({video:this.props.history.location.state.exercises[counterCount].video_url})
            }else{
              var video = document.getElementById("exercise_video");
              var source = document.getElementById("video_source");
              source.setAttribute(
                "src",
                `${"https://hackathon.physioai.care"}/${this.props.history.location.state.exercises[counterCount].video_url}`
              );
              video.load();
              video.play();
            }
            //  this.setState({ video: this.props.history.location.state.exercises[counterCount].video_url })
            // this.setState({ video_url :this.props.history.location.state.exercises[counterCount].video_url})
          }
          // this.state.exerciseName = this.props.history.location.state.exercises[counterCount-1].name
          // this.state.video = this.props.history.location.state.exercises[counterCount-1].video_url
        }

        // exercise completed
        if (
          counterCount === this.props.history.location.state.exercises.length
        ) {
          console.log("exercise completed");
          this.setState({ visible: true });
          //this.setState({ starttimer: false })
          // this.state.visible = true
        }
      });
    } catch (error) {
      console.log("AAAAAAAAAAAAA", error);
      this.AiModel();
    }

    return (
      <Col
        // style={{ border: "5px solid" }}
        className="patientside_new_vid_main"
        id="myVideo"
        lg={16}
        md={16}
        sm={24}
        xs={24}
      >
        <video
          id="video"
          className="video"
          playsInline
          style={{ display: "none" }}
        ></video>
        <canvas id="output" className="output" style={{ height: "450px" ,width:'100%' }} />
        <canvas id="jcanvas" />
      </Col>
      //   <>
      //     <span id="reps"></span>
      //     <span id="sets"></span>
      //     <video
      //       id="video"
      //       style={{ position: "absolute", top: "0px" }}
      //       playsinline
      //       className="patientAiModel"
      //     ></video>
      //     <div style={{ position: "relative" }}>
      //       <canvas id="output" />
      //       <canvas id="jcanvas" />
      //     </div>
      //   </>
    );
  };
  finish = async (id) => {
    console.log(
      "pain meter ",
      this.props.history.location.state.exercises[0].pp_cp_id,
      " ",
      this.props.FirstAssesmentReducer.PainMeter
    );
    await updatePainMeter(
      this.props.history.location.state.exercises[0].pp_cp_id,
      this.props.FirstAssesmentReducer.PainMeter
    );
    window.darwin.stop();
    const video = document.getElementById("video");
    const mediaStream = video.srcObject;
    try {
      const tracks = mediaStream.getTracks();
      tracks[0].stop();
      tracks.forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }
    // this.props.history.push({
    //     pathname: '/patient/schedule',

    //     state: { autorefresh: 1 }
    //   })
    this.props.history.push("/patient/schedule");
    window.location.reload();
  };
  //Green Channel
  Statistics = () => {
    return (
      <>
        <Row className="px-2 py-2">
          <Col lg={8} md={8} sm={8} xs={8}>
            <p className="fw-bold p">Patient Name: </p>
            <p className="fw-bold p">Exercise Name: </p>
            {/* <p className="fw-bold p">Repititon Count: </p>
                        <p className="fw-bold p">Set Value: </p> */}
          </Col>
          <Col lg={8} md={8} sm={8} xs={8}>
            <p className="p">
              {userInfo.info.first_name + " "} {userInfo.info.last_name}
            </p>
            <p className="p">{this.state.exerciseName}</p>
            {/* <p className="p">{this.state.currenset == this.state.exSetValue ? this.state.rep_count : this.state.currenRep} of {this.state.rep_count}</p>
                        <p className="p">{this.state.currenset} of {this.state.exSetValue}</p> */}
            {/* <p className="p">{arr[0].currenset == this.state.exSetValue ? this.state.rep_count : arr[0].currenRep} of {this.state.rep_count}</p>
                        <p className="p">{arr[0].currenset} of {this.state.exSetValue}</p> */}
          </Col>
        </Row>
      </>
    );
  };
  setstarttimer() {
    this.setState({ starttimer: false });
  }

  componentDidMount() {
    console.log("props ", this.props);
    arr[0].currenset = 0;
    arr[0].currenRep = 0;
    let exercise = this.props.history.location.state;
    console.log("exercise nameeeeeee");
    console.log("check id ", this.props.history.location.state.exercises.careplanId);

    this.setState({
      careplanId: this.props.history.location.state.exercise.careplanId,
    });
    console.log("QQQQQQQQQQ", exercise.exercise);
    this.setState({ exerciseTime: exercise.exercise.ChoosenTime });
    this.setState({
      currentexercise: [exercise.exercise.ex_em_id, exercise.exercise.name],
    });

    if (exercise && exercise.exercise) {
      console.log("QQQQQQQQQQ", exercise.exercise.Rom.joint);
      let { name, video_url, Rep, Rom } = exercise.exercise;
      console.log("QQQQQQQQQQ", Rom.joint);
      this.setState({ exerciseName: name });
      this.setState({ video: video_url });
      this.setState({ video_url: video_url });
      this.setState({ rep_count: Rep.rep_count });
      this.setState({ exSetValue: Rep.set });

      this.setState({
        rom: {
          // ...this.state.rom,
          min: Rom.min,
          max: Rom.max,
        },
      });

      exercise.exercises.map((ex) => {
        // this.state.selJoints.push(ex.Rom)
        let romarr = [ex.Rom.min, ex.Rom.max];

        this.setState((prevState) => ({
          selJoints: [...prevState.selJoints, romarr],
        }));
      });
      exercise.exercises.map((ex) => {
        this.setState((prevState, props) => ({
          selectedJoint: [...prevState.selectedJoint, ex.Rom.joint],
        }));
      });
      //  this.setState({ selectedJoint:  Rom.joint});
    }
    // console.log("check id after",this.state.careplanId)
    var video = document.getElementById("video");
    var canvas = document.getElementById("output");
    var jcanvas = document.getElementById("jcanvas");
    const myVideo = document.getElementById("myVideo");
    let { width, height } = myVideo.getBoundingClientRect();
    //  video.width = width;
    // canvas.width = width
    const options = {
      video,
      videoWidth: 640,
      videoHeight: 480,
      canvas,
      supervised: false,
      showAngles: false,
      ROMPanel: {
        canvas: jcanvas,
        width: 150,
        height: 480,
        radius: 70,
      },
    };

    window.darwin.initializeModel(options);
    this.setState({ starttimer: true });
    //Select primary angle based on joint

    // window.darwin.stop();
    //  window.darwin.restart();
  }
  componentDidUpdate() {
    //Select primary angle based on joint
    //this.props.history.location.state.exercises.map()
    if (this.state.launch === "start") {
      let temp = this.props.history.location.state.exercises.map(
        (item) => joints[item.Rom["joint"]]
      );
      // joints.map((jo) => {
      //   if (ex["Rom"].joint.includes(jo.label)) {
      //     if (ex["Rom"].joint.includes("left")) {
      //       temp.push([jo.value, jo.value + 1]);
      //     } else if (ex["Rom"].joint.includes("right")) {
      //       temp.push([jo.value - 1, jo.value]);
      //     }
      //   }
      // });
      //  temp.push(joints[ex["Rom"].joint])

      console.log("temp primary ", temp);
      console.log("temp selected ", this.state.selJoints);
      let exArr = [];

      for (
        let i = 0;
        i < this.props.history.location.state.exercises.length;
        i++
      ) {
        let temEx = {
          name: this.props.history.location.state.exercises[i].name,
          minAmp: this.props.history.location.state.exercises[i].minAmp
            ? this.props.history.location.state.exercises[i].minAmp
            : 20,
          primaryAngles: temp[i],
          ROMs: [this.state.selJoints[i], this.state.selJoints[i]],
          angles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          totalReps: parseInt(
            this.props.history.location.state.exercises[i].Rep["rep_count"]
          ),
          totalSets: parseInt(
            this.props.history.location.state.exercises[i].Rep["set"]
          ),
          hold:this.props.history.location.state.exercises[i].hold==0?"min":"max",
          initialPosture:this.props.history.location.state.exercises[i].initialPosture,
          derivedPosture:this.props.history.location.state.exercises[i].derivedPosture
        };
        exArr.push(temEx);
      }
      // console.log("angles are ", primaryAngles)
      // console.log('cheking parameter//')
      // console.log(this.state.exerciseName)
      // console.log(primaryAngles)
      // console.log(this.state.rom.min, this.state.rom.max)
      // console.log(this.state.rep_count)
      // console.log(this.state.exSetValue)
      // console.log(primaryAngles, this.state.rom);
      // console.log('////checking parameter')
      console.log("exercise ", exArr);
      window.darwin.setAllExcersiseParams(exArr);
      // window.darwin.setExcersiseParams({
      //     name: this.state.exerciseName,
      //     minAmp: 30,
      //     primaryAngles: primaryAngles,
      //     ROMs: [[this.state.rom.min, this.state.rom.max], [this.state.rom.min, this.state.rom.max]],
      //     angles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      //     totalReps: this.state.rep_count,
      //    totalSets: this.state.exSetValue

      // });

      window.darwin.launchModel();
      //  window.darwin.stop();
      // window.darwin.restart();

      // const unblock = this.props.history.block((location, action) => {
      //     // Dipsikha start 23/10
      //     if (window.confirm("Thank you for completing !!! Click on OK to continue")) {
      //         window.darwin.stop();
      //         const video = document.getElementById('video');
      //         const mediaStream = video.srcObject;
      //         try {
      //             const tracks = mediaStream.getTracks();
      //             tracks[0].stop();
      //             tracks.forEach(track => track.stop())
      //         }
      //         catch (err) {
      //             console.log(err)
      //         }
      //         return true;
      //     } else {
      //         return false;
      //     }
      // });

      // unblock();
      this.setState({ launch: "stop" });
    }
  }
  AiModelProps = this.AiModel.bind(this);
  // AiModelProps = this.AiModel.bind(this);
  render() {
    return (
      <div className="pat_main_div">
        <Row>
          <Col lg={8} md={8} sm={8} xs={8}>
            <h3 style={{fontSize:'20px'}} className="fw-bold">
              <BackButton />
            </h3>
          </Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            <p className="fw-bold p">
              Exercise Name: {this.state.exerciseName}
            </p>
          </Col>
          <Col className="ex_detail_name" lg={8} md={8} sm={12} xs={12}>
            <p className="fw-bold p">
              Patient Name: {userInfo.info.first_name + " "}{" "}
              {userInfo.info.last_name}
            </p>
          </Col>
        </Row>
        <Row>
          {this.AiModelProps()}

          <Col lg={8} md={8} sm={24} xs={24}>
            <Row className="pat_det_div">
              <Col lg={24} md={24} sm={24} xs={24}>
                {this.state.exerciseName == "YouTube" ? (
                  <ReactPlayer
                    playing={true}
                    loop={true}
                    controls={true}
                    className="react-player"
                    url={this.state.video}
                    width="100%"
                    height="auto"
                  />
                ) : (
                  <video
                    autoPlay
                    controls
                    loop
                    id="exercise_video"
                    style={{ width: "97%", height: "100%" }}
                    className="border"
                  >
                    <source
                      id="video_source"
                      src={`${"https://hackathon.physioai.care"}/${this.state.video}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </Col>
            </Row>
          </Col>
          <Modal
            visible={this.state.visible}
            footer={null}
            closable={false}
            keyboard={false}
          >
            <h3 className="fw-bold text-center">Congratulation</h3>
            <p className="p text-center mt-2">
              You have successfully completed the session.
            </p>
            {this.PainMeter()}

            {/* <div style={{ marginTop: 20 }}>
             <h4 className="fw-bold">Notes-</h4>
             <p className="text-justify p"></p>
           </div> */}
            <div className="text-end">
              <Button className="okay" onClick={this.finish}>
                Okay
              </Button>
            </div>
          </Modal>
        </Row>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  FirstAssesment: (key, value) => {
    dispatch({
      type: STATECHANGE,
      payload: {
        key,
        value,
      },
    });
  },
});
const mapStateToProps = (state) => ({
  FirstAssesmentReducer: state.FirstAssesment,
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientAI);
