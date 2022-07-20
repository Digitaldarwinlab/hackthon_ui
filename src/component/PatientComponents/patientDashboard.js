import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Table, Button } from "antd";
import VideoScreen from './shared/VideScreen';
import BackButton from './shared/BackButton';
import AchievedResult from './shared/AchievedResult';
import { FaMedal, FaStopwatch } from "react-icons/fa";
import CircularBar from './shared/CircularProgress';
import BottomCard from './shared/BottomCard';
import PreviousWeekAchievements from './PatientSchedule/PreviousWeekAchievement';
import { GetPatientCurrentEpisode, getPatientProgress } from './../PatientAPI/PatientDashboardApi';
import { useDispatch } from 'react-redux';
import { keyMapping } from './../components/Physio/PhysioList/PhysioList';
import { getAssesment } from "../API/Assesment/getAssesment";
import { fetchCarePlan } from "../API/episode-visit-details/episode-visit-api";
import { fetchVisits } from "../API/episode-visit-details/episode-visit-api";
import { get_prescription } from "../API/Prescription/PresriptionApi";
import Line from './Charts/ChartComponents/line';
import Pie from "./Charts/ChartComponents/pie";
import Bar from "./Charts/ChartComponents/bar";
import StreamLine from "./Charts/ChartComponents/streamline";
import pie_data1 from './Charts/ChartData/data_pie';
import pie_data2 from './Charts/ChartData/data_pie_2';
import line_data1 from './Charts/ChartData/data_line';
import bar_data from './Charts/ChartData/data_bar';
import stream_data from './Charts/ChartData/data_stream.json'


import  './Dashboard.css'
//Style
const flexStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    height: "90%",
    backgroundColor: "#fbfbfb",
    // boxShadow: "2px 2px 1px 1px rgba(0, 0, 0, 0.2)",
    marginBottom:'20px',
    border: '0px',

}
//Data of Achievemetns
const AchievcemntsData = [
    { key: 'Movement', number: 23000 },
    { key: 'Angle', number: 13433 },
];

var filteredData

