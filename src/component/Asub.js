import { Button } from "antd";
import React, { Component } from "react";
import Arom from "./Arom";


export default class Asub extends Component {
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
        <Arom closeModal={this.closeModal} isModalVisible={this.state.isModalVisible} />
      </div>
    );
  }
}
