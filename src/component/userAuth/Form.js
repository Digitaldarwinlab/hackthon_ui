import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import { SIGNUP_FAILURE, STATECHANGE, VALIDATION, LOGIN_FAILURE } from "../../contextStore/actions/authAction.js";
import { signup, signin } from "./../../API/userAuth/userAuth.js";
import "../../styles/userAuth/userAuth.css";
import validation from "./../Validation/authValidation/authValidation.js";
// import apiValidation from "./../../API/apiValidation/apiValidation.js";
import Error from "./../UtilityComponents/ErrorHandler.js";
import FormInput from './../UI/antInputs/FormInput';
import Loading from './../UtilityComponents/Loading';
import Success from './../UtilityComponents/SuccessHandler';
import FormPassword from './../UI/antInputs/FormPassword';
import ForgotPassword from './ForgotPassword';
import packageJson from "../../../package.json";
import { getBuildDate } from "../../utils/utils";
import withClearCache from "../../ClearCache";
const ClearCacheComponent = withClearCache(MainApp);
function MainApp(props) {
    return (
      <div >  
          <p>Build date: {getBuildDate(packageJson.buildDate)}</p> 
      </div>
    );
  }

const AuthForm = (props) => {
    const state = useSelector(state => state);
    const localState = localStorage.getItem("blocked") ? JSON.parse(localStorage.getItem("blocked")) : 0;
    const [disableState, setDisableState] = useState(localState === 1);
    const dispatch = useDispatch();
    const handleChange = (key, value, id = 0) => {
        dispatch({
            type: STATECHANGE,
            payload: {
                key,
                value
            }
        });
        dispatch({ type: "NOERROR" });
    }

    const handleBlur = e => {
        const key = e.target.name;
        let error = {};
        if (key === "email") {
            if (e.target.value === "")
                error["error"] = "Username must be filled."
            // let verifyEmail = apiValidation.checkEmailValid({type:"email",value:e.target.value});
            // if(!verifyEmail) dispatch({type:VALIDATION,payload:{error:"Email id is already present."}})
        }
        else {
            error = validation.checkPasswordValidation(e.target.value);
        }
        if (error.error)
            dispatch({ type: VALIDATION, payload: { error: error.error } });
    }

    const handleSubmitForm = async (value) => {
        let result;
        if (!state.Validation.error) {
            if (props.isSignin) {
                const number = state.loginReducer.login_attempt >= 10 ? 1 : 0;
                const user = {
                    uid: state.loginReducer.email,
                    password: state.loginReducer.password,
                    blocked: number
                }
                result = await signin(user, dispatch);
                // console.log(result);
                if (result && result[0])
                    window.location.href = "/dashboard";
                else {
                    if (result[1] === "Please Change Your Password.") {
                        dispatch({ type: VALIDATION, payload: { error: result[1] } });
                        window.location.href = "/change-password";
                    }
                    else {
                        dispatch({ type: LOGIN_FAILURE });
                        if (state.loginReducer.login_attempt === 9) {
                            dispatch({ type: VALIDATION, payload: { error: result[1] + " You are left with only 1 attempt." } })
                        } else if (state.loginReducer.login_attempt >= 10) {
                            setDisableState(true);
                            dispatch({ type: VALIDATION, payload: { error: "Your Account is Blocked." } })
                        } else {
                            dispatch({ type: VALIDATION, payload: { error: result[1] } });
                        }
                    }
                }
                // signin(user,dispatch);
            } else {
                if (state.signupReducer.new_password !== state.signupReducer.confirm_password) {
                    dispatch({ type: VALIDATION, payload: { error: "New and Old Paswword should be same." } })
                } else {
                    const user = {
                        new_password: state.signupReducer.new_password
                    }
                    result = await signup(user, dispatch);
                    if (result[0])
                        window.location.href = "/";
                    else {
                        dispatch({ type: SIGNUP_FAILURE })
                        dispatch({ type: VALIDATION, payload: { error: result[1] } });
                    }
                }
                // signup(user,dispatch);
            }
        }
    }

    return (
        <React.Fragment>
            {state.Validation.error && (<Error error={state.Validation.error} />)}
            {(!state.Validation.error && localState === 1) && (<Error error="Your Account is Blocked" />)}
            {state.loginReducer.isLoading && (<Loading />)}
            {state.signupReducer.isLoading && (<Loading />)}
           
            <Form autoComplete="off" onFinish={handleSubmitForm}
                layout="vertical">
                {props.isSignin && (
                    <FormInput
                        className="formInput userNameLogin"
                        label="Username"
                        placeholder="Username"
                        value={props.isSignin ? state.loginReducer.email : state.signupReducer.email}
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required={true}
                        disabled={disableState}
                    />
                )}
                {props.isSignin ? (
                    <FormPassword
                        className="formInput"
                        label={props.isSignin ? "Password" : "Old Password"}
                        placeholder={props.isSignin ? "Password" : "Enter Old Password"}
                        value={props.isSignin ? state.loginReducer.password : state.signupReducer.old_password}
                        name={props.isSignin ? "password" : "old_password"}
                        onChange={handleChange}
                        required={true}
                        disabled={disableState}
                    />) : null}
                {
                    props.isSignin ? null : (
                        <FormPassword
                            className="formInput"
                            label="New Password"
                            placeholder="Enter New Password"
                            value={state.signupReducer.new_password}
                            name="new_password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required={true}
                        />
                    )
                }
                {
                    props.isSignin ? null : (
                        <FormPassword
                            className="formInput"
                            label="Confirm Password"
                            placeholder="Enter Confirm Password"
                            value={state.signupReducer.confirm_password}
                            name="confirm_password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required={true}
                        />
                    )
                }
                {/* {props.isSignin ? (
                    <ForgotPassword />)
                    : null} */}
                <Form.Item>
                    <Button
                        disabled={disableState}
                        type="primary" htmlType="submit" className="userAuthbtn">
                        {props.isSignin ? "Login" : "Change Password"}
                    </Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    )
};
export default AuthForm;


