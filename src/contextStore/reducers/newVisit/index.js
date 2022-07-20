import { combineReducers } from "redux";
import calender from "./calender";
import month from "./month";
import weekReducer from './weekReducer'
import dayReducer from "./dayReducer";

export default combineReducers({
  calender,
  month,
  weekReducer,
  dayReducer
});