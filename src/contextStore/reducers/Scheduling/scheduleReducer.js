import {
    SCHEDULE_STATECHANGE,
    APPOINTMENT_BOOK_REQUEST,
    APPOINTMENT_BOOK_SUCCESS,
    APPOINTMENT_FAILURE    
} from "./../../actions/scheduleAction.js";

const appointmentInitialState = {
    start_date:"",
    end_date:"",
    type:"",
    status:"",
    location:"",
    reason:"",
    isLoading:false,
    success:""
}

export const scheduleReducer = (state = appointmentInitialState,action)=>{
    switch(action.type) {
        case SCHEDULE_STATECHANGE:
            return {
                ...state,
                isLoading:false,
                success:"",
                [action.payload.key]:action.payload.value
            }
        case APPOINTMENT_BOOK_REQUEST:
            return {
                ...state,
                isLoading:true,
                success:""
            }
        case APPOINTMENT_BOOK_SUCCESS:
            return {
                ...appointmentInitialState,
                isLoading:false,
                success:"Appointment Booked SuccessFully."
            }
        case APPOINTMENT_FAILURE:
            return {
                ...state,
                isLoading:false,
                success:""
            }
        default:
            return {
                ...state
            }
    }
}