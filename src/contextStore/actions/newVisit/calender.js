import {ADD_VISIT,CHANGE_MONTH,WEEK_DAY,DAY_DATE,MONTH_VAL} from './types'


export const calender = () => (dispatch) => {
    return (data) => {
       return dispatch({
          type: ADD_VISIT,
          payload: {CalenderData: data },
        });
       
    }};

export const month = () => (dispatch) => {
    return (data) => {
       return dispatch({
          type: CHANGE_MONTH,
          payload: {MonthData: data },
          type:MONTH_VAL,
          payload: {MonthVal : data}
        });
       
    }};


export const week = () => (dispatch) => {
    return (data) => {
       return dispatch({
          type: WEEK_DAY,
          payload: {WeekData: data },
        });
       
    }};

export const day = () => (dispatch) => {
    return (data) => {
       return dispatch({
        type: DAY_DATE,
        payload: {dayData: data },
      });
       
    }};