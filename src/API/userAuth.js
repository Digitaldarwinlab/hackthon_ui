import axios from "axios";
import Cookies from 'js-cookie';

const AddCookies = (key, value) => {
    Cookies.set(key, value, { expires: 1 });
}
const AddUserInfo = (token, user, user_id, clinic_id) => {
    localStorage.setItem("jwt", JSON.stringify(token))
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", JSON.stringify(user_id));
}
export const signup = async (user) => {
    // console.log(user,dispatch);
    //dispatch({ type: SIGNUP_REQUEST });
    const headers = {
        "Accept": 'application/json',
        "Content-type": "application/json"
    }
    // user["id"] = JSON.parse(localStorage.getItem("userId"));
    try {
        //const res = await axios.post("https://hackathon.physioai.care/api/emp_login",user)
        const response = await fetch("https://hackathon.physioai.care/api/emp_login/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(user)
        });

        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
            if (data && data.message) {
                return [false, data.message];
            } else if(data.detail){
                return [false, data.detail];
            }else {
                return [false, "Error " + response.status + response.statusText];
            }
        } else {
            AddCookies("jwt", data.jwt);
            if (data.first_time) {
                localStorage.setItem("userId", JSON.stringify(data.user_id));
                return [false, "Please Change Your Password."];
            }
            AddUserInfo(data.jwt, { role: data.role, info: data.basic_info, clinic_id: data.clinic_id }, data.user_id);
            // dispatch({ type: LOGIN_SUCCESS });
            return [true];
        }
    } catch (err) {
        return [false, "Error 403: " + err.message];

    }
}

export const getUserData = () => {
    try {
        let data = JSON.parse(localStorage.getItem("user"));
        return data.role;
    } catch (err) {
        // console.log(err);
        return "";
    }
}

export const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt"))
        return JSON.stringify(localStorage.getItem("jwt"));
    return false;
}