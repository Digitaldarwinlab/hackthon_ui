import {React,useEffect,useState} from 'react'
import {Row,Col}  from 'antd'
import BackButton from '../shared/BackButton'
import { useLocation } from 'react-router'
import { useHistory } from 'react-router'

import VideoScreen from '../shared/VideScreen'
import AchievedResult from '../shared/AchievedResult'
import CircularBar from '../shared/CircularProgress'
import { FaMedal, FaStopwatch } from "react-icons/fa";
import {Button} from 'antd';



const PatientProgress=()=>{


    return(
        <div className="progress">
              <h3 className="fw-bold mt-2 ms-2"><BackButton /></h3>
            <Row className="main-container">
                <Col className="left-box"></Col>
                <Col className="right-box"></Col>
            </Row>
        </div>
    )

}

export default PatientProgress