
import { Row, Col, Modal, Slider } from "antd";
import VideoScreen from '../shared/VideScreen';
import BackButton from '../shared/BackButton';
import { FaMedal, FaStopwatch } from "react-icons/fa";
import AchievedResult from '../shared/AchievedResult';
import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import UseStopwatchDemo from './components/UseStopwatchDemo';
import { STATECHANGE } from '../../contextStore/actions/Assesment'
import { update_careplan } from "../../PatientAPI/PatientShedule";
//colors
const colors = ["#74b551", "#80bb51", "#97c24c", "#97c24c", "#c0ca43", "#f1ca2d", "#ebb231", "#e29830", "#db7f2c", "#d6662c", "#d04b29", "#c43839"];
//styles
const styles = {
    painmeter: {
        width: "100%",
        height: 30,
        borderColor: "black",
        marginBottom: 50,
        display: "flex",
        position: "relative",
        marginTop: 20
    }
};


const arr = [
    {
        currenRep: 0,
        currenset: 0,
    }

];

const joints = [
    { value: 0, label: "leftShoulder" },
    { value: 1, label: "rightShoulder" },
    { value: 2, label: "leftElbow" },
    { value: 3, label: "rightElbow" },
    { value: 4, label: "leftHip" },
    { value: 5, label: "rightHip" },
    { value: 6, label: "leftKnee" },
    { value: 7, label: "rightKnee" },
    { value: 8, label: "leftNeck" },
    { value: 9, label: "rightNeck" },
    { value: 10, label: "rightPelvic" },
    { value: 11, label: "leftPelvic" },
];

