import React,{useEffect,useState }from "react";
import { Row, Col, Button } from "antd";
import LinearProgress from './LinearProgress';

const BottomCard = (props) => {
    return (
        <Row className="" style={{
            height: "auto",
            width: "100%",
            padding: 20,
            backgroundColor: "#fbfbfb",
        }}>
            <Col lg={12} md={12} sm={12} xs={24}>
                <h4 className="fw-bold">{props.therapy}</h4>
                <p className="p text-justify">
                    {props.about}
                </p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24} className="text-center mt-2 mb-2 px-1">
                <LinearProgress progress={props.progress} />
                <p className="fw-bold p">{props.progress}%</p>
                {/* {props.button === undefined && (
                    <Button className="skip-button">
                        Continue
                    </Button>)} */}
            </Col>
        </Row>
    )
}
export default BottomCard;