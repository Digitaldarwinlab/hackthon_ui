
import { useLocation } from "react-router-dom";
import React, { useEffect, useState,Profiler } from "react";
import { Row, Col, Button } from "antd";
import { isAuthenticated } from "../../../";
const Navigationbar = lazy(() => import("./component/UtilityComponents/Navbar"));
import BackButton from './../shared/BackButton';
import PatCalendar from './PatCalendar';

//Fake Instrunctions
let data = [
    { text: "Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem." },
    { text: "Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem." },
    { text: "Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem." },
    { text: "Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem." }
]
//hostname
let host = window.location.hostname === "localhost";
let url = window.location.origin;
const reloadCount = 0;
// Main Component
const PatientSchedule = () => {
    const location = useLocation();
    const [VideoUrl, setVideoUrl] = useState("");
    const [reloadCount, setreloadCount] = useState(0);
    //Instructions 
    const Instrunction = (data) => {
        return (
            <ol>
                {
                    data.map((val, index) => {
                        return (
                            <li key={index} className="text-justify p">
                                {
                                    val.text
                                }</li>
                        )
                    })
                }
            </ol>
        )
    }

    useEffect(() => {
        console.log(location);
        if (location.state == undefined) {
            console.log("ASD");
        } else {
            console.log("ASDE");
            if (location.state.autorefresh == undefined) {
                console.log("ASDEF");
            } else {
                console.log("ASDEFG");
                if (location.state.autorefresh == 1) {
                    location.state.autorefresh=0
                    console.log("ASDEFGh");
                    window.location.reload();
                }
            }
        }
    
      }, []);
console.log('hellossssssss')
console.log(new Date(1632623460000))
//function for changing videoUrl
const ChangeVideoUrl = (url1) => {
    setVideoUrl(url1);

    //  window.location.reload(false);
}
// window.onload = function() {
//     console.log('useeEffecthyyu PatSchedule ======')
//     if(!window.location.hash) {
//         window.location = window.location + '#loaded';
//         window.location.reload();
//     }
// }
return (

    <>
        <h3 className="fw-bold mt-2 ms-2"><BackButton /></h3>
        <Row className="m-0" justify="space-around">

            <Col span={24} className="text-center" >
                <center>
                    <PatCalendar className="w-100" onChangeVideoUrl={ChangeVideoUrl} />
                </center>
            </Col>

        </Row>

        <Row>
            <Col span={12}>

            </Col>
            <Col span={12}>

            </Col>
        </Row>
    </>
)
};

export default PatientSchedule;