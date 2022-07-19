import {
   DAY_DATE,
  } from "../../actions/newVisit/types";
// import moment from 'moment';


  const initialState ={} ;
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      
      
      case DAY_DATE:
        return {
          ...state,
          data: payload.dayData,
        };
  
   
      default:
        return state;
    }
  }