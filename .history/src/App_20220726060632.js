import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Router, Switch, useHistory } from "react-router-dom";
import "./App.css";
import "./styles/App.css";
import "antd/dist/antd.css";
// import Quiz from "./component/Quiz.js";
// import PatientSchedule from './component/PatientComponents/PatientSchedule/PatSchedule';
// import ExerciseDetail from "./component/PatientComponents/PatientSchedule/ExerciseDetail.js";
// import PatientAI from './component/PatientComponents/PatientAI/PatientAI';
// import Navigationbar from "./component/UtilityComponents/Navbar";
// import Logout from "./component/userAuth/Logout";
// import Login from './component/userAuth/Login'
import { isAuthenticated } from "./API/userAuth";
import PatientRoute from './component/PrivateRoute/PatientRoute'
// import Loading from "./component/UtilityComponents/Loading.js";
const Loading = lazy(() => import("./component/UtilityComponents/Loading.js"));
const Chatbot = lazy(() => import("./component/otherChatbot"));
const Quiz = lazy(() => import("./component/Quiz.js"));
const Logout = lazy(() => import("./component/userAuth/Logout"));
const Navigationbar = lazy(() => import("./component/UtilityComponents/Navbar"));
const PatientAI = lazy(() => import('./component/PatientComponents/PatientAI/PatientAI'));
const ExerciseDetail = lazy(() => import("./component/PatientComponents/PatientSchedule/ExerciseDetail.js"));
const PatientSchedule = lazy(() => import('./component/PatientComponents/PatientSchedule/PatSchedule'));
const Login = lazy(() => import('./component/userAuth/Login'))
const PatientProfile = lazy(() => import('./component/PatientComponents/PatientProfile/PatientProfile'));
const Terms = lazy(() => import('./Terms'))


const App = () => {
  return (
    <div className="App">
      {/* {window.location.pathname != "/login" && <Navbar assesment={true} />} */}
      {isAuthenticated() && JSON.parse(localStorage.getItem('startAssesment'))  &&<Navigationbar />}
      <Switch>
        <Suspense fallback={<Loading />}>
          <Route path="/" exact>
            {/* {!isAuthenticated() && <Navigationbar />} */}
            <Chatbot />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/terms" component={Terms} />
          <PatientRoute exact path="/patient/schedule" component={PatientSchedule} />
          <PatientRoute exact path="/patient/profile" component={PatientProfile} />
          <PatientRoute exact path="/patient/exercises/manual" component={ExerciseDetail} />
          <PatientRoute exact path="/patient/ai" component={PatientAI} />
        </Suspense>
      </Switch>
    </div>
  );
};

export default App;
