import React, { useState, useEffect } from "react";
// import DatePicker from "react-horizontal-datepicker";
// import "react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css";
import { Button, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPatientCarePlan } from "./../../PatientAPI/PatientShedule";
import moment from "moment";
import { Row, Col, Card } from "antd";
import {
  GetPatientCurrentEpisode,
  GetCalanderDataApi,
} from "../../PatientAPI/PatientDashboardApi";
// import { fetchVisits } from "../../../API/episode-visit-details/episode-visit-api";
import "./Calendar.css";
import './patNew.css'
import DatePicker from "react-horizontal-datepicker";
// import CarePlanView from "../../components/episode-visit-details/carePlanView/carePlanView";
import { get_prescription } from "../../../API/Prescription/PresriptionApi";
// import yt from '../assets/YouTube.webp'
// import ReactPlayer from "react-player";
//TimeColors
const activeArr = [
  true, false, false, false, false,
  false, false, false, false, false,
  false]
const timeColors = [
  "#17BD9C",
  "#00294C",
  "#17BD9C",
  "#00294C",
  "#17BD9C",
  "#00294C",
];
//Selected Time Style
const selectedStyle = {
  backgroundColor: "#00294C !important",
  color: "white",
  cursor: "pointer",
};
//Unselected Style
const UnselectedStyle = {
  backgroundColor: "white",
  color: "black",
  cursor: "pointer",
};
//button Style
const checkBtnStyle = {
  backgroundColor: `'red'!important`
}
const btnStyle = {
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
};
const { Meta } = Card;
const PatCalendar = ({ onChangeVideoUrl }) => {

  const history = useHistory();
  const dispatch = useDispatch()
  const [pres, setPres] = useState([])
  const state = useSelector((state) => state.patCurrentEpisode);
  const [exstatCheck, setExStatCheck] = useState('yes')
  const [selectedDate, setSelectedDate] = useState("");
  const [exercises, setExercises] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false); // button Disability
  //const [activeCalVal, setState] = useState(true); 
  const [mappedTimeToExercises, setMappedTimeToExercises] = useState({});
  const [currentEpissode, Setcurrentepisode] = useState(0);
  const [calendarData, SetcalendarData] = useState(0);
  const [allvisits, Setvisits] = useState([]);
  const [choosencareplan, Setchoosencareplan] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toDateString().slice(4, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().toDateString().slice(-4))
  const [newCareplanId ,setNewCareplanId] = useState()
  // const [selectedYear, setSelectedYear] = useState("")
  // let selectedYear
  // let setSelectedYear
  const [status_flag, setStatusFlag] = useState(false);
  const [customisedDate, SetcustomisedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [sortedVisits, SetsortedVisits] = useState([]);
  const [todaysdate, Settodaysdate] = useState(new Date());
  const [chosenTime, SetchoosenTime] = useState(0);
  const [careplanIdArray, SetcareplanIdArray] = useState([]);
  const [update, setUpdate] = useState(false)
  const [combine, setCombine] = useState(false)
  const [exercise_status, setExerciseStatus] = useState({})
  const [exercise_status1, setExerciseStatus1] = useState([])
  const checkExerciseStatus = (b, obj) => {
    //   let test = {
    //     "10:00 am": {
    //         "Squat": "planned",
    //         "Push Ups": "planned"
    //     },
    //     "01:00 pm": {
    //         "Squat": "completed",
    //         "Push Ups": "completed"
    //     },
    //     "04:00 pm": {
    //         "Squat": "planned",
    //         "Push Ups": "planned"
    //     }
    // }
    console.log('exercise_status ', obj)
    console.log('exercise_status ', b)
    Object.entries(obj).map(d => {
      if (d[0] === b) {
        console.log("plz chacek ", d[1])
        let temp = Object.values(d[1])
        if (temp.includes('completed')) {
          console.log('status not completed')
          setExStatCheck('yes')
        } else {
          console.log('status completed')
          setExStatCheck('no')
        }
        //  Object.values(d[1]).map(p=>{
        //      if(p==="planned"){
        //          console.log('status not completed')
        //          setExStatCheck('no')
        //      }
        //  })
      }
    })
  }
  const checkExerciseStatus1 = async (b, temp) => {
    if (Array.isArray(b)) {
      b = b[0]
    }

    console.log('making exercise_status ', temp)
    console.log('making exercise_status ', b)
    console.log('making 1')
    let tempStat = true
    for (let i = 0; i < temp.length; i++) {
      Object.entries(temp[i]).map(d => {
        if (d[0] === b) {
          console.log("plz chacek ", d[1])
          let temp1 = Object.values(d[1])
          if (temp1.includes('completed')) {
            tempStat = false
            console.log('making 2 true ', i)
          } else {
            console.log('status completed captured')
          }
        }
      })
    }
    console.log('making 3 ')
    //  const checkTemp = () =>{
    //    return new Promise((resolve,reject)=>{
    //     temp.map(d1=>{
    //       Object.entries(d1).map(d=>{
    //         if(d[0]===b[0]){
    //           console.log("plz chacek ",d[1])
    //           let temp = Object.values(d[1])
    //           if(temp.includes('planned')){
    //           resolve(true)
    //           }else{
    //               console.log('status completed captured')
    //           }
    //         }
    //       })
    //     })
    //    })
    //  }
    // const tempStat = await checkTemp()
    console.log('exercise_status ', tempStat)

    if (tempStat) {
      setExStatCheck('no')
      console.log('making 4')
      console.log('status not completed')
    } else {
      setExStatCheck('yes')
      console.log('making 5')
      console.log('status completed')
    }
  }
  //  console.log('date is : ' + todaysdate.getDate())
  function convert(str) {
    console.log(str)
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    console.log([date.getFullYear(), mnth, day].join("-"))

    return [date.getFullYear(), mnth, day].join("-");
  }

  const combineTwoCarePlan = (data) => {
    //  console.log('data iss')
    setStatusFlag(data[0].status_flag == 2 ? false : true)
    setCombine(true)
    let commonTime = {};
    let checkTimeToMapExercise = {};

    //Step - 2 mapping all the timeSlots in first careplan
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].time_slot.length; i++) {
        //   console.log('time slott iss')
        //    console.log(data[k].time_slot[i])
        //  console.log('chektine to map')
        //  console.log(checkTimeToMapExercise)
        //  console.log(data[k].time_slot[i])
        if (data[k].time_slot[i] in checkTimeToMapExercise) {
          console.log("loop 4 s");
          console.log(data[k].pp_cp_id);
          //  console.log('inside if')
          let exercises = data[k].exercise_details;

          let notPresentExercise = [];
          let mappedData = checkTimeToMapExercise[data[k].time_slot[i]];
          //  console.log('checking mappeddata')
          //  console.log(  checkTimeToMapExercise)

          for (let j = 0; j < exercises.length; j++) {
            //  console.log('careplan loop 2 ')
            //    console.log(data[k].pp_cp_id)

            //   console.log('exercise')
            //   console.log(exercises[j])
            if (exercises[j].ex_em_id in mappedData) {
              //pass
            } else {
              notPresentExercise.push(exercises[j]);
              mappedData[exercises[j].ex_em_id] = 1;
            }
          }

          checkTimeToMapExercise[data[k].time_slot[i]] = mappedData;
          commonTime[data[k].time_slot[i]] = [
            ...commonTime[data[k].time_slot[i]],
            ...notPresentExercise,
          ];
          //    console.log('data[k]')
          //  console.log(data[k].time_slot[i][0])
        } else {
          console.log("loop 4 s");
          console.log(
            data[k].pp_cp_id + " : time_slot is : " + data[k].time_slot[i]
          );
          let temparray = careplanIdArray;
          temparray.push({
            time: data[k].time_slot[i],
            careplanId: data[k].pp_cp_id,
          });
          SetcareplanIdArray(temparray);

          commonTime[data[k].time_slot[i]] = data[k].exercise_details;
          //  console.log('else commontime')
          //   console.log(data[k].time_slot[i])
          let exercises = data[k].exercise_details;
          for (let j = 0; j < exercises.length; j++) {
            if (data[k].time_slot[i] in checkTimeToMapExercise) {
              checkTimeToMapExercise[data[k].time_slot[i]][
                exercises[j].ex_em_id
              ] = 1;
            } else {
              checkTimeToMapExercise[data[k].time_slot[i]] = {};
              checkTimeToMapExercise[data[k].time_slot[i]][
                exercises[j].ex_em_id
              ] = 1;
            }
          }
        }
      }
    }
    //  console.log('COmmontTINe')
    let times = Object.keys(commonTime);
    console.log("times ", times)
    //   console.log(commonTime)

    times = times.sort(
      (a, b) => a.charCodeAt(a.length - 2) - b.charCodeAt(b.length - 2)
    );
    setMappedTimeToExercises(commonTime);
    if (times.length > 0) {
      times = times.map((time, index) => {
        return [time];
      });
      setTimes(times);
      setExercises(commonTime[times[selectedTime][0]]);
      if (commonTime[times[0][0]].length > 0)
        onChangeVideoUrl(commonTime[times[0][0]][0].video_url);
    }
    console.log('times ', data)
    let tempStatus = []
    data.map(d => {
      tempStatus.push(d.time_slot)
    })
    checkExerciseStatus1(times[0], tempStatus)
    setExerciseStatus1(tempStatus)
    console.log("times ", tempStatus)
    // console.log(commonTime);
  };
  const UpdateCarePlanStateData = (data) => {
    console.log("careplan ", data)
    setStatusFlag(data[0].status_flag == 2 ? false : true)
    setUpdate(true)
    setTimes(data[0].time_slot);
    setExercises(data[0].exercise_details);
    onChangeVideoUrl(data[0].exercise_details[0].video_url);
    setMappedTimeToExercises({});
    times.map((item) => {
      let temp = careplanIdArray;
      temp.push({ time: item, careplanId: data[0].pp_cp_id });
    });
    checkExerciseStatus(data[0].time_slot[0], data[0].exercise_status)
  };

  console.log("id array iss");
  console.log(careplanIdArray[selectedTime]);
  const [exactTime, setExactTime] = useState()
  useEffect(() => {

    let key = Object.keys(mappedTimeToExercises);
    //console.log(mappedTimeToExercises[key[0]])
    // console.log()
    SetchoosenTime(JSON.stringify(key[selectedTime]));
    console.log("selected time ", selectedTime)
    console.log("selected choosen time1 ", chosenTime)
    console.log("selected ", key)
    setExactTime(chosenTime)
  }, [selectedTime]);
  const checkDisablitiy = (current) => {
    let yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
    return current && current < moment(yesterday, "YYYY-MM-DD");
  };

  const onSelectedDay = async (val, idx) => {

    activeArr.map((data, index) => {
      if (index === idx) {
        activeArr[index] = true;
      }
      else {
        activeArr[index] = false;
      }

    })

    console.log('before converting ', val)
    SetcustomisedDate(convert(val));

    setLoading(true);
    setExercises([]);
    setTimes([]);

    let result = await GetPatientCarePlan(Number(localStorage.getItem("userId")), convert(val));
    console.log("careplans ", result)
    setNewCareplanId(result[1][0].pp_cp_id)
    setLoading(false);
    if (result[0]) {
      try {
        let data = result[1];
        if (data.length !== 0) {
          if (data.length == 1) {
            UpdateCarePlanStateData(data);
          } else {
            combineTwoCarePlan(data);
          }
        } else {
          onChangeVideoUrl("");
        }
      } catch (err) {
        console.log(err);
        onChangeVideoUrl("");
      }
    }
    var isDisabled = checkDisablitiy(val);
    // setButtonDisabled(isDisabled);
    setSelectedDate(val);
  };

  const onSelectedDay1 = async (val, episodeId) => {
    //   console.log(val)
    console.log('before converting ', val)
    SetcustomisedDate(convert(val));
    setLoading(true);
    setExercises([]);
    setTimes([]);
    //    console.log('on selecting : ' + convert(val))
    let result = await GetPatientCarePlan(Number(localStorage.getItem("userId")), convert(val));
    console.log("get update ",result)
    if (result[1].length > 0) {
      console.log('yes')
      setExerciseStatus(result[1][0].exercise_status)
      console.log("get yes patient careplan ", result[1][0].exercise_status);
    } else {
      console.log('no')
      setExerciseStatus({})
      console.log("get yes no patient careplan ", {});
    }
    setLoading(false);
    if (result[0]) {
      try {
        let data = result[1];
        if (data.length !== 0) {
          if (data.length == 1) {
            console.log("get update ",data)
            UpdateCarePlanStateData(data);
          } else {
            console.log("get update ",data)
            combineTwoCarePlan(data);
          }
        } else {
          onChangeVideoUrl("");
        }
      } catch (err) {
        console.log(err);
        onChangeVideoUrl("");
      }
    }
    var isDisabled = checkDisablitiy(val);
    //setButtonDisabled(isDisabled),
    setSelectedDate(val);
  };
  //Update Care Plan State

  // useEffect(async () => {
  //   let userId = JSON.parse(localStorage.getItem("userId"));
  //   const patientVisits = await fetchVisits(userId);

  //   Setvisits(patientVisits);

  //   // console.log(allvisits)
  // }, []);
  // console.log(allvisits)
  useEffect(() => {
    if (allvisits.length > 0) {
      const sortVisits = allvisits.filter((data) => {
        const datetypof = typeof data.appointment_detail.startDate;
        const date =
          datetypof == "number"
            ? new Date(data.appointment_detail.startDate)
              .toISOString()
              .substring(0, 10)
            : data.appointment_detail.startDate.toString().substring(0, 10);
        //  console.log( 'date is')
        //  console.log(date)
        if (date == customisedDate) {
          return data;
        }
      });
      SetsortedVisits(sortVisits);
    }

    //    console.log('on selectin1 : '+customisedDate)
  }, [customisedDate]);

  useEffect(() => {
    {
      const sortVisits = allvisits.filter((data) => {
        //    console.log(data)
        const datetypof = typeof data.appointment_detail.startDate;
        const date =
          datetypof == "number"
            ? new Date(data.appointment_detail.startDate)
              .toISOString()
              .substring(0, 10)
            : data.appointment_detail.startDate.toString().substring(0, 10);

        if (date == customisedDate) {
          return data;
        }
      });
      SetsortedVisits(sortVisits);
    }
  }, [allvisits]);
  //UseEffect
  //  console.log('sorted')
  // console.log(sortedVisits)
  const setPrescription = (data) => {

  }
  // useEffect(() => {
  //   async function getPlan() {
  //     setLoading(true);
  //     // const pepisode = await GetPatientCurrentEpisode();
  //     const pepisode = []
  //     //    console.log(pepisode[1])
  //     if (pepisode[1].length > 0) {
  //       Setcurrentepisode(pepisode[1][0].pp_ed_id);
  //       //  console.log(currentEpissode)
  //       dispatch({
  //         type: 'changeEpisodeId',
  //         payload: {
  //           value: pepisode[1][0].pp_ed_id
  //         }
  //       })
  //       const data = await get_prescription(pepisode[1][0].pp_ed_id)
  //       console.log("prescription ", data)
  //       dispatch({
  //         type: 'PRESCRIPTION_CHANGE',
  //         payload: {
  //           value: data
  //         }
  //       })
  //       onSelectedDay1(new Date(), pepisode[1][0].pp_ed_id);
  //       //  console.log('on select k neeche')
  //     }

  //     //  console.log("on selecting0 : " + convert(new Date()))

  //     setLoading(false);
  //   }
  //   getPlan();
  // }, []);

  useEffect(() => {
    async function getCalanderData() {
      setLoading(true);
      const calData = await GetCalanderDataApi();

      console.log(JSON.stringify(calData));
      SetcalendarData(calData);

      //  console.log("on selecting0 : " + convert(new Date()))

      setLoading(false);
    }
    getCalanderData();
  }, []);

  //  onSelectedDay(new Date())

  // console.log(customisedDate)
  //Selected Date
  console.log(careplanIdArray);

  //  console.log(currentEpissode+'useStateepisode')
  //Get Day
  const day = (d) => {
    switch (d) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  };

  const dayShort = (d) => {
    switch (d) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sept";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
    }
  };

  //console.log(selectedDate ? new Date(selectedDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10) +'Selecteeddd dayyy')
  //  console.log(currentEpissode)
  // console.log('exercises')
  // console.log(exercises)
  //TimeSlot Buttons

  const TimeSlots = (times) => {
    console.log("get times", selectedTime)
    return (
      <div
        className="p-2  border   text-start exercise-card"
        id="exercise-card"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="p fw-bold">
            {selectedDate
              ? day(new Date(selectedDate).getDay())
              : day(new Date().getDay())}
          </h5>
          <h5 className="p fw-bold ms-2">
            {selectedDate ? customisedDate : customisedDate}
          </h5>
        </div>
        <div
          className="time-slot-buttons"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {times.map((time, index) => {
            return (
              <Button
                key={index}
                disabled={buttonDisabled}
                // style={
                //   buttonDisabled
                //     ? {
                //       ...btnStyle,
                //       ...{
                //         cursor: buttonDisabled ? "not-allowed" : "pointer",
                //         backgroundColor: buttonDisabled ? "gray" : "#00022e",
                //       },
                //     }
                //     : selectedTime === index
                //       ? selectedStyle
                //       : UnselectedStyle
                // }
                type="primary"
                onClick={() => {
                  setSelectedTime(index);
                  SetchoosenTime(time)
                  console.log('choosen time ', time)
                  if (times[index][0] in mappedTimeToExercises) {
                    setExercises(mappedTimeToExercises[times[index][0]]);
                    console.log("time slot ", mappedTimeToExercises)
                  } else {
                    //pass
                  }
                }}
                className="time-button "
              // className={selectedTime === index
              //   && "selectedStyle"
              // }
              >
                {time}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  //Cotinue button Click
  const handleClick = (exercise) => {
    console.log("selected choosen time ", chosenTime)
    console.log("selected Exact time ", exactTime)
    console.log("selected careplanidarray ", careplanIdArray[selectedTime])
    console.log('selected time slots ', times)
    console.log('selected exercises ', exercises)
    const mapExer = (time) => {
      exercises.map(ex => {
        ex['ChoosenTime'] = time
        if (ex.name == "YouTube") {
          ex.video_url = ex.youtube_link
        }
      })
    }
    if (combine) {
      if (chosenTime === undefined) {
        // exercise["ChoosenTime"] = careplanIdArray[selectedTime].time
        mapExer(careplanIdArray[selectedTime].time)
      } else {
        // exercise["ChoosenTime"] = exactTime[0]
        mapExer(exactTime[0])
      }
    } else {
      if (exactTime !== 0) {
        // exercise["ChoosenTime"] = exactTime
        mapExer(exactTime)
      } else {
        //  exercise["ChoosenTime"] = times[0]
        mapExer(times[0])
      }
    }

    const exArr = []
    exercises.map(ex => {
      exArr.push(ex.name)
    })
    console.log("exercise is ", exercise)
    exercise["ChoosenTime"] = chosenTime
      ? chosenTime
      : Object.keys(mappedTimeToExercises)[0]
        ? Object.keys(mappedTimeToExercises)[0]
        : times[selectedTime];
    exercise["careplanId"] = newCareplanId;
    console.log('final exercises are ', exercises ," ", newCareplanId)
    let repArr = exercises.map(exercise => exercise.Rep)
    //  console.log('final exercise status ',exercise_status)
    //  console.log('final exercise status1 ',exercise_status1)
    onChangeVideoUrl(exercise.video_url);
    if (!status_flag) {
      history.push({
        pathname: "/patient/exercises/brief",
        state: {
          exercise: exercises[0],
          exercises,
          exNameList: exArr,
          status_flag,
          repArr
        },
      });
    } 
    // else {
    //   history.push({
    //     pathname: "/patient/exercises/manual",
    //     state: {
    //       exercise: exercises[0],
    //       exercises,
    //       exNameList: exArr,
    //       status_flag,
    //       repArr
    //     },
    //   });
    // }
  };

  const checkStatuc = (ex) => {

  }

  //Exercise Card
  const ExerciseCard = (exercise) => {
    console.log("card showing ", exercise)
    return (
      <Card
        cover={
          <img
            src={`https://hackathon.physioai.care/${exercise.image_url}`}
            alt={`image_${exercise.ex_em_id}`}
            width="100%"
            height={120}
          />
        }
      >
        <Meta
          description={<p style={{ color: "#000000" }}>{exercise.name ? exercise.name : ""}</p>}
        //  description={exercise.name ? exercise.name : ""}
        />
      </Card>
      // <div className="main-exercise-card" id="main-exercise-card">
      // <img
      //   src={`${process.env.REACT_APP_EXERCISE_URL}/${exercise.image_url}`}
      //   alt={`image_${exercise.ex_em_id}`}
      //   width={120}
      //   height={120}
      //   style={{ borderRadius: 60 }}
      // />
      //   <div className="ms-0 main-exercise-card" id="main-exercise-card">
      //     <h4 className="fw-bol">{exercise.name ? exercise.name : ""}</h4>
      //   </div>
      // </div>
    );
  };
  const CalStrip = (data) => {

    let val = data.dayName.substr(0, 3);
    return (

      <li >
        <p>{val}</p>
        <p>{data.displayDay}</p>
      </li>

    );
  };

  const CalStripActive = (data) => {

    let val = data.dayName.substr(0, 3);
    return (

      <li class="active">
        <p>{val}</p>
        <p>{data.displayDay}</p>
      </li>

    );
  };
  const Prescriptions = () => {
    console.log("new Pres ", pres)
    return (
      <>
        <div className="prescription-row">
          <span className="presription-col">
            <b>Prescription Detail ({convert(new Date())}) </b>
          </span>
        </div>
        {state.current_pres &&
          Object.keys(state.current_pres).length > 0 && <div className="p-2  border visit-card-2" id="visit-card-2">
            <div className="presription-row">
              <b>Medication Details </b> <br />
              {
                state.current_pres.medication_detail.map(m => (
                  <>
                    <div className="upper-visit-row">
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>Medicine :</b> {m.medicine_name}{" "}
                      </span>
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>No of Medications :</b> {m.no_of_medications}{" "}
                      </span>
                    </div>
                    <div className="upper-visit-row">
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>Instructions :</b> {m.instruction}{" "}
                      </span>
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>Notes  :</b> {m.instruction}{" "}
                      </span>
                    </div>
                  </>
                ))
              }
              <b>Lab </b> <br />
              {
                state.current_pres.lab_tests.map(m => (
                  <>
                    <div className="upper-visit-row">
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>Path :</b> {m.path_lab_test}{" "}
                      </span>
                      <span className="visit-col" span={10}>
                        {" "}
                        <b>Radiology :</b> {m.radio_lab_test}{" "}
                      </span>
                    </div>
                  </>
                ))
              }
            </div>
          </div>

        }
      </>
    );
  };




  var date = new Date();

  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const Visits = (data) => {
    console.log("get visits ", data)
    var datetypof;
    var date;
    if (data) {
      datetypof = typeof data.appointment_detail.startDate;
      date =
        datetypof == "number"
          ? new Date(data.appointment_detail.startDate)
            .toISOString()
            .substring(0, 10)
          : data.appointment_detail.startDate.toString().substring(0, 10);
      var timeString = data.appointment_detail.start_time;
    }
    console.log("get visits")
    try {
      console.log("get visits try")
      return (
        <div className="p-2  visit-card-1" id="visit-card-1">
          <p
            className="w-100 text-start mb-2"
            style={{
              textAlign: "left",
              fontSize: "20px",
              position: "relative",
              left: "10px",
            }}
          >
            <b>Visit Details</b>
          </p>
          <div className="upper-visit-row">
            <span className="visit-col" span={10}>
              {" "}
              <b>Time :</b> {data ? timeString + " " : "Not Available"}{" "}
            </span>
            <span className="visit-col" span={10}>
              {" "}
              <b>Visit Duration :</b>{" "}
              {data ? data.appointment_detail.duration : "No Visit today"}{" "}
            </span>
          </div>
          <div className="upper-visit-row">
            <span className="visit-col" span={12}>
              <b>Visit Type : </b> {data ? data.visit_type : "No Visit today"}
            </span>
            <span className="visit-col" span={12}>
              {/* aswin 10/24/2021 start */}
              <b>Location : </b> {data ? data.location : "No Location"}
              {/* aswin 10/24/2021 stop */}
            </span>
          </div>

          <div className="video-conference-detail">
            <span className="video-col">
              <b> Video Conference Detail</b> :
              {data.video_link ? <a
                href={"/patient" + data.video_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.video_link.length > 0 ? data.video_link : "Not Available"}
              </a> : "Not Available"}
            </span>
          </div>
        </div>
      );
    } catch (err) {
      console.log("get visits", err)
      return (
        <div className="p-2  visit-card-1" id="visit-card-1">
          <p
            className="w-100 text-start"
            style={{
              textAlign: "left",
              fontSize: "24px",
              position: "relative",
              left: "10px",
            }}
          >
            <b>Visit Details</b>
          </p>
          <div className="upper-visit-row">
            <span className="visit-col" span={10}>
              {" "}
              <b>Today's Visit :</b> {"error in Data"}{" "}
            </span>
            <span className="visit-col" span={10}>
              {" "}
              <b>Visit Timing :</b> {"error in Data"}
            </span>
          </div>
          <div className="upper-visit-row">
            <span className="visit-col" span={12}>
              <b>Visit Type : </b> {"error in Data"}
            </span>
          </div>

          <div className="video-conference-detail">
            <span className="video-col">
              <b> Video Conference Detail</b>
            </span>
          </div>
        </div>
      );
    }
  };

  const checkStatus = () => {
    console.log('status checking...')
    if (combine) {
      if (chosenTime === undefined) {
        console.log('status combine checking 1', careplanIdArray[selectedTime].time)
        //  mapExer(careplanIdArray[selectedTime].time)
        checkExerciseStatus(careplanIdArray[selectedTime].time, exercise_status)
      } else {
        console.log('status combine checking 2', exactTime[0])
        //  mapExer(exactTime[0])
        checkExerciseStatus(exactTime[0], exercise_status)
      }
    } else {
      if (exactTime !== 0) {
        console.log('status not combine checking 1', exactTime)
        // mapExer(exactTime)
        checkExerciseStatus(exactTime, exercise_status)
      } else {
        console.log('status not combine checking 2', times[0])
        // mapExer(times[0])
        checkExerciseStatus(times[0], exercise_status)
      }
    }
  }
  const checkStatus1 = () => {
    console.log('status checking1...')
    console.log('status checking1... ', exercise_status1)
    if (combine) {
      if (chosenTime === undefined) {
        console.log('status combine checking 1', careplanIdArray[selectedTime].time)
        //  mapExer(careplanIdArray[selectedTime].time)
        checkExerciseStatus1(careplanIdArray[selectedTime].time, exercise_status1)
      } else if (exactTime[0] === undefined) {
        console.log('conflict..', exactTime)
        console.log('conflict.. combine checking 1', careplanIdArray[selectedTime].time)
      }
      else {
        console.log('status combine checking 2', exactTime[0])
        //  mapExer(exactTime[0])
        checkExerciseStatus1(exactTime[0], exercise_status1)
      }
    } else {
      if (exactTime !== 0) {
        console.log('status not combine checking 1', exactTime)
        // mapExer(exactTime)
        // checkExerciseStatus(exactTime,exercise_status)
      } else {
        console.log('status not combine checking 2', times[0])
        // mapExer(times[0])
        //  checkExerciseStatus(times[0],exercise_status)
      }
    }
  }
  useEffect(() => {
    if (exercises.length > 0 && update) {
      console.log('status checking if')
      checkStatus()
    }
    if (exercises.length > 0 && combine) {
      console.log('status checking else')
      checkStatus1()
    }
  }, [chosenTime]);
  return (
    <>
      <center>
        <Row justify="center">
          <h2 style={{ position: 'absolute', margin: '-10px' }}>{selectedMonth} - {selectedYear}</h2>
        </Row>
        <Row justify="center">
          <Col md={16} lg={16} sm={24} xs={24}>
            <DatePicker
              getSelectedDay={(e) => {
                onSelectedDay(convert(e))
                console.log('datepicker ', dayShort(e.getMonth()))
                setSelectedMonth(dayShort(e.getMonth()))
                setSelectedYear(e.getFullYear())
              }}
              labelFormat={"MMMM"}
              color={"#374e8c"}
            //   color={"#2d7ecb"}
            //   onClick={(e)=>console.log(e)}
            />
          </Col>
          {/* <div class="calenderView">
            <div class="monthName">
              <h2>{selectedMonth} - {selectedYear}</h2>
            </div>
            <div class="pervsBTN">Prves</div>
            <ul class="daysName">
            {calendarData.length > 0
            ? calendarData.map((data,index) => {
                

             
                
               return (
   
              
     <a onClick={() => {onSelectedDay(data.date,index)
      console.log("plz check data",data);
     setSelectedMonth(data.displayMonth) 
     setSelectedYear(data.displayYear)}}
    
     >
     {activeArr[index] ? CalStripActive(data) : CalStrip(data)}
     
              </a>       
           )
              })
            : Visits(false)}

              <li></li>
            </ul>
            <div class="nextBTN">next</div>
          </div> */}

        </Row>
      </center>
      {loading && (
        <div style={{ marginLeft: "40%", marginRight: "40%", marginTop: 50 }}>
          <Spin tip="Loading..." size="large"></Spin>
        </div>
      )}
      <div className="conten" id="content">
        <Col className="exercises-cards">
          <Row className="p-2 main-card">
            <ol>
              {sortedVisits.length > 0
                ? sortedVisits.map((data) => {
                  console.log("get data ", data)
                  return Visits(data);
                })
                : Visits(false)}
            </ol>
          </Row>
          <Row className="p-2 main-card">{Prescriptions()}</Row>
        </Col>
        <Col className="exercises-cards">
          {times.length !== 0 && TimeSlots(times)}
          {exercises.length !== 0
            ? <>{exercises.map((ex, index) => {
              console.log("ex inside ", ex)
              return (
                <>
                  <div
                    key={index}
                    className="border px-2 py-2 ms-2 me-2 mt-2 exercise-card2"
                    id="exercise-card2"
                  >
                    {ExerciseCard(ex)}
                  </div>
                </>
              );
            })}
              {exercises.length > 0 && <div style={{ display: 'none' }} className="p-2 start_now_div"><Button className={`status-button-${customisedDate !== convert(new Date()) ? 'yes' : exstatCheck} p-2`}
                disabled={exstatCheck === 'yes' || customisedDate !== convert(new Date()) ? true : false}
                style={{ float: 'right' }} onClick={() => handleClick(exercises)} >Start Now</Button></div>}
            </>
            : !loading && (
              <p className="text-center p border nothing-present">
                <b> No Plan For Today</b>{" "}
              </p>
            )}
        </Col>
      </div>
      {exercises.length > 0 && <div className="p-2 start_now_div_large"><Button className={`status-button-${customisedDate !== convert(new Date()) ? 'yes' : exstatCheck} p-2`}
        disabled={exstatCheck === 'yes' || customisedDate !== convert(new Date()) ? true : false}
        style={{ float: 'right' }} onClick={() => handleClick(exercises)} >Start Now</Button></div>}
    </>
  );
};
export default PatCalendar;
