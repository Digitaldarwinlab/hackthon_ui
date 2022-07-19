import { ADD_VISIT } from "../../actions/newVisit/types";
import moment from "moment";

// const dayValue = { data: { date: moment(), time: '13:30:56' } };
// console.log(dayValue);
const enableTime = () => {
  let time = new Date().toUTCString().slice(17,19);

const date = new Date().toUTCString();

time =( +time )%24;
let newDate = +new Date().toUTCString().slice(5,7) ;

if(time < 7){

   newDate = newDate+1
}

 if(time.toString().length == 1){
    time = '0'+time + ':30:00';
 }else {
     time = time+':30:00'
 }
 
 newDate =newDate + date.slice(7,17) + time + ' GMT';
 return newDate;
}

const dayValue = enableTime();
console.log('From Calender...',dayValue);

const initialState = {
  patient: '',
  pp_ed_id: '',
  episode: '',
  date: moment(dayValue),
  duration: '',
  visitType: '',
  status: '',
  location: '',
  link: '',
  notes: '',
  isRepeat:'',
  repeat:'weekly',
  days:[],
  visit_number:0,
  occurence:1,
  id:'',
  created_by:'',
}



export default function Calender (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'NAME':
      return {
        ...state,
        patient: payload.name,
      };
    case 'EPISODE_ID':
      return {
        ...state,
        pp_ed_id:payload.episode,
      }
      case 'VISIT_DATE':
      return {
        ...state,
        date:payload.date,
      }
      case 'DURATION':
      return {
        ...state,
        duration:payload.duration,
      }
      case 'VISIT_TYPE':
      return {
        ...state,
        visitType:payload.visitType,
      }
      case 'VISIT_STATUS':
      
      return {
        ...state,
        status:payload.status,
      }
      case 'LOCATION':
      return {
        ...state,
        location:payload.location,
      }
      case 'VISIT_LINK':
        return {
          ...state,
          link:payload.link,
        }
        case 'NOTES':
          return {
            ...state,
            notes:payload.notes,
          }
        case 'DAYS':
          return {
            ...state,
            days:payload.days || []
          }
        case 'ADD_DAY':
          {
            const newDays = [...state.days,payload.day];
            return {
              ...state,
              days:newDays
            }
          }
          case 'REMOVE_DAY':
            {
              const newDays = state.days.filter(eachDay => eachDay !== payload.day)
              return {
                ...state,
                days:newDays
              }
            }

        case 'OCCURENCE':
          return {
            ...state,
            occurence:payload.occurence 
          }
        case 'VISIT_NUMBER':
          return {
            ...state,
            visit_number:payload.visit_number
          }
        case 'IS_REPEAT':
          return {
            ...state,
            isRepeat:payload.isRepeat 
          }
        case 'VISIT_ID':
          return {
            ...state,
            id:payload.id
          }
        case 'CREATED_BY':
          return {
            ...state,
            created_by:payload.created_by
          }
        case 'CLEAR_VISIT':
          return initialState;
      // status: '',
      // location: '',
      // link: '',
      // notes: '',
      //             days: (3) ['monday', 'wednesday', 'friday']
// isRepeat: 1
// location: "Clinic"
// notes: "Notes"
// occurence: 10


    default:
      return state;
  }
}
