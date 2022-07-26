import React, { useEffect, useState } from "react";
import BackButton from './../shared/BackButton';
import { isAuthenticated } from "../../../API/userAuth";
import Navigationbar  from ("../component/UtilityComponents/Navbar")
import { Row, Col, Form, Select, Button } from 'antd';
import LinearProgress from './../shared/LinearProgress';
import CircularBar from './../shared/CircularProgress';
import BottomCard from './../shared/BottomCard';
import './Profile.css'
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../../component/UI/antInputs/FormInput";
// import FormDate from "../../components/UI/antInputs/FormDate";
import { GetPatientCurrentEpisode } from '../../PatientAPI/PatientDashboardApi'
import validation from '../../../component/Validation/authValidation/authValidation'
import { useHistory } from 'react-router-dom';
import { UpdateState } from '../../../API/PatientRegistration/Patient'
import { Patient_profile } from '../../../API/PatientRegistration/Patient'
import { STATECHANGE, VALIDATION, BASIC_CLEARSTATE, PATIENT_REG_FAILURE } from '../../../contextStore/actions/authAction'
import { Patient_Update } from '../../../API/PatientRegistration/Patient'
import StateCity from '../../UtilityComponents/dummyData/state_city.json'
let about = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,molestiae quas vel sint commodi";
//Style


