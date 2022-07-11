import { Col, Modal, notification, Row, Switch } from "antd";
import React, { Component } from "react";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontAngles: [0, 0, 0, 0, 0, 0],
      sideAngles: [0, 0, 0, 0],
      notes: "",
      toggleState: 1,
      isAiStart: false,
      checked1: false,
      checked2: false,
    };
  }
  setModelCanvas = () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("output");
    const jcanvas = document.getElementById("jcanvas");
    const options = {
      video,
      videoWidth: 640,
      videoHeight: 480,
      canvas,
      supervised: true,
      showAngles: true,
    };
    window.darwin.initializeModel(options);
  };

  componentDidUpdate() {
    if (!this.state.isAiStart) {
      console.log("componentDidUpdate");
      this.setModelCanvas();
      window.darwin.launchModel();
      window.darwin.stop();
      window.darwin.setExcersiseParams({
        name: "Squat",
        primaryKeypoint: 0,
        angles: [6, 7],
        minAmp: 30,
        primaryAngles: [6, 7],
        ROMs: [
          [30, 160],
          [30, 160],
        ],
        totalReps: 3,
        totalSets: 2,
      });
    }
  }
  openNotification = () => {
    notification.open({
      message: "AROM completed",
      description:
        "AROM completed",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };
  AiModel = () => {
    try {
      window.darwin.addProgressListener((setCount, repCount) => {
        if (repCount == 3) {
          console.log(setCount + "setCount");
          console.log(repCount + "setCount");
          this.openNotification();
          setTimeout(() => console.log("done"), 500);
          this.props.closeModal();
        }
      });
    } catch (err) {
      console.log(err);
      this.AiModel();
    }

    return (
      <Col span={24}>
        <Col id="Ai_vid" className="Ad_vid">
          <video
            id="video"
            className="video"
            playsInline
            style={{ display: "none" }}
          ></video>
          <canvas
            id="output"
            className="output"
            style={{ height: "335px", width: "100%" }}
          />
          <canvas id="jcanvas" style={{ position: "absolute" }} />
        </Col>
      </Col>
    );
  };
  onChange = () => {
    this.setState({ isAiStart: !this.state.isAiStart });
    if (!this.state.isAiStart) {
      window.darwin.restart();
      window.darwin.selectOrientation(1);
    } else {
      window.darwin.stop();
      console.log("backward");
      let data = window.darwin.getAssesmentData();
      console.log("front", data);
    }
  };
  AiModelProps = this.AiModel.bind(this);
  render() {
    return (
      <div>
        <Modal
          style={{
            top: 10,
          }}
          title="Posture Analysis"
          visible={this.props.isModalVisible}
          footer={null}
          //onOk={handleOk}
          //onCancel={handleCancel}
          closeIcon={
            <Switch
              checked={this.state.isAiStart}
              defaultChecked
              onChange={this.onChange}
            />
          }
        >
          <Row>{this.AiModelProps()}</Row>
          <Row>
            <Col span={24}>
              <Col id="Ai_vid" className="Ad_vid">
                <img
                  alt="image"
                  id="Bimg"
                  src=""
                  style={{ height: "335px", width: "100%" }}
                />
              </Col>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
