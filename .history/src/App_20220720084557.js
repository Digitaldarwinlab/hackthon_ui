import { Button, Col, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import React from "react";
import Login from "./component/Login";
import Login1 from "./component/userAuth/Login";
import { Route, Router, Switch } from "react-router-dom";
import "./App.css";
import "./styles/App.css";
import "antd/dist/antd.css";
import Index from "./component/Index.js";
import Quiz from "./component/Quiz.js";
import Psub from "./component/Psub";
import Register from "./component/Register";
import Asub from "./component/Asub";
import PatientRoute from './component/PrivateRoute/PatientRoute'
import PatientSchedule from './component/PatientComponents/PatientSchedule/PatSchedule';
import Navbar from "./component/Navbar";
import ExerciseDetail from "./component/PatientComponents/PatientSchedule/ExerciseDetail.js";
import PatientAI from './component/PatientComponents/PatientAI/PatientAI';

const App = () => {
  return (
    <div className="App">
      {window.location.pathname!="/login"&&<Navbar  />}
      
    <Switch>
      {/* <Route path="/login" exact>
       <Index />
      </Route> */}
      <Route path="/login" exact>
       <Login1 />
      </Route>
      <PatientRoute exact path="/patient/schedule" component={PatientSchedule} />
      {/* <Route path="/patient/schedule" exact>
        <PatientSchedule />
      </Route> */}
      <PatientRoute exact path="/patient/exercises/manual" component={ExerciseDetail} />
      <PatientRoute exact path="/patient/ai" component={PatientAI} />
      {/* /patient/exercises/brief */}
      <Route path="/" exact>
        <Quiz />
      </Route>
      {/* <Route path="/posture" exact>
        <Psub />
      </Route>
      <Route path="/arom" exact>
        <Asub />
      </Route> */}
      {/* <Route path="/cons" exact>
        <Asub />
      </Route> */}
      {/* <Route path="/register" exact>
        <Register />
      </Route> */}
    </Switch>
</div>
  );
};

export default App;
