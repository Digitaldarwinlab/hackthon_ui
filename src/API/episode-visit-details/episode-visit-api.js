// import Visit from "./../../components/UtilityComponents/dummyData/episode-visit-dummy/visits.json";
import { Encode } from "../../Encode/hashing";
import Episode from "./../../components/UtilityComponents/dummyData/episode-visit-dummy/Episode.json";
import SingleEpisode from "./../../components/UtilityComponents/dummyData/episode-visit-dummy/Single-Episode.json";
import { Decode } from "../../Encode/hashing";
//@func - for fetching episodes.
//@param -
//@return - Fetched Episodes.
export const fetchEpisodes = async (id) => {
  return Episode;
};
//@func - for fetching Single episode.
//@param - id of episode
//@return - Fetched Episodes.
export const fetchSingleEpisode = (id) => {
  return SingleEpisode;
};
//@func - for fetching Visits.
//@param - patient Id
//@return - Fetched Patient Visits.
export const fetchVisits = async (patId) => {
  const encodedData = Encode({ id: patId });
  try {
    const headers = {
      Accept: "application/json",
      "Content-type": "application/json",
    };

    const response = await fetch(
      process.env.REACT_APP_API + "/patient_visit_v1/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(encodedData),
      }
    );
    // console.log('inside patient visit api')
    // console.log(patId)
    // console.log(response)
    const responseData = await response.json();
    const data = Decode(responseData);
    console.log(data);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error: " + response.status + response.statusText);
    }
    return data;
  } catch (err) {
    // console.log(err, "Error in Fetching Patient Visits");
    return [];
  }
};

const filterCarePlanData = (data) => {
  console.log("check data  ", data);
  let newData = [];
  let keyObject = {};
  data.forEach((element) => {
    if (element.careplan_code in keyObject) {
      keyObject[element.careplan_code] = [
        ...keyObject[element.careplan_code],
        element,
      ];
    } else {
      keyObject[element.careplan_code] = [element];
    }
  });
  let keys = Object.keys(keyObject);
  keys.forEach((el) => {
    let element = keyObject[el][0];
    console.log("check data 1 ", keys);
    console.log("check data 2 ", keyObject);
    console.log("check data 3 ", element);
    console.log("check data 4 ", keyObject);
    console.log("check data 5 ", el);
    console.log("check data 6 ", keyObject[el].length - 1);
    console.log("check data 7 ", keyObject[el][keyObject[el].length - 1].date);
    console.log("check data 8 ", keyObject[el][keyObject[el].length - 1].end_date);
    keyObject[el].length - 1;
    element["start_date"] = element.date;
    delete element["date"];
    element["end_date"] =  keyObject[el][keyObject[el].length - 1].end_date;
    newData.push(element);
  });
  return newData;
};
//@func - for fetching CarePlan.
//@param - episode Id
//@return - Fetched Patient Visits.
export const fetchCarePlan = async (eid) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-type": "application/json",
    };
    const encodedData = Encode({ id: eid });
    const response = await fetch(
      process.env.REACT_APP_API + "/get-all-care-plan_v1/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(encodedData),
      }
    );
    const responseData = await response.json();
    //  console.log("data is coming ",responseData);
    const data = Decode(responseData);
    console.log("response dara is ", data);
    // console.log(data);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error: " + response.status + response.statusText);
    }
    return filterCarePlanData(data);
    // return data;
  } catch (err) {
    // console.log(err, "Error in Fetching Patient Care Plan");
    return [];
  }
};
const newFilterCarePlanData = (data) => {
  let keyObj = {};
  data.map((item) => {
    keyObj[item.careplan_code] = item;
  });

  console.log("data is coming ", Object.values(keyObj));
  return Object.values(keyObj)
};
export const CarePlan = async (eid) => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-type": "application/json",
    };
    const encodedData = Encode({ id: eid });
    const response = await fetch(
      process.env.REACT_APP_API + "/get-all-care-plan_v1/",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(encodedData),
      }
    );
    const responseData = await response.json();
    const data = Decode(responseData);
    // console.log(data);
    console.log(data);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Error: " + response.status + response.statusText);
    }
    return newFilterCarePlanData(data);
    // return data;
  } catch (err) {
    // console.log(err, "Error in Fetching Patient Care Plan");
    return [];
  }
};
//@func - for fetching History.
//@param -
//@return - Fetched History.
export const fetchHistory = () => {
    // console.log("Fetched History");
}

const filterCarePlanDataEnterprise = (data) => {
  console.log("check data  ", data);
  let newData = [];
  let keyObject = {};
  data.forEach((element) => {
    if (element.careplan_code in keyObject) {
      keyObject[element.careplan_code] = [
        ...keyObject[element.careplan_code],
        element,
      ];
    } else {
      keyObject[element.careplan_code] = [element];
    }
  });
  let keys = Object.keys(keyObject);
  keys.forEach((el) => {
    let element = keyObject[el][0];
    console.log("check data 1 ", keys);
    console.log("check data 2 ", keyObject);
    console.log("check data 3 ", element);
    console.log("check data 4 ", keyObject);
    console.log("check data 5 ", el);
    console.log("check data 6 ", keyObject[el].length - 1);
    console.log("check data 7 ", keyObject[el][keyObject[el].length - 1].date);
    console.log("check data 8 ", keyObject[el][keyObject[el].length - 1].end_date);
    keyObject[el].length - 1;
    element["start_date"] =  keyObject[el][keyObject[el].length - 1].start_date;
    delete element["date"];
    element["end_date"] =  keyObject[el][keyObject[el].length - 1].end_date;
    newData.push(element);
  });
  return newData;
};

export const fetchCarePlanEmp = async (eid) => {
    try {
        const headers = {
            Accept: 'application/json',
            "Content-type": "application/json"
        }
        // const encodedData = Encode();
        const response = await fetch(process.env.REACT_APP_API + "/get_emp_all_careplan/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: eid })
        });
        const data = await response.json();
           console.log("data is coming ",data);
        // const data = Decode(responseData);
        // console.log(data);
      
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Error: " + response.status + response.statusText);
        }
        return filterCarePlanDataEnterprise(data);
        // return data;
    } catch (err) {
        // console.log(err, "Error in Fetching Patient Care Plan");
        return [];
    }
}
