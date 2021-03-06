import { Button, Col, Modal, notification, Row, Switch } from "antd";
import html2canvas from "html2canvas";
import React, { Component } from "react";
let screenshot = [];
export default class Posture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // url1: bodyImage,
      // url2: side_img,
      frontAngles: [0, 0, 0, 0, 0, 0],
      sideAngles: [0, 0, 0, 0],
      notes: "",
      toggleState: 1,
      //  isModalVisible: false,
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
      //supervised: true,
      canvas,
      drawLine: true,
      enterprise: true,
      ROMPanel: {
        canvas: jcanvas,
        width: 150,
        height: 150,
        radius: 70,
      },
    };
    window.darwin.initializeModel(options);
  };

  componentDidUpdate() {
    if (!this.state.isAiStart) {
      console.log("componentDidUpdate");
      this.setModelCanvas();
      window.darwin.launchModel();
      window.darwin.stop();
    }
  }
  onChange = (value) => {
    this.setState({ isAiStart: !this.state.isAiStart });
    if (!this.state.isAiStart) {
      window.darwin.restart();
      window.darwin.selectOrientation(1);
      console.log("forward");
    } else {
      window.darwin.stop();
      console.log("backward");
    }
    //

    // // console.log('forward',checked1)
    // window.darwin.restart();
    // window.darwin.selectOrientation(1);
  };

  captureFront = async () => {
    //window.scrollTo(0, 0);
    // const out = document.getElementById("scr_out1");
    const canvas = await html2canvas(document.getElementById("output"));
    //html2canvas(document.getElementById("output")).then(function (canvas) {
    screenshot.push(canvas.toDataURL("image/jpeg", 0.9));
    console.log(canvas.toDataURL("image/jpeg", 0.9));
    // var extra_canvas = document.createElement("canvas");
    // extra_canvas.setAttribute("width", 180);
    // extra_canvas.setAttribute("height", 180);
    // var ctx = extra_canvas.getContext("2d");
    // ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 180, 180);
    var dataURL = canvas.toDataURL("image/jpeg", 0.9);
    var img = document.getElementById("Bimg");
    // // this.state.url1 = dataURL
    // this.setState({ url1: dataURL });
    img.src = dataURL;
    // //out.appendChild(img);
  };

  openNotification = () => {
    notification.open({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  AiModel = () => {
    try {
      window.darwin.eScreenShot((id) => {
        if (id === -1) {
          window.darwin.screenShot();
          if (this.state.toggleState === 1) {
            this.captureFront();
            this.setState({ isAiStart: !this.state.isAiStart });
            const balanceAngles = window.darwin.showAngles();
            //  this.setFrontAngles(balanceAngles);
            console.log(balanceAngles);
          } else {
            this.captureSide();
            this.setState({ isAiStart: !this.state.isAiStart });
            const balanceAngles = window.darwin.showAngles();
            //  this.setSideAngles(balanceAngles);
            console.log(balanceAngles);
          }
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
