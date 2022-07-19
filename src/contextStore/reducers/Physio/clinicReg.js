import { 
    CLINIC_STATE_CHANGE,
    CLINIC_REGISTER_REQUEST,
    CLINIC_REGISTER_SUCCESS,
    CLINIC_CLEAR_STATE,
    CLINIC_REGISTER_FAILED
} from './../../actions/ClinicRegister';

const clinicInitialState = {
    name:"",
    address_1:"",
    address_2:"",
    address_3:"",
    city:"",
    state:"",
    country:"",
    zip:"",
    estab_date:"",
    mobile_no:"",
    landline_no:"",
    whatsapp_no:"",
    email:"",
    website_url:"",
    isLoading:false,
    success:"",
    clinics:[]
}
export const clinicReg = (state = clinicInitialState,action)=>{
    switch (action.type) {
        case CLINIC_STATE_CHANGE:
            return {
                ...state,
                isLoading:false,
                success:"",
                [action.payload.key]:action.payload.value
            }
        case CLINIC_REGISTER_REQUEST: 
            return {
                ...state,
                isLoading:true,
                success:""
            } 
        case CLINIC_REGISTER_SUCCESS:
            return {
                ...state,
                isLoading:false,
                success:"Registered SuccessFully."
            }
            case "CLINIC_REGISTER_FAILURE":
            return {
                ...state,
                isLoading:false,
                success:"Registration Failed."
            }
            case "UPDATE_ORGANIZATION_FAILURE":
                return {
                    ...state,
                    isLoading:false,
                    success:"Failed to Update."
                }
                case "UPDATE_ORGANIZATION_SUCCESS":
                    return {
                        ...state,
                        isLoading:false,
                        success:"Updated Successfully."
                    }
        case CLINIC_CLEAR_STATE:
            return {
                ...clinicInitialState
            }
        case CLINIC_REGISTER_FAILED:
            return {
                    ...state,
                    isLoading:false,
                }    
        default:
            return {
                ...state
            }
    }
}