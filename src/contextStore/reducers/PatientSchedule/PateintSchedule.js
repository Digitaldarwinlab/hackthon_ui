import { PATIENT_STATECHANGE } from "../../actions/ParientAction";

//Episode Id State
const episode = {
    pp_ed_id: "",
    prescription:[],
    current_pres:{},
    comp:[]
};

function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

const setPres =(data) =>{
    let temp = []
    for(let i=0;i<data.length;i++){
        if(convert(new Date) === data[i].date){
            temp.push(data[i])
        }
      }
      return temp
}
export const patCurrentEpisode = (state = episode, action) => {
    switch (action.type) {
        case PATIENT_STATECHANGE: 
            return{ 
                ...state, 
                isLoading:false,
                success:"",
                [action.payload.key]:action.payload.value
            }
        case "changeEpisodeId":
            return {
                ...state,
                pp_ed_id: action.payload.value
            }
        case "PRESCRIPTION_CHANGE":
            return {
                ...state,
                prescription:setPres(action.payload.value),
                current_pres:action.payload.value[action.payload.value.length-1]
            }
        case "CURRENT_PRESCRIPTION_CHANGE":
            return {
                    ...state,
                    current_pres:action.payload.value
            }            
        default:
            return {
                ...state
            }
    }
}