//let data = "";
const Separator = styled.div`
height: 0px;
margin-top: 30px;
border: dashed 2px #404549;
`;
const userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : { role: "physio", info: { first_name: "User" } };
const marks1 = {
    0: <SmileOutlined id="smile" style={{ fontSize: 25 }} />,
    1: <MehOutlined style={{ fontSize: 25, color: 'limegreen' }} />,
    2: <FrownOutlined style={{ fontSize: 25, color: 'orange' }} />,
    3: <i class="far fa-tired" style={{ fontSize: 25, color: "red" }}></i>
};
//Component
class PatientAI1111 extends Component {
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
            careplanId: 0,
            exerciseTime: 0,
        };
        
       // this.AiModel = this.AiModel.bind(this);
         console.log("selected joint :" +this.state.selectedJoint)
    }
    
    handleChange1 = async (key, value, id = 0) => {
        dispatch({
            type: STATECHANGE,
            payload: {
                key,
                value
            }
        });
        dispatch({ type: "NOERROR" });
        this.setState({ pain: value + 1 }) 
        console.log('pain iss' + (value + 1))

    }




    // Pain Meter
    PainMeter = () => {

        return (
            <div className="painmeter" style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }} >
                <Slider marks={marks1} min={0} max={3} step={1}
                    onChange={(value) => handleChange1("PainMeter", value)}
                    defaultValue={this.props.FirstAssesment.PainMeter}
                    style={{ width: '100%' }}
                />


            </div>
        );
    };
 
    //Ai Model
    AiModel = () => {
        console.log("Inside AiModel q12" );
        window.darwin.addProgressListener((setCount, repCount) => {

            console.log("Inside addProgressListener : "+setCount+":"+repCount );
       //    arr[0].currenset=setCount;
         //  arr[0].currenRep=repCount;
            //  this.setrepCount(repCount);
            //  this.setSetCount(setCount);      
        })
       
        if (arr[0].currenset!=0 && arr[0].currenset === this.state.exSetValue) {
                        window.darwin.stop();
                        //   alert("Exercise Complete!!") 
                        //Add Stop and Painmeter Code Here
                        this.setState({ visible: true }) 
                        this.setState({ starttimer: false }) 
                        
                        data = window.darwin.getCarePlanData() //Send this data to API
        
                        // console.log(angles)
                        console.log('careplan data is')
                        console.log(data)
                        console.log('data before')
                        this.setState({ exerciseData: data }) 
                
        
                    }


        //console.log(this.state.exerciseData)
       // let newojb = JSON.stringify(this.state.exerciseData)
       // console.log('unhashed')
        // console.log(newojb)
      //  console.log('hashedd')
     //   let hashed = Buffer.from(newojb).toString("base64")
    //    console.log(hashed)

        return (
            <>
                <span id="reps"></span>
                <span id="sets"></span>
                <video id="video" style={{ position: 'absolute', top: '0px' }} playsinline className="patientAiModel">
                </video>
                <div style={{ position: "relative" }}>
                    <canvas id="output" />
                    <canvas id="jcanvas" />
                </div>
            </>
        )
    }
    finish = async () => {
        console.log("careplanId :" +this.state.careplanId)
        const response = await update_careplan(this.state.exerciseData, this.state.currentexercise,
            this.state.pain, this.state.exerciseTime, this.state.careplanId)
        console.log('response')
        console.log(response)

        this.props.history.push('/patient/schedule')
    }
    //Green Channel 
    Statistics = () => {
        return (
            <>
                <Row className="px-2 py-2" >
                    <Col lg={8} md={8} sm={8} xs={8}>
                        <p className="fw-bold p" >Patient Name: </p>
                        <p className="fw-bold p">Exercise Name: </p>
                        <p className="fw-bold p">Repititon Count: </p>
                        <p className="fw-bold p">Set Value: </p>


                    </Col>
                    <Col lg={8} md={8} sm={8} xs={8}>
                        <p className="p">{userInfo.info.first_name + " "} {userInfo.info.last_name}</p>
                        <p className="p">{this.state.exerciseName}</p>
                        <p className="p">{arr[0].currenset == this.state.exSetValue ? this.state.rep_count : arr[0].currenRep} of {this.state.rep_count}</p>
                        <p className="p">{arr[0].currenset} of {this.state.exSetValue}</p>


                    </Col>

                </Row>
            </>
        )
    };
    setstarttimer(){
        this.setState({ starttimer: false }) 
        
    }
    setrepCount = (repCount) => {
        if(repCount > 0){
            // this.setState({currenRep: repCount}, function () {
            //     console.log(repCount);
            // });
            this.setState({currenRep: repCount});
          
        }
    }
    setSetCount = async (setCount) => {
        if(setCount >0){
            // this.setState({currenset: setCount}, function () {
            //     console.log(setCount);
            // });
            this.setState({currenset: setCount});
        }
     
    }
    handleChange1 = async (key, value, id = 0) => {
        dispatch({
            type: STATECHANGE,
            payload: {
                key,
                value
            }
        });
        dispatch({ type: "NOERROR" });
        this.setState({ pain: value + 1 }) 
        console.log('pain iss' + (value + 1))

    }

    // componentWillUnmount() {
    //     arr[0].currenset=0;
    //     arr[0].currenRep=0;
    // }
    componentDidMount() {
        let exercise = this.props.history.location.state;
        console.log('exercise nameeeeeee')
        console.log("check ", this.props.history.location.state.exercise)
        this.setState({ careplanId: 195 })
     //   this.setState({ careplanId: this.props.history.location.state.exercise.careplanId })
        console.log("QQQQQQQQQQ",exercise.exercise)
        this.setState({ exerciseTime: exercise.exercise.ChoosenTime })
        this.setState({ currentexercise: [exercise.exercise.ex_em_id, exercise.exercise.name] })
     // console.log("QQQQQQQQQQ",exercise)
        if (exercise && exercise.exercise) {
            console.log("QQQQQQQQQQ",exercise.exercise.Rom.joint);
            let { name, video_url, Rep, Rom } = exercise.exercise;
            console.log("QQQQQQQQQQ",Rom.joint);
            this.setState({ exerciseName: name })
            this.setState({ video: video_url })
            this.setState({ rep_count: Rep.rep_count })
            this.setState({ exSetValue: Rep.set });
        
            this.setState({ rom: {
                ...this.state.rom,
                min: Rom.min, max: Rom.max
            }})
            this.setState((prevState, props) => ({
                selectedJoint:  Rom.joint
              }));
              this.setState({ selectedJoint:  Rom.joint});
        }
        var video = document.getElementById('video');
        var canvas = document.getElementById('output');
        var jcanvas = document.getElementById('jcanvas');
        var myVideo = document.getElementById("myVideo");
        let { width, height } = myVideo.getBoundingClientRect()
       video.width = width;
        const options = {
            video,
            videoWidth: width,
            videoHeight: height,
            canvas,
            supervised: false,
            showAngles: false,
            ROMPanel: {
                canvas: jcanvas,
                width: 150,
                height: 150,
                radius: 70
            }
        };

        window.darwin.initializeModel(options);
        this.setState({ starttimer: true })
      

    }
    componentDidUpdate() {

        //Select primary angle based on joint
        let primaryAngles = []
        console.log("selected joint :" +this.state.selectedJoint)
       
        for (let i = 0; i < joints.length; i++) {
            if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && !this.state.selectedJoint.includes('Wrist')) {
                primaryAngles.push(joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && !this.state.selectedJoint.includes('Shoulder')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 1 value", joints[i].value)
                primaryAngles.push((joints[i].value) - 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Shoulder')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 2 value", joints[i].value)
                primaryAngles.push((joints[i].value) - 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && this.state.selectedJoint.includes('Pelvic')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 3 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Pelvic')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 4 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && this.state.selectedJoint.includes('Elbow')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 5 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Elbow')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 6 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && this.state.selectedJoint.includes('Hip')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 7 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Hip')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 8 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && this.state.selectedJoint.includes('Knee')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 9 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Knee')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 10 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('right') && this.state.selectedJoint.includes('Neck')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 11 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            } else if (this.state.selectedJoint.includes(joints[i].label) && this.state.selectedJoint.includes('left') && this.state.selectedJoint.includes('Neck')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 12 value", joints[i].value)
                primaryAngles.push((joints[i].value) + 1)
                break;

            }
        }

        console.log("angles are ", primaryAngles)
        console.log('cheking parameter//')
        console.log(this.state.exerciseName)
        console.log(primaryAngles)
        console.log(this.state.rom.min, this.state.rom.max)
        console.log(this.state.rep_count)
        console.log(this.state.exSetValue)
        console.log(primaryAngles, this.state.rom);
        console.log('////checking parameter')
       
        window.darwin.setExcersiseParams({
            name: this.state.exerciseName,
            minAmp: 30,
            primaryAngles: primaryAngles,
            ROMs: [[this.state.rom.min, this.state.rom.max], [this.state.rom.min, this.state.rom.max]],
            angles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            totalReps: this.state.rep_count,
           totalSets: this.state.exSetValue

          

        });

        window.darwin.launchModel();
      //  window.darwin.stop();
       // window.darwin.restart();
       

        const unblock = this.props.history.block((location, action) => {
            // Dipsikha start 23/10
            if (window.confirm("Thank you for completing !!! Click on OK to continue")) {
                window.darwin.stop();
                const video = document.getElementById('video');
                const mediaStream = video.srcObject;
                try {
                    const tracks = mediaStream.getTracks();
                    tracks[0].stop();
                    tracks.forEach(track => track.stop())
                }
                catch (err) {
                    console.log(err)
                }
                return true;
            } else {
                return false;
            }
        });

        unblock();


    }


       AiModelProps = this.AiModel.bind(this);
   // AiModelProps = this.AiModel.bind(this);
    render() {
        return (
            <>
                <div id="info" style={{ display: "none" }}>
                </div>
                <div className="m-3">
                    <h3 className="fw-bold">
                        <BackButton />
                        {" "}{this.state.exerciseName}
                    </h3>
                    <Row gutter={[10, 5]}>
                        <Col lg={16} md={16} sm={24} xs={24}
                            id="myVideo"
                            className="border" style={{ minHeight: '600px', cursor: "pointer" }}>
                         {this.AiModelProps()}
                          
                            {/* {this.AiModel()} */}
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24} id="greenChannel">
                            <Row gutter={[5, 5]}>
                                <Col lg={24} md={24} sm={12} xs={24} className="border" >
                                    <UseStopwatchDemo starttimer={this.state.starttimer} Setstarttimer={this.setstarttimer
                                       
                                        } />

                                </Col>
                                <Col lg={24} md={24} sm={12} xs={24} className="border">
                                    {this.Statistics()}
                                </Col>
                                <Col lg={24} md={24} sm={12} xs={24} style={{ minHeight: "32vh" }}>
                                    <VideoScreen
                                        height={true}
                                        video={`${process.env.REACT_APP_EXERCISE_URL}/${this.state.video}`}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Modal
                    title=""
                    closable
                    visible={this.state.visible}
                    footer={null}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <h3 className="fw-bold text-center">Congratulation</h3>
                    <p className="p text-center mt-2">You have successfully completed the session.</p>
                    {this.PainMeter()}

                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
                        <AchievedResult icon={<FaMedal size={25} color="black" />}
                            score="8/10" message="Your Success" />
                        <AchievedResult
                            icon={<FaStopwatch size={25} color="black" />}
                            score="30 min" message="Your Practice Time" />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <h4 className="fw-bold">Notes-</h4>
                        <p className="text-justify p">
                            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
                        </p>
                    </div>
                    <div className="text-end">
                        <Button className="okay" onClick={this.finish}>Okay</Button>
                    </div>
                </Modal>
            </>
        )
    }
}
const mapDispatchToProps = dispatch => ({

    FirstAssesment: (key, value) => {
        dispatch({
            type: STATECHANGE,
            payload: {
                key,
                value
            },
        });
    },
});

export default connect(null, mapDispatchToProps)(PatientAI1111)