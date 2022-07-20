import {
    PHYSIO_STATE_CHANGE,
    PHYSIO_REGISTER_REQUEST,
    PHYSIO_REGISTER_SUCCESS,
    PHYSIO_REGISTER_FAILURE,
    CLEAR_STATE,
    PHYSIO_UPDATE_SUCCESS
} from "./../../actions/physioRegAction.js";

const registerInitialState = {
    first_name: "",
    middle_name: "",
    last_name: "",
    mobile_no: "",
    landline: "",
    whatsapp_no: "",
    Doctor_type: "",
    Address_1: "",
    Address_2: "",
    Address_3: "",
    city: "",
    state: "",
    country: "",
    email: "",
    facebook: "",
    linkedin: "",
    expertise_1_temp:'',
    regd_no_1: "",
    regd_no_2: "",
    degree: "",
    expertise_1: "",
    expertise_2: "",
    expertise_3: "",
    start_date: "",
    end_date: "",
    status_flag: "",
    roleid: "1",
    isLoading: false,
    success: "",
    gender: "",
    id: "",
    role:'',
    type:'',
    isHeadPhysio:false
}

export const physioRegisterReducer = (state = registerInitialState, action) => {
    switch (action.type) {
        case PHYSIO_STATE_CHANGE:
            return {
                ...state,
                isLoading: false,
                success: "",
                [action.payload.key]: action.payload.value
            }
        case PHYSIO_REGISTER_REQUEST:
            return {
                ...state,
                isLoading: true,
                success: ""
            }
        case PHYSIO_REGISTER_SUCCESS:
            return {
                ...registerInitialState,
                isLoading: false,
                success: "Physio Registered SuccessFully."
            }
        case PHYSIO_UPDATE_SUCCESS:
            return {
                ...registerInitialState,
                isLoading: false,
                success: "Physio Information Updated SuccessFully."
            }
        case PHYSIO_REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                success: ""
            }
        case CLEAR_STATE:
            return {
                ...registerInitialState
            }
        default:
            return {
                ...state
            }
    }
}