let about = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam."
const PatientDashboard = () => {
    const userId = JSON.parse(localStorage.getItem("userId"));



    const [visible, setVisible] = React.useState(false);
    const [episode, setEpisode] = React.useState([]);
    const [physioDetailsData, setPhysioDetailsData] = React.useState([]);
    const [dataLine1, setDataLine1] = useState([])
    const dispatch = useDispatch();

    async function getPatientEpisode() {
        let result = await GetPatientCurrentEpisode();
     console.log(result[1]);
        if (!result[0])
            console.log(result, "Pat Episode Api For Dashboard Screen");
        let episodeData = result[1];
        if (episodeData.length !== 0) {
            episodeData[0].PP_Patient_Details = JSON.parse(episodeData[0].PP_Patient_Details);
            episodeData[0].treating_doc_details = JSON.parse(episodeData[0].treating_doc_details);
            let val = episodeData[0].treating_doctor_detail[0];
            let keys = val ? Object.keys(val) : null;
            let index = 0;
            let tempData = [];
           if(keys!=null){
            keys.forEach(key => {
                if (!(["end_date", "status_flag", "roleId", "isLoading", "success", "pp_pm_id"].includes(key))) {
                    if (key === "start_date") {
                        tempData.push({
                            key: index,
                            Field: "Start Date",
                            Value: new Date(val.start_date).toISOString().slice(0, 10)
                        });
                        index += 1;
                    } else if (key === "Doctor_type") {
                        tempData.push({
                            key: index,
                            Field: "Doctor Type",
                            Value: val.Doctor_type === 1 ? "Treating Doctor" : val.Doctor_type === 2 ? "Referring Doctor" : "Both (Treating And Referring Doctor)"
                        });
                        index += 1;
                    } else if (val[key] !== null && val[key] !== "NULL" && (val[key] !== "")) {
                        tempData.push({
                            key: index,
                            Field: keyMapping[key],
                            Value: val[key]
                        });
                        index += 1;
                    }
                }
            });
        }
            setPhysioDetailsData(tempData);
            dispatch({
                type: "changeEpisodeId", payload: {
                    value: episodeData[0].pp_ed_id
                }
            })
        }
       
       

        console.log('episode data is ',episodeData)
        episodeData.length>0 && setEpisode(episodeData);    
        
    }

    //UseEffect
    useEffect( async () => {
        const progres = await getPatientProgress();
        console.log("progress is ",progres)
        koos_score[0]["score"] = progres.Symptoms_koos_score ;
        koos_score[1]["score"] = progres.Stiffness_koos_score ;
        koos_score[2]["score"] = progres.pain_koos_score ;
        koos_score[3]["score"] = progres.DailyLiving_koos_score ;
        koos_score[4]["score"] = progres.Sports_koos_score ;
        koos_score[5]["score"] = progres.Life_koos_score ;
        console.log('koos upfdate',koos_score)
        
        progres.data_line&&setDataLine1(progres.data_line);
        getPatientEpisode();

        const currentPatientAssesment=await getAssesment(userId)
        console.log(currentPatientAssesment)
        let result = await GetPatientCurrentEpisode();
        console.log(result)
        if(result[1][0])
        {
            const patientPrescription=await get_prescription(result[1][0].pp_ed_id)
            console.log(patientPrescription)
            const careplan=await fetchCarePlan(result[1][0].pp_ed_id)
           
           console.log('careplan')
            console.log(careplan)
             
        }
        


        const patientVisits=await fetchVisits(userId)
        console.log('visits')
        console.log(patientVisits)
        console.log(typeof(patientVisits))
        const po=[1,2,3]
        console.log(typeof(po))
        try{
            filteredData = patientVisits.map((val, index) => {
                return {
                    key: val.pp_vd_id,
                    visit: (index + 1),
                    date: new Date(val.appointment_detail.startDate).toISOString().slice(0, 10),
                    time: val.appointment_detail.start_time,
                    conLink: val.video_link,
                }
            });
        }
       catch(err)
       {
           console.log(err)
       }
        // eslint-disable-next-line
    }, []);
    const [koos_score, setKoosScore] = useState([
        {
            koos: "Symptoms",
            score: 0,
            scoreColor: "hsl(59, 70%, 50%)"
        },
        {
            koos: "Stiffness",
            score: 0,
            scoreColor: "hsl(289, 70%, 50%)"
        },
        {
            koos: "Pain",
            score: 0,
            scoreColor: "hsl(319, 70%, 50%)"
        },
        {
            koos: "Daily Living",
            score: 0,
            scoreColor: "hsl(25, 70%, 50%)"
        },
        {
            koos: "Sports",
            score: 0,
            scoreColor: "hsl(38, 70%, 50%)"
        },
        {
            koos: "QOL",
            score: 0,
            scoreColor: "hsl(279, 70%, 50%)"
        }
    ])
    
    
    //Treating Doctor Details
    const DoctorDetails = () => {
        return (
            <Modal
                visible={visible}
                closable
                onCancel={() => setVisible(false)}
                footer={null}
                title=""
                centered
            >
                <div>
                    <div>
                        <img src="" alt="Doctor Profile" width={90} height={85} style={{ borderRadius: 35,  }} />
                    </div>
                    <hr />
                    <div className="ms-2">
                        <Table pagination={false}
                            scroll={{ y: 400 }}
                            showHeader={false}
                            columns={[{ title: "Field", dataIndex: "Field", render: (text) => <p className="fw-bold">{text}</p> },
                            { title: "Value", dataIndex: "Value" }]} dataSource={physioDetailsData} />
                    </div>
                </div>

            </Modal>
        )
    }

    const VideoCon = () => {
        const vidLink=filteredData[filteredData.length-1].conLink
        window.open("/patient"+vidLink, "_blank");
    }

    return (
        <>
        <div className="newMain_container">
         <Row justify="center">
            <Col span={24}>
            <h1>Introduction Video</h1>
            <div style={{minHeight:'20px'}}></div>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={24}>
            <VideoScreen className="video-play" 
            video={process.env.REACT_APP_EXERCISE_URL+"/images/v1/introVideo.mp4"} 
            height={true} />
            </Col>
          </Row>
          </div>
        </>
    )
}
export default PatientDashboard;