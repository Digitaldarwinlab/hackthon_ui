import React, { useRef, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Row, Col, Button, Modal } from 'antd';
import "../../styles/Layout/VideoCon.css"


var channel=""
var uid=""
var pid=""

const PatientVideoCallIndex = (props) => {

  const state = useSelector(state => state);
  const [modalVisible, setModalvisible] = useState(false)
  const [videoUrl,setVideoURL]=useState("")


  useEffect(() => {
    $("#mic-btn").prop("disabled", true);
    $("#video-btn").prop("disabled", true);
    $("#screen-share-btn").prop("disabled", true);
    $("#exit-btn").prop("disabled", true);
    setModalvisible(true)
    const arr=props.match.params.channel.split("_")
    channel=arr[0]
    uid=arr[2]
    pid=arr[1]
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext('2d');
    // ctx.beginPath();
    // ctx.rect(10, 10, canvas.clientWidth, canvas.clientHeight);
    // ctx.fillStyle = 'white';
    // ctx.fill();
  }, [])
  
  const doubleClick = () => {
    document.documentElement.requestFullscreen().catch((e) => {
      // console.log(e);
    })
  }

  const handleCancel=()=>{
    window.top.close()
  }

  const joinChannel = async() => {
    let streamCanvas = document.getElementById("scanvas");
    var agoraAppId = "616487fe8ede4785aa8f7e322efdbe7d"
    var channelName = $("#form-channel").val();
    var uid = parseInt($("#form-uid").val());
    // const data = await res.json();
    // var token = data.rtcToken
  //  const res = await fetch(`localhost:3000/rtc/${channelName}/subscriber/uid/${uid}`);
    const res = await fetch(`${process.env.REACT_APP_EXERCISE_URL}/rtc/${channelName}/subscriber/uid/${uid}`);
    const data = await res.json();
    var token = data.rtcToken
    setModalvisible(false)
    ClientAndJoinChannel(
      agoraAppId,
      token,
      channelName,
      uid,
      streamCanvas
    );
    joinRTMChannel(uid);
  }

  const Exit=()=>{
    // console.log("so sad to see you leave the channel");
    leaveChannel();
    // setModalvisible(true)
    handleCancel();
  }

  return (

    <React.Fragment>

      {/* <Row gutter={[20,20]}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <MyPhysioLogo text="text-white" />
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <p className="p text-white fw-bold">| pqt-qxy-rty |</p>
                    </Col>
                </Row> */}
      <div class="container-fluid p-0">
        <div id="main-container">
          <div id="buttons-container" class="row fixed-bottom justify-content-center mt-3 mb-1">
            <div class="col-md-2 text-center">
              {/* <Button id="mic-btn" className="btn-dark">
                <i id="mic-icon" class="fas fa-microphone"></i>
              </Button> */}
              <button
                id="mic-btn"
                type="button"
                class="btn btn-block btn-dark btn-lg"
              >
                <i id="mic-icon" class="fas fa-microphone"></i>
              </button>
            </div>
            <div class="col-md-2 text-center">
              <button
                id="video-btn"
                type="button"
                class="btn btn-block btn-dark btn-lg"
              >
                <i id="video-icon" class="fas fa-video"></i>
              </button>
            </div>
            <div id="screen-share-btn-container" class="col-md-2 text-center">
            <button 
            type="button" 
            id="screen-share-btn" 
            class="btn btn-block btn-dark btn-lg"
            >
              <i id="screen-share-icon" class="fas fa-desktop"></i>
            </button>
            </div>
            <div class="col-md-2 text-center">
              <button
                id="exit-btn"
                type="button"
                class="btn btn-block btn-red btn-lg"
                onClick={Exit}
              >
                <i id="exit-icon" class="fas fa-phone-slash"></i>
              </button>
            </div>
          </div>
          <div id="local-stream-container" class="col-10 mt-3 ml-1">
              
              <div id="no-local-video" class="col text-center">
                <i id="user-icon" class="fas fa-user"></i>
              </div>
              <div id="local-video" style={{width: "77vw",height: "80vh",  position: "absolute", transform:"scaleX(-1)"}} class="col p-0">
              <canvas style={{width: "70vw",height:'70vh',  position: "absolute"}} class="col p-0" id="scanvas"></canvas>
              <div id="mute-overlay">
                <i id="mic-icon" class="fas fa-microphone-slash"></i>
              </div>
              </div>
            </div>
          <div id="lower-video-bar" class="row mb-1">
            <div id="remote-streams-container" class="container col-9 ml-1">
              <div id="remote-streams" class="row">
              </div>
            </div>
            <div id="full-screen-video" style={{
              position:"absolute",
              height:"20vh",
              width:"20vw",
              zIndex:1}}
            class="d-flex flex-row-reverse offset-md-10 col-md-3 mr-4 p-0"></div>

          </div>
          <div id="video-block" style={{display:"none"}} > 
          <div class="d-flex flex-row-reverse mt-4">
          <video id="video-screen" src={`${process.env.REACT_APP_EXERCISE_URL}/`+videoUrl} autoPlay controls loop className="videoScreenCon" />
          </div>
          </div>

        </div>
      </div>
      <Modal
      onCancel={handleCancel}
        visible={modalVisible}
        title={<h3 style={{ textAlign: "center", paddingTop: 5 }} class="modal-title w-100 font-weight-bold">Join Channel</h3>}
        footer={[
          <div class=" d-flex justify-content-center">
            <Button id="join-channel" size="large" type="text" onClick={joinChannel}>
              Join Channel
            </Button>
          </div>
        ]}
      >
        <input type="text" 
        id="form-channel" 
        class="form-control" 
        defaultValue={channel}/>
        <label for="form-channel">Channel</label>

        <input
          type="number"
          id="form-uid"
          class="form-control"
          defaultValue={uid}
          data-decimals="0"
          disabled
        />
        <label for="form-uid">UID</label>

        <input
          type="number"
          id="form-peerId"
          class="form-control"
          defaultValue={pid}
          data-decimals="0"
          disabled
        />
        <label for="form-uid">Peer ID</label>
      </Modal>
      {/* <canvas ref={canvasRef} width="1310" height="550"></canvas> */}
    </React.Fragment>
  )
}
export default PatientVideoCallIndex;