const styles = {
    notesView: {
        backgroundColor: "#fbfbfb",
        padding: 12,
        height: "auto",
        boxShadow: "2px 2px 1px 1px rgba(0, 0, 0, 0.2)"
    }
};
const PatientProfile = () => {
    const history = useHistory()
    const state = useSelector(state => state.basicDetailsInitialState);
    const newstate = useSelector(state => state)
    const dispatch = useDispatch();
    const handleChange = (key, value, id = 0) => {
        dispatch({
            type: STATECHANGE,
            payload: {
                key,
                value
            }
        });
        if (key === "State") {
            if (!value)
                setCityList([]);
            else
                setCityList(StateCity[value]);
        }
        dispatch({ type: "NOERROR" });
    }

    const handleBlur = e => {
        const key = e.target.name;
        let error = {};
        if (key === "Email") {
            error = validation.checkEmailValidation(e.target.value);
        }
        else if (key === "pincode") {
            error = validation.checkPincodeValidation(e.target.value);
        }
        else if (key === "Address") {
            error = validation.checkAddrValidation(e.target.value);
        } else if (key === "EmergencyContact") {
            error = validation.checkMobNoValidation(e.target.value);
            if (error.error)
                error.error = "Emergency " + error.error;
        }

        else if (key === "MobileNo" || key === "WhatsAppNo") {
            error = validation.checkMobNoValidation(e.target.value);
            if (error.error) {
                if (key === "MobileNo")
                    error.error = "Mobile " + error.error;
                else
                    error.error = "Whatsapp " + error.error;
            }
        }
        if (error.error) {
            dispatch({ type: VALIDATION, payload: { error: error.error } });
            setTimeout(() => {
                dispatch({ type: VALIDATION, payload: { error: "" } });
            }, 3000);
        }
    }

    const handleOk = async () => {
        let result;
        console.log("user data ", newstate.BasicDetails)
        result = await Patient_Update(newstate.BasicDetails, dispatch);
        console.log(result)
        if (result && result[0]) {
            window.location.href = "/patient/profile";
            // if(JSON.parse(localStorage.getItem("user")).role=='enterprise_patient')
            //     {
            //     }
            //     else
            //     {
            //         window.location.href = "/pateints";
            //     }

        } else {
            dispatch({ type: PATIENT_REG_FAILURE });
            dispatch({ type: VALIDATION, payload: { error: result[1] } });
            setTimeout(() => {
                dispatch({ type: VALIDATION, payload: { error: "" } });
            }, 3000);
        }
    };
    const [form] = Form.useForm();
    const [cityList, setCityList] = useState([]);
    const [patientData, SetpatientData] = useState({})
    const [isupdating, Setisupdating] = useState(false)
    const callProfile = async () => {
        const henry = await Patient_profile(JSON.parse(localStorage.getItem("userId")))
        console.log("user data ", henry)
        SetpatientData(henry)
    }
    useEffect(() => {

    callProfile()



    }, [])



    //ProfilePhoto
    const ProfilePhoto = () => {
        let userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).info : { first_name: "Anonymous" };
        let patientName = userInfo.first_name;
        patientName += (userInfo.middle_name ? " " + userInfo.middle_name : "");
        patientName += (userInfo.last_name ? " " + userInfo.last_name : "");
        return (
            <>
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="Profile Image" width="70%" height="auto" style={{ borderRadius: 10, }} />
                <h4 className="">{patientName}</h4>
            </>
        )
    }


    const edit = () => {
        Setisupdating(true)
        UpdateState(state, patientData, dispatch);
        // history.push('/patient/update');
    }

    // const handleReset=()=>{
    //     if (state.physioRegisterReducer.id) {
    //         if (window.confirm("Confirm, Do You want to Cancel Update?")) {
    //             dispatch({ type: CLEAR_STATE });
    //           //  history.push("/physio/list");

    //         }
    //     } else {
    //         if (window.confirm("Confirm, Do You want to Reset all fields?")) {
    //             dispatch({ type: CLEAR_STATE });
    //             form.resetFields()
    //           //  history.push("/physio/register");
    //         }
    //     }

    // }
    //Current Therapy
    const CurrentTherapy = (therapy, progress) => {
        return (
            <>
                <h4 className="fw-bold">Current Therapy</h4>
                <div style={styles.notesView} className="border current-therapy" id="current-therapy">
                    <h5 className="fw-bold">{therapy}</h5>
                    <p className="text-justify">
                        Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum.
                    </p>
                    <LinearProgress progress={progress} />
                    <p className="p fw-bold">{progress}%</p>
                </div>
            </>
        )
    }
    //Track Progress
    const TrackProgress = (score, total, color, text) => {
        return (
            <div className="text-center">
                <CircularBar color={color} precentage={score / total * 100} score={score} width="48%" />
                <h4 className="fw-bold">{text}</h4>
            </div>
        )
    }
    return (
        <>
        {isAuthenticated() && <Navigationbar />}
            <h3 className="fw-bold mt-2 ms-2"><BackButton /></h3>
            <Row className="m-2 main-container" id="main-container" >
                <Col className="lefting-box" id="left-box">
                    <Row className="text-center left-row">
                        <Col className="profile-col" id="profile-col">
                            {ProfilePhoto()}
                        </Col>
                        <Col className="current-therapy-col" id="current-therapy-col">
                            <center> {CurrentTherapy("Knee Therapy", 75)}</center>
                        </Col>
                    </Row>
                </Col>
                <Col className='righting-box' id="right-box">
                    <Row className="right-row" id="right-row">
                        <Col className="border" style={styles.notesView}>
                            <h4 className="fw-bold px-1 py-1">Track Progress</h4>
                            <div className="TrackProgress" style={{ display: "flex", justifyContent: "space-around" }}>
                                {TrackProgress(2500, 6000, "#df916b", "Current")}
                                {TrackProgress(5000, 6000, "#0559a9", "Last Week")}
                                {TrackProgress(3000, 6000, "#e8dc38", "Progress")}
                            </div>
                        </Col>
                        <div className="outer-box border">
                            <Row gutter={[10, 10]} className="pt-4  detail-row">
                                <Col span={8}>
                                    <b>Dob :  </b>  {patientData.dob}
                                </Col>
                                <Col span={8}>
                                    <b>Gender :  </b>  {patientData.gender}
                                </Col>
                                <Col span={8}>
                                    <b>Blood Group :  </b>  {patientData.blood_group}
                                </Col>

                            </Row>
                            <Row gutter={[10, 10]} className="pt-4  detail-row">
                                <Col span={8}>
                                    <b>Mobile No :  </b> <span className="edit-value" id="mobile"> {isupdating ?

                                        <FormInput
                                            name="MobileNo"
                                            className="input-field"
                                            value={newstate.BasicDetails.MobileNo}
                                            placeholder="Enter Patient Mobile Number"
                                            required={true}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue={newstate.BasicDetails.MobileNo}
                                        />



                                        : patientData.mobile_no}</span>
                                </Col>
                                <Col span={8}>
                                    <b>Landline :  </b> <span className="edit-value" id="landline">  {isupdating ?

                                        <FormInput
                                            name="LandlineNo"
                                            className="input-field "
                                            value={newstate.BasicDetails.LandlineNo}
                                            placeholder="Enter Patient Landline Number"
                                            required={true}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            defaultValue={newstate.BasicDetails.LandlineNo}
                                        /> : patientData.landline} </span>
                                </Col>
                                <Col span={8}>
                                    <b>whatsapp number:</b>  <span className="edit-value" id="whatsapp"> {isupdating ?

                                        <FormInput
                                            name="WhatsAppNo"
                                            className="input-field"
                                            value={newstate.BasicDetails.WhatsAppNo}
                                            placeholder="Enter Patient WhatsApp Number"
                                            required={true}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue={newstate.BasicDetails.WhatsAppNo}
                                        />


                                        : patientData.whatsapp_no} </span>
                                </Col>

                            </Row>
                            <Row gutter={[10, 10]} className="pt-4  detail-row">
                                <Col span={8}>
                                    <b>E-mail :  </b> <span className="edit-value">  {isupdating ?
                                        <FormInput
                                            required="true"
                                            name="Email"
                                            className="input-field"
                                            value={newstate.BasicDetails.Email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue={newstate.BasicDetails.Email} />



                                        : patientData.email}</span>
                                </Col>
                                <Col span={8}>
                                    <b>Pincode :  </b>  {isupdating ?
                                        <FormInput
                                            required="true"
                                            name="pincode"
                                            className="input-field w-100"
                                            value={newstate.BasicDetails.pincode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue={newstate.BasicDetails.pincode}
                                        />

                                        :


                                        patientData.pin}
                                </Col>
                                <Col span={8}>
                                    <b>Emergency Contact:  </b><span className="edit-value" id="emergency">   {isupdating ?
                                        <FormInput
                                            required="true"
                                            name="EmergencyContact"
                                            className="input-field" style={{ width: '10px' }}
                                            value={newstate.BasicDetails.EmergencyContact}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue={newstate.BasicDetails.EmergencyContact}
                                        />
                                        :

                                        patientData.emergence_contact}</span>
                                </Col>

                            </Row>
                            <div className="buttons">

                                {isupdating ? <Button className="text-end" id="cancel" onClick={() => Setisupdating(false)}  > Cancel</Button> : null}
                                {isupdating ? <Button className="text-end btncolor edit-btn" onClick={handleOk}  > Update</Button> : <Button className="btncolor edit-btn" onClick={edit} > Edit</Button>}

                            </div>

                        </div>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
export default PatientProfile;