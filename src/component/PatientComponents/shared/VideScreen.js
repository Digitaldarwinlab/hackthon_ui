import React from "react"
export default function VideoScreen(props) {
    if (props.height) {
        return (
            <video  controls
          //   autoplay="autoplay" loop 
            style={{ width: "97%", height: "100%" }} className="border">
                <source src={props.video} type="video/mp4" />
            </video>
        )
    }
    return (
        <video controls
      //   autoplay="autoplay" loop 
        style={{ width: "97%" }} className="border">
            <source src={props.video} type="video/mp4" />
        </video>
    )
}
