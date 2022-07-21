// import fetch from "isomorphic-fetch";
import { Encode } from "../Encode/hashing";
//@get Care plan Data
//@Input - Episode Id, date

import { GetPatientCurrentEpisode } from "./PatientDashboardApi";
export const GetPatientCarePlan = async (episodeId, date) => {
  //headers
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };

  try {
    const response = await fetch(
      "https://hackathon.physioai.care/api" + "/get_emp_careplan/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ id: episodeId, date }),
      }
    );
    //  console.log(response)
    const data = await response.json();
    console.log("get careplan ", data);
    //  console.log(data, "Information")
    if (response.status !== 200 && response.status !== 201) {
      return [false, "Error " + response.status + response.statusText];
    } else {
      return [true, data];
    }
  } catch (err) {
    return [false, "Error 403: " + err.message];
  }
};

export const updatePainMeter = async (id, pain) => {
  let body = {
    id: id,
    pain_meter: pain,
  };
  console.log("pain meter ", body);
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  try {
    await fetch("https://hackathon.physioai.care/api" + "/update_pain_meter/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  }
};

export const submitManuelAi = async (id, time, exercises) => {
  let body = {
    id: id,
    time_slot: time,
    exercise: exercises,
  };
  console.log("pain meter ", body);
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  const encodedData = Encode(body);
  try {
    await fetch(process.env.REACT_APP_API + "/update-care-plan-status/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(encodedData),
    });
  } catch (error) {
    console.log(error);
  }
};

export const update_careplan = async (
  object,
  exercise,
  is_ai,
  pain,
  exerciseTime,
  careplanId
) => {
  console.log(exercise);
  console.log("careplanId ::::::::::::", careplanId);
  var newcareplanId = careplanId;
  console.log("careplanId");

  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  let userId = JSON.parse(localStorage.getItem("userId"));
  const date = new Date();
  console.log("date is");
  const epi = await GetPatientCurrentEpisode();

  const json_data = {
    id: careplanId,
    is_ai:is_ai,
    date: date.toISOString().split("T")[0],
    exerciseId: exercise[0],
    pain: pain,
    output_json: {},
  };
  console.log("episode is");

  if (typeof exerciseTime == "string") {
    json_data.output_json[exerciseTime] = object;
  } else {
    json_data.output_json[JSON.parse(exerciseTime)] = object;
  }

  console.log("careplan data inside api");
  console.log("request in api", JSON.stringify(json_data));
  console.log(json_data);
  try {
    const response = await fetch(
      "https://hackathon.physioai.care/api" + "/update_emp_careplan/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(json_data),
      }
    );

    const data = await response.json();

    console.log(data);
    console.log(data, "Information");
    if (response.status !== 200 && response.status !== 201) {
      return [false, "Error " + response.status + response.statusText];
    } else {
      return [true, data];
    }
  } catch (err) {
    return [false, "Error 403: " + err.message];
  }
};
