import {
    EPISODE_STATECHANGE,
    EPISODE_BOOK_REQUEST,
    EPISODE_BOOK_SUCCESS,
    PATIENT_CONSENT_FORM_RENDER,
    EPISODE_BOOK_FAILURE,
    EPISODE_CLEAR_STATE
} from "./../../actions/episode.js";

const episodeInitialState = {
  
    employee_code:"",
    patient_main_code:"",
    patient_code: "",
    patient_name: "",
    Patient_no: "",
    Ref_Dr_Name: "",
    Ref_Dr_ID: "",
    start_date: "",
    end_date: "",
    complaint: "",
    Operative_Types: "",
    //aswin 11/1/2021 start
    file: [],
    //aswin 11/1/2021 stop
    Patient_History: "",
    Closure_Notes: "",
    episode_id: "",
    isLoading: false,
    success: ""
}

const consentFormState = {
    show: true
}

export const episodeReducer = (state = episodeInitialState, action) => {
    // console.log('EPISODE_CLEAR_STATE')
    // console.log(action.type)
    switch (action.type) {
        case EPISODE_STATECHANGE:
            return {
                ...state,
                isLoading: false,
                success: "",
                [action.payload.key]: action.payload.value
            }
        case EPISODE_BOOK_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case EPISODE_BOOK_SUCCESS:
            return {
                ...episodeInitialState,
                isLoading: false,
                success: "episode added"
            }
        case EPISODE_BOOK_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: ""
            }
        case EPISODE_CLEAR_STATE:
            
            return {
                ...episodeInitialState,
                isLoading: false,
                success: "",
                 patient_main_code:state.patient_main_code,
                patient_code: state.patient_code,
                patient_name: state.patient_name,
                Patient_no: state.Patient_no,
                employee_code:state.employee_code
            }
        
        case "EPISODE_FULL_CLEAR_STATE":
            return {
                ...episodeInitialState
            }
        default:
            return {
                ...state
            }
    }
}

export const PateintConsentReducer = (state = consentFormState, action) => {
    switch (action.type) {
        case PATIENT_CONSENT_FORM_RENDER:
            return {
                show: false
            }
        default:
            return {
                ...state
            }
    }
}