import { Button, Col, Modal, notification, Row, Switch,Alert } from "antd";
import html2canvas from "html2canvas";
import React, { Component } from "react";
let screenshot = [];
export default class PostureClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // url1: bodyImage,
      // url2: side_img,
      bodyImage: '',
      data:[],
      frontAngles: [0, 0, 0, 0, 0, 0],
      sideAngles: [0, 0, 0, 0],
      notes: "",
      toggleState: 1,
      orientCount: 1,
      //  isModalVisible: false,
      visible:true,
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

  componentWillUnmount() {
    const video = document.getElementById("video");
    if (video != null) {
      const mediaStream = video.srcObject;
      try {
        const tracks = mediaStream.getTracks();
        tracks[0].stop();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
}
  componentDidMount() {
    if (!this.state.isAiStart) {
      console.log("componentDidUpdate");
      this.setModelCanvas();
      window.darwin.launchModel();
      window.darwin.stop();
    }
   }
  //  componentDidMount() {
  //     console.log("componentDidMount");
  //     this.setModelCanvas();
  //     window.darwin.launchModel();
  //     window.darwin.stop();
  // }
  onChange = (value) => {
    this.setState({ isAiStart: !this.state.isAiStart });
    if (!this.state.isAiStart) {
      window.darwin.restart();
      window.darwin.selectOrientation(this.props.lvalue);
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
    // var img = document.getElementById("Bimg");
    // // this.state.url1 = dataURL
    // this.setState({ url1: dataURL });
    // img.src = dataURL;
    this.setState({bodyImage:dataURL})
    localStorage.setItem("img", dataURL);
    this.props.computeAns([ dataURL,  this.state.data],this.props.question);
    this.pro
    window.darwin.stop();
    this.openNotification("posture completed");
    this.props.closeModal();
    // //out.appendChild(img);
    //this.setLateralLeftOrientation()
  };

  openNotification = (msg) => { 
    const args = {
      message: msg,
      duration: 1,
    };
    notification.open(args);
  };

  setLateralLeftOrientation = () => {
    window.darwin.stop();
    this.setState({ orientCount: 2 });
    this.openNotification("Lateral");
    //setTimeout(()=>console.log("time out 2 sec"), 2500)
    window.darwin.restart();
    window.darwin.selectOrientation(this.props.lvalue);
  };
  // setLateralRightOrientation = () =>{
  //   this.setState({orientCount:2})
  //   this.openNotification("Lateral Right")
  //   setTimeout(()=>console.log("time out 2 sec"), 3000)
  //   window.darwin.restart();
  //   window.darwin.selectOrientation(3)

  // }

  AiModel = () => {
    try {
      window.darwin.eScreenShot((id) => {
        if (id === -1) {
          window.darwin.screenShot();
          if (this.state.orientCount === 1) {
            this.captureFront();
            //this.setState({ isAiStart: !this.state.isAiStart });
            const balanceAngles = window.darwin.showAngles();
            this.setState({data:balanceAngles})
            localStorage.setItem("angles", JSON.stringify(balanceAngles));
            //  this.setFrontAngles(balanceAngles);
            console.log(balanceAngles);
          } else {
            this.props.computeAns({ image: this.state.bodyImage, value: this.state.data },this.props.crrqst);
            console.log(true)
            this.openNotification("posture completed");
            this.props.setPosturePopUp(false);
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
          onCancel={()=>{window.darwin.stop(); this.props.setPosturePopUp(false); }}
          // closeIcon={
            
          // }
        >
          <div style={{marginTop:'5px',marginBottom:'5px'}}>
          <Alert message="Please switch on the toggle below before performing the exercise" type="info" showIcon closable />
          </div>
        <div style={{display:'flex',marginBottom:'5px',justifyContent:'end'}}>

          <Switch
              checked={this.state.isAiStart}
              checkedChildren="On" unCheckedChildren="Off"
              onChange={this.onChange}
            />
        </div>
           {/* <Switch
              checked={this.state.isAiStart}
              defaultChecked
              onChange={this.onChange}
            /> */}
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
