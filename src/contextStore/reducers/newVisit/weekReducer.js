import {
    WEEK_DAY
  } from "../../actions/newVisit/types";
  import moment from 'moment';


  let m = moment()
  let arr = []
  for(let i = 0; i <= 6 ; i++ ){

    let week =  m.startOf('week').add(i, "day").format("D")
    arr.push(week)
    
  }
  
  
  const initialState = arr



  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
       case WEEK_DAY:
        return payload.WeekData;
      
      case 'CALENDER_WEEK':
          {
            console.log('WWWEEE',payload.week);
            let m = payload.week;
           let arr = []
           for(let i = 0; i <= 6 ; i++ ){
         
             let week =  m.startOf('week').add(i, "day").format("D")
             arr.push(week)
           }
           return arr;
          
          }
        
   
      default:
        return state;
    }
  }