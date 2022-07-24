import {
    PATIENT_REG_REQUEST,
    PATIENT_REG_SUCCESS,
    PATIENT_UPD_SUCCESS
} from "../../contextStore/actions/authAction";
// import fetch from "isomorphic-fetch";
import { STATECHANGE } from './../../contextStore/actions/authAction';
import { Decode, Encode } from "../../component/Encode/hashing";

export const Patient_Register = async (user, dispatch) => {
    dispatch({ type: PATIENT_REG_REQUEST });
    let patientDetails = {};
    patientDetails["first_name"] = user.FirstName;
    patientDetails["last_name"] = user.LastName;
    patientDetails["middle_name"] = user.MiddleName;
    patientDetails["mobile_no"] = user.MobileNo;
    patientDetails["whatsapp_no"] = user.WhatsAppNo;
    patientDetails["blood_group"] = user.bloodType;
    patientDetails["dob"] = user.DOB;
    patientDetails["age"] = user.Age;
    patientDetails["gender"] = user.Gender;
    patientDetails["landline"] = user.LandlineNo;
    patientDetails["Address_1"] = user.Address;
    patientDetails["pin"] = user.pincode;
    patientDetails["city"] = user.City;
    patientDetails["state"] = user.State;
    patientDetails["country"] = user.Country;
    patientDetails["emergence_contact"] = user.EmergencyContact;
    patientDetails["email"] = user.Email;
    patientDetails["facebook"] = user.Facebook;
    patientDetails["linkedin"] = user.LinkedIn;
    patientDetails["allergy_detail"] = user.Allergies;
    patientDetails["patient_medical_history"] = user.MedicalHistory;
    patientDetails["patient_Family_History"] = user.FamilyHistory;
    patientDetails["pp_pm"] = JSON.parse(localStorage.getItem("userId"));
    //patientDetails["is_enterprise"] = user.is_enterprise;

    if (patientDetails['middle_name'] === "")
        delete patientDetails["middle_name"];

    const headers = {
        Accept: 'application/json',
        "Content-type": "application/json"
    }
    const encodedData = Encode(patientDetails);
    try {
        const response = await fetch("https://hackathon.physioai.care/api" + "/add-patient_v1/", {
            headers: headers,
            method: "POST",
            body: JSON.stringify(encodedData)
        });
        const responseData = await response.json();
        const data = Decode(responseData);
        if (data && data.role) {
            dispatch({ type: PATIENT_REG_SUCCESS });
            return [true];
        } else {
            if (data) {
                const values = Object.values(data);
                if (values.length === 0)
                    return [false, "Check if any field is not empty"];
                else
                    return [false, "Error: " + response.status + " " + values[0]];
            } else {
                return [false, "Error: " + response.status + " " + response.statusText];
            }
        }
    } catch (err) {
        return [false, "Error: 501" + " " + err.message];
    }
}
export const Patient_Update = async (user, dispatch) => {
    dispatch({ type: PATIENT_REG_REQUEST });
    let patientDetails = {};
    patientDetails["first_name"] = user.FirstName;
    patientDetails["last_name"] = user.LastName;
    patientDetails["middle_name"] = user.MiddleName;
    patientDetails["mobile_no"] = user.MobileNo;
    patientDetails["whatsapp_no"] = user.WhatsAppNo;
    patientDetails["blood_group"] = user.bloodType;
    patientDetails["dob"] = user.DOB;
    patientDetails["age"] = user.Age;
    patientDetails["gender"] = user.Gender;
    patientDetails["landline"] = user.LandlineNo;
    patientDetails["Address_1"] = user.Address;
    patientDetails["pin"] = user.pincode;
    patientDetails["city"] = user.City;
    patientDetails["state"] = user.State;
    patientDetails["country"] = user.Country;
    patientDetails["emergence_contact"] = user.EmergencyContact;
    patientDetails["email"] = user.Email;
    patientDetails["facebook"] = user.Facebook;
    patientDetails["linkedin"] = user.LinkedIn;
    patientDetails["allergy_detail"] = user.Allergies;
    patientDetails["patient_medical_history"] = user.MedicalHistory;
    patientDetails["patient_Family_History"] = user.FamilyHistory;
    patientDetails["id"] = user.pp_em_id;
 

    if (patientDetails['middle_name'] === "" || !patientDetails['middle_name'])
        delete patientDetails["middle_name"];

    const headers = {
        Accept: 'application/json',
        "Content-type": "application/json"
    }
    //const encodedData = Encode(patientDetails)
    // console.log(patientDetails)
    try {
        const response = await fetch("https://hackathon.physioai.care/api" + "/update_emp/", {
            headers: headers,
            method: "POST",
            body: JSON.stringify(patientDetails)
        });

        // console.log(response)
        const data = await response.json();
       // const data = Decode(responseData);
        if (data && data.message) {
            dispatch({ type: PATIENT_UPD_SUCCESS });
            return [true];
        } else {
            if (data) {
                const values = Object.values(data);
                if (values.length === 0)
                    return [false, "Check if any field is not empty"];
                else
                    return [false, "Error: " + response.status + " " + values[0]];
            } else {
                return [false, "Error: " + response.status + " " + response.statusText];
            }
        }
    } catch (err) {
        return [false, "Error: 501" + " " + err.message];
    }
}
//get-patient List
export const getPatientList = async () => {
    try {
        const headers = {
            Accept: 'application/json',
            "Content-type": "application/json"
        }
        const id = JSON.parse(localStorage.getItem("userId"))
        const encodedData = Encode({ id: id })
        // console.log('Id:',id);
        const response = await fetch("https://hackathon.physioai.care/api" + "/get-patient_v1/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(encodedData)
        });

        const responseData = await response.json();
        console.log("listing data ",responseData)
        const data = Decode(responseData)
        console.log("listing data ",data)
        if (response.status !== 200 && response.status !== 201) {
            return [];
        }
        return data;
    } catch (err) {
        // console.log(err);
        return [];
    }
}
//search-patient
export const searchPatient = async (value) => {
    const id = JSON.parse(localStorage.getItem("userId"))
    // console.log(JSON.stringify({ id: id, query: value}))
    
    try {
        const headers = {
            Accept: 'application/json',
            "Content-type": "application/json"
        }
       

        const response = await fetch("https://hackathon.physioai.care/api" + "/search-patient/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: id, query: value})
        });
        // console.log(response)
        const data = await response.json();
        // console.log(data)
       
        if (response.status !== 200 && response.status !== 201) {
            return [];
        }
        return data;
    } catch (err) {
        // console.log(err);
        return [];
    }
}
//get Episode based on Patient Id
//@param patId
//@result - episode Details
export const getExercise = async (patid) => {
    try {
        const headers = {
            Accept: 'application/json',
            "Content-type": "application/json"
        }

        const response = await fetch("https://hackathon.physioai.care/api" + "/get_episode/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: patid })
        });
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            return "";
        }

        if (data.length !== 0) {
            return data[0].pp_ed_id
        }
        return ""
    } catch (err) {
        // console.log(err);
        return "";
    }
}


