import {
    STATECHANGE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    BASIC_CLEARSTATE,
    PATIENT_REG_REQUEST,
    PATIENT_REG_SUCCESS,
    PATIENT_REG_FAILURE,
    PATIENT_UPD_SUCCESS,
    VALIDATION,
    BASIC_CLEARSTATE2,
    BASIC_CLEARSTATE3
} from "./../../actions/authAction";

const signupInitialState = {
    old_password: "",
    new_password: "",
    confirm_password: "",
    isLoading: false,
    success: ""
}

const loginInitialState = {
    email: "",
    password: "",
    isLoading: false,
    success: "",
    login_attempt: 0
}

const basicDetailsInitialState = {
    MiddleName: "",
    Title:"",
    FirstName: "",
    LastName: "",
    MobileNo: "",
    WhatsAppNo: "",
    bloodType: "",
    DOB: "",
    Age: "",
    Gender: "",
    LandlineNo: "",
    Address: "",
    pincode: "",
    City: "",
    State: "",
    Country: "",
    EmergencyContact: "",
    Email: "",
    Facebook: "",
    LinkedIn: "",
    Allergies: "",
    MedicalHistory: "",
    FamilyHistory: "",
    isLoading: false,
    success: "",
    pp_patm_id: "",
    pp_em_id:"",
    is_enterprise:false,
}

const validationState = {
    error: "",
}
export const signupReducer = (state = signupInitialState, action) => {
    switch (action.type) {
        case STATECHANGE:
            return {
                ...state,
                isLoading: false,
                success: "",
                [action.payload.key]: action.payload.value
            }
        case SIGNUP_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case SIGNUP_SUCCESS:
            return {
                ...signupInitialState,
                isLoading: false,
                success: "Password Changed SuccessFully Done."
            }
        case SIGNUP_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: ""
            }
        default:
            return state;
    }
}

export const loginReducer = (state = loginInitialState, action) => {
    switch (action.type) {
        case STATECHANGE:
            return {
                ...state,
                isLoading: false,
                success: "",
                [action.payload.key]: action.payload.value
            }
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case LOGIN_SUCCESS:
            return {
                ...loginInitialState,
                isLoading: false,
                success: "Login SuccessFully Done.",
                login_attempt: 0
            }

        case LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: "",
                login_attempt: state.login_attempt + 1
            }
        default:
            return state;
    }
}


// patient Registration
export const BasicDetails = (state = basicDetailsInitialState, action) => {
    switch (action.type) {
        case STATECHANGE:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case PATIENT_REG_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case PATIENT_REG_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: "Patient Registered Successfull."
            }
        case PATIENT_UPD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                success: "Patient Information Updated Successfull."
            }
        case PATIENT_REG_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: ""
            }
        case BASIC_CLEARSTATE:
            return {
                ...basicDetailsInitialState
            }
        case BASIC_CLEARSTATE2:
            return {
                ...state,
                Address: "",
                pincode: "",
                City: "",
                State: "",
                Country: "",
                EmergencyContact: "",
                Email: "",
                Facebook: "",
                LinkedIn: "",
            }
        case BASIC_CLEARSTATE3:
            return {
                ...state,
                Allergies: "",
                MedicalHistory: "",
                FamilyHistory: "",
            }    
        default:
            return state;
    }
}


//validation
export const Validation = (state = validationState, action) => {
    switch (action.type) {
        case VALIDATION:
            return {
                ...state,
                error: action.payload.error
            }
        case "EPISODE_CHECK":
            return{
                ...state,
                episode_check:"failed",
                msg:action.payload
            }    
        case "NOERROR":
            return {
                ...validationState
            }
        default:
            return state;
    }
}

