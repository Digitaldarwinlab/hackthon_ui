import { FETCH_DATA, RECEIVED_DATA } from "../../actions/Assesment";


const initialState = {
    success:""
}

export const jointsKeyReducer = (state = initialState,action) => {
    switch(action.type){
        case FETCH_DATA:
            return {
                ...state,
                isLoading:true
            }
        case FILTER_DATA:
            return {
                ...state,
                isLoading:true
            }
        case RECEIVED_DATA:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}