export const Patient_profile = async (Id) => {
    try {
        const headers = {
            Accept: 'application/json',
            "Content-type": "application/json"
        }
        
        //const encodedData = Encode();
        const response = await fetch("https://hackathon.physioai.care/api" + "/get_employees/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: Id })
        });

        const responseData = await response.json();
        //const data = Decode(responseData);
        if (response.status !== 200 && response.status !== 201) {
            return [];
        }
        return responseData;
    } catch (err) {
        // console.log(err);
        return [];
    }
}

//Update State of Patient 
export const UpdateState = (state, val, dispatch) => {
    console.log("user data ,",val)
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "FirstName",
            value: val.first_name
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "LandlineNo",
            value: val.landline
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "MiddleName",
            value: val.middle_name
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "LastName",
            value: val.last_name
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "MobileNo",
            value: val.mobile_no
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "WhatsAppNo",
            value: val.whatsapp_no
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "bloodType",
            value: val.blood_group
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Gender",
            value: val.gender ? val.gender : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Address",
            value: val.Address_1
        }
    })

    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Address",
            value: val.Address_1
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Address",
            value: val.Address_1
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "pincode",
            value: val.pin
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "City",
            value: val.city
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "State",
            value: val.state
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "DOB",
            value: val.dob
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Country",
            value: val.country
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "EmergencyContact",
            value: val.emergence_contact
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Email",
            value: val.email
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Facebook",
            value: val.facebook ? val.facebook : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "LinkedIn",
            value: val.linkedin ? val.linkedin : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "Allergies",
            value: val.allergy_detail ? val.allergy_detail : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "MedicalHistory",
            value: val.patient_medical_history ? val.patient_medical_history : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "FamilyHistory",
            value: val.patient_Family_History ? val.patient_Family_History : ""
        }
    })
    dispatch({
        type: STATECHANGE,
        payload: {
            key: "pp_em_id",
            value: val.pp_em_id ? val.pp_em_id : ""
        }
    })
}