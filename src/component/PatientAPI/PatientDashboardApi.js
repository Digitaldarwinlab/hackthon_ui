// import fetch from "isomorphic-fetch";
//@get Current Episode For Patient 
//@Input Current Loggedin Patient Id
export const GetPatientCurrentEpisode = async () => {
    //get userId from LocalStorage
    let userId = JSON.parse(localStorage.getItem("userId"));
    //headers
    const headers = {
        "Accept": 'application/json',
        "Content-type": "application/json"
    }
    try {
        const response = await fetch(process.env.REACT_APP_API + "/get_episode/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: userId })
        });
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            return [false, "Error " + response.status + response.statusText];
        } else {
            if (data.length !== 0)
                return [true, [data[0]]];
            return [true, data];
        }
    } catch (err) {
        return [false, "Error 403: " + err.message];
    }
}
export const getPatientProgress = async () => {
    //get userId from LocalStorage
    let userId = JSON.parse(localStorage.getItem("userId"));
    //headers
    const headers = {
        "Accept": 'application/json',
        "Content-type": "application/json"
    }
    try {
        const response = await fetch(process.env.REACT_APP_API + "/patient-progress/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ id: userId })
        });
        const data = await response.json();
        console.log("response data ",data)
        if (response.status !== 200 && response.status !== 201) {
            return [false, "Error " + response.status + response.statusText];
        } else {
            if (data.length !== 0)
                return data;
            return data;
        }
    } catch (err) {
        return [false, "Error 403: " + err.message];
    }
}
export const GetCalanderDataApi = async () => {
    console.log("AK Inside API call");
      //headers
      const headers = {
          "Accept": 'application/json',
          "Content-type": "application/json"
      }
      try {
          const response = await fetch(process.env.REACT_APP_API + "/calendar/", {
              method: "GET",
              headers: headers
          });
          const data = await response.json();
          if (response.status !== 200 && response.status !== 201) {
              return "Error " + response.status + response.statusText;
          } else {
              if (data.length !== 0)
                  return data;
              return data;
          }
      } catch (err) {
          return [false, "Error 403: " + err.message];
      }
  }

export const exercise_detail=async (name)=>{
    const headers = {
        "Accept": 'application/json',
        "Content-type": "application/json"
    }

    try {
        const response = await fetch("https://hackathon.physioai.care/api" + "/exercise_detail_v1/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({exercise: name })
        });
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            return [false, "Error " + response.status + response.statusText];
        } else {
            if (data.length !== 0)
                return data;
            return data;
        }
    } catch (err) {
        return [false, "Error 403: " + err.message];
    }

}