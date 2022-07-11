import { Button } from "antd";
import React, { Component } from "react";
import Posture from "./Posture";
import PostureClass from "./PostureClass";

export default class Psub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }
  closeModal = () => {
    this.setState({isModalVisible:false})
  }
  render() {
    return (
      <div>
        <Button
          onClick={() =>
            this.setState({ isModalVisible: !this.state.isModalVisible })
          }
        >
          Click
        </Button>
        <PostureClass closeModal={this.closeModal} isModalVisible={this.state.isModalVisible} />
      </div>
    );
  }
}
