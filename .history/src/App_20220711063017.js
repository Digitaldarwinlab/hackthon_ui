import { Button, Col, Row } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import React from "react";
import Login from "./component/Login";
import { Route, Router, Switch } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";
import Index from "./component/Index.js";
import Quiz from "./component/Quiz.js";
import Psub from "./component/Psub";
import Register from "./component/Register";
import Asub from "./component/Asub";

const App = () => {
  return (
    <div className="App">
    <Switch>
      <Route path="/" exact>
       <Index />
      </Route>
      <Route path="/chat" exact>
        <Quiz />
      </Route>
      <Route path="/posture" exact>
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
      </Route>
    </Switch>
</div>
  );
};

export default App;
