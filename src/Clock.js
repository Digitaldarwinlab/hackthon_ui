import React, { Component } from "react";

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  componentDidMount() {
    console.log("componentDidMount")
    this.timerID = setInterval(() => this.tick(), 1000);
  }

//   componentDidUpdate() {
//     console.log("componentDidMount")
//     //this.timerID = setInterval(() => this.tick(), 1000);
//   }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
