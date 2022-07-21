import { Button, Col, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import Login from "./component/Login";
import Login1 from "./component/userAuth/Login";
import { Route, Router, Switch, useHistory } from "react-router-dom";
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
import Navigationbar from "./component/UtilityComponents/Navbar";
import Logout from "./component/userAuth/Logout";
import { isAuthenticated } from "./API/userAuth";


const App = () => {
  const [nav, setNav] = useState(true)
  const history = useHistory()
  console.log("history ",history)
  useEffect(() => {
    if(window.location.pathname=="/login"){
      setNav(false)
    }else{
      setNav(true)
    }
  }, [history])
  return (
    <div className="App">
      {/* {window.location.pathname != "/login" && <Navbar assesment={true} />} */}
      {isAuthenticated()&&<Navigationbar />}

      <Switch>
        <Route path="/" exact>
        {!isAuthenticated()&&<Navigationbar />}
          <Quiz />
        </Route>
        <Route path="/login" exact>
          <Login1 />
        </Route>
        <Route exact path="/logout" component={Logout} />
        <PatientRoute exact path="/patient/schedule" component={PatientSchedule} />

        <PatientRoute exact path="/patient/exercises/manual" component={ExerciseDetail} />
        <PatientRoute exact path="/patient/ai" component={PatientAI} />
        {/* /patient/exercises/brief */}
        {/* <Route path="/posture" exact>
          <Psub />
        </Route>
        <Route path="/arom" exact>
          <Asub />
        </Route>
        <Route path="/cons" exact>
          <Asub />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route> */}
      </Switch>
    </div>
  );
};

export default App;
