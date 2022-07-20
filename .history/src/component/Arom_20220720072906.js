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
        angles: this.props.jointValue,
        primaryAngles: this.props.jointValue,
        minAmp: 10,
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
      description: "AROM completed",
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
          this.props.setAromPopUp(false);
          let res = window.darwin.getAssesmentData();
          setTimeout(() => {
            this.props.computeAns([JSON.stringify(res)], this.props.question);
          }, 1000);
          window.darwin.stop();
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
            style={{ height: "382px", width: "100%", padding: "10px" }}
          />
          <canvas id="jcanvas" style={{ position: "absolute" }} />
        </Col>
      </Col>
    );
  };
  onChange = async () => {
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
          title="Arom Analysis"
          visible={this.props.isModalVisible}
          footer={null}
          //onOk={handleOk}
          //onCancel={handleCancel}
          closeIcon={
            
          }
        >
          <div
            style={{
              display: "flex",
              marginBottom: "5px",
              justifyContent: "end",
            }}
          >
            <Switch checked={this.state.isAiStart} onChange={this.onChange} />
          </div>
          <Row>{this.AiModelProps()}</Row>
          <Row>
            <Col span={24}>
              <Col id="Ai_vid" className="Ad_vid">
                {/* <img
                  alt="image"
                  id="Bimg"
                  src=""
                  style={{ height: "335px", width: "100%" }}
                /> */}
              </Col>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
