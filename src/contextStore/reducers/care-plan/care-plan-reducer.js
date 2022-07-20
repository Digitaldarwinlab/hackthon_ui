import {
  FETCH_DATA,
  FILTER_DATA,
  RECEIVED_DATA,
  CARE_PLAN_STATE_CHANGE,
  CARE_PLAN_REP_CHANGE,
  CARE_PLAN_ROM_CHANGE,
  CARE_PLAN_TIME_CHANGE,
  CARE_PLAN_POST_DATA,
  CARE_PLAN_SUCCESS,
  CARE_PLAN_FAILURE,
  CARE_PLAN_CLEAR_STATE,
  CARE_PLAN_ADD_TO_CART,
  CARE_PLAN_NEW_ROM_CHANGE,
  CARE_PLAN_ROM_JOINT_CHANGE,
  CARE_PLAN_EXERCISE_CHANGE,
  CARE_PLAN_ADD_TO_CART_TEMPLATE,
  CARE_PLAN_ROM_JOINT_YOUTUBE_CHANGE,
  CARE_PLAN_LINK_YOUTUBE_CHANGE,
} from "./../../actions/care-plan-action";

const initialState = {
  time_slot_edit:0,
  romJoints:{},
  pp_ed_id: "",
  patient_name: "",
  episode_start_date: "",
  patient_code: "",
  angle: "",
  patient_main_code: "",
  complaint: "",
  episode_name: "Neck Pain",
  startDate: "",
  endDate: "",
  exercises: [],
  timeSlots: [],
  isLoading: false,
  count_time_slots: 3,
  success: "",
  episode_number: "",
  exercises_cart: [],
  status_flag: true,
  edit_flag: false,
  template_flag: false,
  template_name: "",
  template_array: [],
  template_type: 1,
  loadArr: [],
  updated: "",
  template_arr: [],
};
// const setExerise=(exe)=>{
//     let newList = [...state.exercises_cart]
// }
//Exercise Change
const ExerciseUpdate = (list, key1, key2, value, index) => {
  let newList = [...list];
  newList[index][key1][key2] = value;
  return newList;
};
const ExerciseUpdateNew = (list, key1, key2, value, index) => {
  let newList = [...list];
  newList[index][key1][key2] = value;
  return newList;
};
//timeSlots
const getTimeSlots = (list, time, index) => {
  let newList = [...list];
  if (index + 1 > list.length) newList.push(time);
  else newList[index] = time;
  return newList;
};

const upval = (data, index, val) => {
  let temp = [...data];
  let cft = {
    joint: val,
    min: data[index].angle[val].min,
    max: data[index].angle[val].max,
  };
  temp[index]["Rom"] = cft;
  return temp;
};

const upval1 = (data, joints,index, val) => {
  let temp = [...data];
  let cft = {
    joint:val,
    min:0,
    max:0
  }
  Object.keys(joints).map(item=>{
    if(joints[item].joint==val){
      cft = {joint:val,min:joints[item].min,max:joints[item].max}
    }
  })
  temp[index]["Rom"] = cft;
  return temp;
};

const upval2 = (data, index, val) => {
  let temp = [...data];
  temp[index]["youtube_link"] = val;
  return temp;
};

export const carePlanRedcucer = (state = initialState, action) => {
  switch (action.type) {
    case CARE_PLAN_STATE_CHANGE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case CARE_PLAN_NEW_ROM_CHANGE:
      return {
        ...state,
        exercises: ExerciseUpdateNew(
          state.exercises,
          "Rep",
          action.payload.key,
          action.payload.value,
          action.payload.index
        ),
      };
    case CARE_PLAN_REP_CHANGE:
      return {
        ...state,
        exercises: ExerciseUpdate(
          state.exercises_cart,
          "Rep",
          action.payload.key,
          action.payload.value,
          action.payload.index
        ),
      };
    case CARE_PLAN_ROM_CHANGE:
      return {
        ...state,
        exercises: ExerciseUpdate(
          state.exercises_cart,
          "Rom",
          action.payload.key,
          action.payload.value,
          action.payload.index
        ),
      };
    case CARE_PLAN_TIME_CHANGE:
      return {
        ...state,
        timeSlots: getTimeSlots(
          state.timeSlots,
          action.payload.value,
          action.payload.index
        ),
      };
    case CARE_PLAN_POST_DATA:
      return {
        ...state,
        isLoading: true,
        success: "",
      };
    case CARE_PLAN_ROM_JOINT_CHANGE:
      return {
        ...state,
        exercises_cart: upval(
          state.exercises_cart,
          action.payload.index,
          action.payload.value
        ),
      };
    case CARE_PLAN_ROM_JOINT_YOUTUBE_CHANGE:
      return {
        ...state,
        exercises_cart: upval1(
          state.exercises_cart,
          state.romJoints,
          action.payload.index,
          action.payload.value
        ),
      };
    //CARE_PLAN_LINK_YOUTUBE_CHANGE
    case CARE_PLAN_LINK_YOUTUBE_CHANGE:
      return {
        ...state,
        exercises_cart: upval2(
          state.exercises_cart,
          action.payload.index,
          action.payload.value
        ),
      };
    case CARE_PLAN_EXERCISE_CHANGE:
      return {
        ...state,
        exercises_cart: [...state.exercises_cart, ...action.payload.value],
      };
    case CARE_PLAN_SUCCESS:
      return {
        ...initialState,
        exercises: state.exercises,
        isLoading: false,
        [action.payload.key]: action.payload.value,
      };
    case CARE_PLAN_FAILURE:
      return {
        ...state,
        isLoading: false,
        success: "",
      };
    case FETCH_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case FILTER_DATA:
      return {
        ...state,
        isLoading: true,
      };
    case RECEIVED_DATA:
      return {
        ...state,
        isLoading: false,
      };
    case CARE_PLAN_CLEAR_STATE:
      return {
        ...initialState,
      };
    case CARE_PLAN_ADD_TO_CART:
      return {
        ...state,
        exercises_cart: [...state.exercises_cart, action.payload],
      };
    case CARE_PLAN_ADD_TO_CART_TEMPLATE:
      return {
        ...state,
        loadArr: [...state.loadArr, action.payload.value],
      };
    default:
      return {
        ...state,
      };
  }
};
