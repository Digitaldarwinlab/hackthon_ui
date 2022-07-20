import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Col, Modal,Slider } from "antd";
import VideoScreen from './../shared/VideScreen';
import BackButton from './../shared/BackButton';
import { FaMedal, FaStopwatch } from "react-icons/fa";
import AchievedResult from './../shared/AchievedResult';
import { Avatar,Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import UseStopwatchDemo from './components/UseStopwatchDemo';
import {STATECHANGE} from '../../contextStore/actions/Assesment'
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


//hostname
let host = window.location.hostname === "localhost";
let url = window.location.origin;
//AI Model Data
const labels = ['leftShoulder(ver)', 'rightShoulder(ver)'
    , 'leftElbow', 'rightElbow',
    'leftHip', 'rightHip',
    'leftKnee', 'rightKnee',
    'leftShoulder(hor)', 'rightShoulder(hor)',
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

let data = "";

//Component
const PatientAI = (props) => {
    
const Separator = styled.div`
height: 0px;
margin-top: 30px;
border: dashed 2px #404549;
`;
const state = useSelector(state => state);
const dispatch = useDispatch();
    const [starttimer,Setstarttimer]=useState(false)
    const [pain,Setpain]=useState(0)
    const [seconds,Setseconds]=useState(0)
    const [minutes,Setminutes]=useState(0)
    const [hour,Sethour]=useState(0)
    const history = useHistory();
    const [exerciseName, setExerciseName] = useState("");
    const [video, setVideo] = useState("");
    const [visible, setVisible] = useState(false);
    const[currentexercise,Setcurrentexercise]=useState(false)
    const [rep_count, setRepCount] = useState(0); //repition
    const [currenRep,setCurrentRep]=useState(0);
    const [currenset,setCurrentSet]=useState(0);
    const [exSetValue, setExSetValue] = useState(0); // set value
    const [selectedJoint, setSelectedJoint] = useState(""); // selected joints
    const [rom, setRom] = useState({ min: "", max: "" }); // set rom
    const [exerciseData,setexerciseData]=useState({})
    const [careplanId,SetcareplanId]=useState(0)
    const [exerciseTime,SetexerciseTime]=useState(0)
    const userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : { role: "physio", info: { first_name: "User" } };
    //SetModelCanvas
    const setModelCanvas = () => {
        const video = document.getElementById('video');
        const canvas = document.getElementById('output');
        const jcanvas = document.getElementById('jcanvas');

        
        const myVideo = document.getElementById("myVideo");
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
        // startModel();
    }


    useEffect(()=>{
        // setInterval(()=>{
        //     if(seconds>59)
        //     {
        //         Setseconds(prevSecond=>prevSecond*0)
        //         alert('hii')
        //     }
        //     else
        //     {
        //         Setseconds(prevSeconds=>prevSeconds+1)
        //     }


        //     (minutes>59)
        //     {   
        //         Setminutes(prevMinute=>prevMinute*0)
        //         Sethour(prevHour=>prevHour+1)
        //     }

        // },1000)

    },[])
    //Start Model
    const startModel = () => {
        let exercise = history.location.state;
        console.log('exercise nameeeeeee')
        console.log("check ",history.location.state.exercise)
        SetcareplanId(history.location.state.exercise.careplanId)
        console.log(exercise.exercise)
        SetexerciseTime(exercise.exercise.ChoosenTime)
        Setcurrentexercise([exercise.exercise.ex_em_id,exercise.exercise.name])

        // console.log(exercise)
        if (exercise && exercise.exercise) {
            let { name, video_url, Rep, Rom } = exercise.exercise;
            setExerciseName(name);
            setVideo(video_url);
            setRepCount(Rep.rep_count);
            setExSetValue(Rep.set);
            setSelectedJoint(Rom.joint);
            setRom({
                ...rom,
                min: Rom.min, max: Rom.max
            });
        }

        const video = document.getElementById('video');
        const canvas = document.getElementById('output');
      //  const jcanvas = document.getElementById('jcanvas');

        
        const myVideo = document.getElementById("myVideo");
        let { width, height } = myVideo.getBoundingClientRect()
        video.width = width;


        const options = {
            video,
            videoWidth: 550,
            videoHeight: 420,//window.innerHeight-20,
            canvas,
            // loadingEleId: 'loading',
            // mainEleId: 'main',
            supervised: true,
            showAngles: true,
        };
        // const options = {
        //     video,
        //     videoWidth: width,
        //     videoHeight: height,
        //     canvas,
        //     supervised: false,
        //     showAngles: false,
        //     ROMPanel: {
        //   //      canvas: jcanvas,
        //         width: 150,
        //         height: 150,
        //         radius: 70
        //     }
        // };
      

        Setstarttimer(true);
        //Select primary angle based on joint
        let primaryAngles =[]
        console.log("selected joint ",selectedJoint)
        for (let i = 0; i < joints.length; i++) {
            if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && !selectedJoint.includes('Wrist')) {
                primaryAngles.push(joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && !selectedJoint.includes('Shoulder')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 1 value",joints[i].value)
                primaryAngles.push((joints[i].value)-1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Shoulder')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 2 value",joints[i].value)
                primaryAngles.push((joints[i].value)-1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && selectedJoint.includes('Pelvic')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 3 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Pelvic')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 4 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && selectedJoint.includes('Elbow')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 5 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Elbow')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 6 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && selectedJoint.includes('Hip')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 7 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Hip')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 8 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && selectedJoint.includes('Knee')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 9 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Knee')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 10 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('right') && selectedJoint.includes('Neck')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 11 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }else  if (selectedJoint.includes(joints[i].label) && selectedJoint.includes('left') && selectedJoint.includes('Neck')) {
                primaryAngles.push(joints[i].value)
                console.log("joints 12 value",joints[i].value)
                primaryAngles.push((joints[i].value)+1)
                break;

            }
        }
        // for (let i in joints) {
        //     if (joints[i].label.includes(selectedJoint)) {
                
        //     }
        // }
        console.log("angles are ",primaryAngles)
        console.log('cheking parameter//')
        console.log(exerciseName)
        console.log(primaryAngles)
         console.log(rom.min,rom.max)
         console.log(rep_count)
       console.log(exSetValue)
        console.log(primaryAngles, rom);
        console.log('////checking parameter')
        window.darwin.initializeModel(options);
        window.darwin.setExcersiseParams({
            name: exerciseName,
            minAmp: 30,
            primaryAngles:primaryAngles,
            ROMs: [[rom.min, rom.max], [rom.min, rom.max]],
            angles: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11],
            totalReps: rep_count,
            totalSets: exSetValue
                // "name": 'dumbles',
                // "minAmp": 30,
                // "primaryAngles": [2,3],
                // "ROMs": [[90, 120], [90, 120]],
                // "angles": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                // "totalReps": 3,
                // "totalSets": 2
        });
     
        window.darwin.launchModel();
        window.darwin.stop();
        window.darwin.restart();
        //Add timer Here
     //   alert('hiii')
     //   Setstarttimer(true)

    }
    //stopModel


   // setVisible(true)
    // const stopModel = () => {
    //     window.darwin.stop();
    // }
    // //restart
    // const restart = () => {
    //     window.darwin.restart();
    // }
    //UseEffect
    useEffect(() => {
        // let exercise = history.location.state;
        // console.log('exercise nameeeeeee')
        // console.log("check ",history.location.state.exercise)
        // SetcareplanId(history.location.state.exercise.careplanId)
        // console.log(exercise.exercise)
        // SetexerciseTime(exercise.exercise.ChoosenTime)
        // Setcurrentexercise([exercise.exercise.ex_em_id,exercise.exercise.name])

        // // console.log(exercise)
        // if (exercise && exercise.exercise) {
        //     let { name, video_url, Rep, Rom } = exercise.exercise;
        //     setExerciseName(name);
        //     setVideo(video_url);
        //     setRepCount(Rep.rep_count);
        //     setExSetValue(Rep.set);
        //     setSelectedJoint(Rom.joint);
        //     setRom({
        //         ...rom,
        //         min: Rom.min, max: Rom.max
        //     });
        // }
      //  setModelCanvas();
        startModel();
        // eslint-disable-next-line
    }, [exerciseName]);

    //Location Change
    console.log('exericse time')
    console.log(exerciseTime)
    useEffect(() => {
        
        const unblock = history.block((location, action) => {
            // Dipsikha start 23/10
            if (window.confirm("Thank you for completing !!! Click on OK to continue")) {
                window.darwin.stop();
                const video = document.getElementById('video');
                const mediaStream = video.srcObject;
                try{
                    const tracks = mediaStream.getTracks();
                tracks[0].stop();
                tracks.forEach(track => track.stop())
                }
                catch(err)
                {
                    console.log(err)
                }
                return true;
            } else {
                return false;
            }
        });
        return () => {
            unblock();
        };
        
       
    }, [history]);


    //Double Click
    const doubleClicked = () => {
        var elem = document.getElementById("myVideo");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        else {
            alert("This browser doesn't supporter fullscreen");
        }
    }

    const handleChange1 = async  (key, value, id = 0) => {
        dispatch({
          type: STATECHANGE,
          payload: {
            key,
            value
          }
        });
        dispatch({ type: "NOERROR" });
        Setpain(value+1)
        console.log('pain iss' + (value+1)) 
       
      }
   

      const marks1 = {
        0: <SmileOutlined id="smile" style={{ fontSize: 25 }} />,
        1: <MehOutlined style={{ fontSize: 25, color: 'limegreen' }} />,
        2: <FrownOutlined style={{ fontSize: 25, color: 'orange' }} />,
        3: <i class="far fa-tired" style={{ fontSize: 25, color: "red" }}></i>
      };
    
    // Pain Meter
    const PainMeter = () => {

        return (
                <div className="painmeter" style={{width:'60%',marginLeft:'auto',marginRight:'auto'}} > 
                <Slider marks={marks1} min={0} max={3} step={1}
                  onChange={(value) => handleChange1("PainMeter", value)}
                  defaultValue={state.FirstAssesment.PainMeter}
                  style={{ width: '100%' }}
                />

        
                </div>
        );
    };
    //Ai Model
    const AiModel = () => {
        darwin.addProgressListener((setCount, repCount) => {
            // document.getElementById('sets').textContent = `Sets: ${setCount}`;
            // document.getElementById('reps').textContent = `Reps: ${repCount}`;
            setCurrentRep(repCount)
            console.log(setCount)
            setCurrentSet(setCount)
            console.log(setCount,exSetValue)
            if(setCount==exSetValue){
                window.darwin.stop();
             //   alert("Exercise Complete!!") 
                //Add Stop and Painmeter Code Here
                
                setVisible(true)
                Setstarttimer(false)
                data=window.darwin.getCarePlanData() //Send this data to API
              
                // console.log(angles)
                console.log('careplan data is')
                console.log(data)
                console.log('data before')
                setexerciseData(data)
                
            }
          })


         
          console.log(exerciseData)
         let newojb=JSON.stringify(exerciseData)
         console.log('unhashed')
        // console.log(newojb)
           console.log('hashedd')
          let  hashed=Buffer.from(newojb).toString("base64")
          console.log(hashed)
     
        return (
            <>
                <span id="reps"></span>
                <span id="sets"></span>
                <video id="video" style={{position:'absolute',top:'0px'}}  playsinline className="patientAiModel">
                </video>
                <div style={{ position: "relative" }}>
                    <canvas id="output" />
                    <canvas id="jcanvas" />
                </div>
            </>
        )
    }
    const finish=async ()=>{
      
        const response =await  update_careplan(exerciseData,currentexercise,pain,exerciseTime,careplanId)
        console.log('response')
         console.log(response)

        history.push('/patient/schedule')
    }
    //Green Channel 
    const Statistics = () => {
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
                        <p className="p">{exerciseName}</p>
                        <p className="p">{currenset==exSetValue?rep_count:currenRep} of {rep_count}</p>
                        <p className="p">{currenset} of {exSetValue}</p>
                       
                        
                    </Col>
                   
                </Row>
            </>
        )
    };
    return (
        <>
            <div id="info" style={{ display: "none" }}>
            </div>
            <div className="m-3">
                <h3 className="fw-bold">
                    <BackButton />
                    {" "}{exerciseName}
                </h3>
                <Row gutter={[10, 5]}>
                    <Col lg={16} md={16} sm={24} xs={24}
                        id="myVideo"
                        className="border" style={{ minHeight:'600px', cursor: "pointer" }}>
                        {AiModel()}
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24} id="greenChannel">
                        <Row gutter={[5, 5]}>
                        <Col lg={24} md={24} sm={12} xs={24}  className="border" >
                     <UseStopwatchDemo starttimer={starttimer} Setstarttimer={Setstarttimer} />
                     
                            </Col>
                            <Col lg={24} md={24} sm={12} xs={24}  className="border">
                              {Statistics()}
                            </Col>
                            <Col lg={24} md={24} sm={12} xs={24} style={{ minHeight: "32vh" }}>
                                <VideoScreen
                                    height={true}
                                    video={`${process.env.REACT_APP_EXERCISE_URL}/${video}`}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Modal
                title=""
                closable
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
            >
                <h3 className="fw-bold text-center">Congratulation</h3>
                <p className="p text-center mt-2">You have successfully completed the session.</p>
                {PainMeter()}

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
                    <Button className="okay" onClick={finish}>Okay</Button>
                </div>
            </Modal>
        </>
    )
}
export default PatientAI;