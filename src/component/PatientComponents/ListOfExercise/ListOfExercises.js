import { useState } from "react";
import { Row, Col } from "antd";
import BackButton from './../shared/BackButton';
import { FaMedal, FaStopwatch } from "react-icons/fa";
import CircularBar from './../shared/CircularProgress';
import AchievedResult from './../shared/AchievedResult';

//Style
const flexStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    height: "70%",
    backgroundColor: "#fbfbfb",
    boxShadow: "2px 2px 1px 1px rgba(0, 0, 0, 0.2)"
}
const borderBottom = {
    width: "100%",
    height: 2,
    backgroundColor: "#fff"
}
//tempData
let image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80";
const tempData = [
    { name: "Side to Side", img: "" },
    { name: "Head to Knees", img: "" },
    { name: "Knee to Chest", img: "" },
    { name: "The Goddess Post", img: "" },
    { name: "Stretch Hands", img: "" },
    { name: "Folded Legs", img: "" }
];
//Exercises List
const ListOfExercises = () => {
    const [acitveIndex, setActiveIndex] = useState(0);
    //List Of Sub Exercises
    const ListOfSubExercises = (data) => {
        return (
            <>
                {
                    data.map((val, index) => (
                        <div
                            onClick={() => setActiveIndex(index)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: acitveIndex === index ? "#f6f6f6" : "white",
                                border: `${(index !== data.length - 1) ? 2 : 0}px solid #fff`,
                                margin: "0px auto",
                            }}>
                            <div style={{ display: "flex", boxShadow: acitveIndex === index ? "2px 2px 2px 2px rgba(0, 0, 0, 0.2)" : "" }} className="px-2 py-2">
                                <img
                                    src={val.img ? val.img : image}
                                    alt={`main${index}`}
                                    className="ms-2"
                                    style={{ width: 65, height: 65,  borderRadius: 10 }}
                                />
                                <h5
                                    className="fw-bold"
                                    style={{
                                        margin: "auto 10px",
                                        color: acitveIndex === index ? "green" : "black"
                                    }}>
                                    {val.name}
                                </h5>
                            </div>
                        </div>
                    ))
                }
            </>
        )
    }
    return (
        <>
            <Row className="m-2" gutter={[5, 5]}>
                <Col lg={16} md={16} sm={12} xs={24}>
                    <div style={{ display: "flex" }} className="mt-2">
                        <h3 className="fw-bold m-1">
                            <BackButton />
                        </h3>
                        <img src={image} alt="main_exerc" className="ms-2" style={{ width: 85, height: 85,  borderRadius: 40 }} />
                        <h4 className="fw-bold" style={{ margin: "auto 10px" }}>Stretch - Backache</h4>
                    </div>
                </Col>
                <Col lg={8} md={8} sm={12} xs={24}>
                    <h4 className="fw-bold text-center p">Last Week's Practice Result</h4>
                    <div className="border px-1 py-1" style={flexStyle}>
                        <AchievedResult
                            icon={<FaMedal size={25} color="black" />}
                            score="8/10" message="Your Success" />
                        <CircularBar precentage={5000 / 6000 * 100} score={5000} color='#76c0b1' width={80} />
                        <AchievedResult
                            icon={<FaStopwatch size={25} color="black" />}
                            score="30 min" message="Your Practice Time" />
                    </div>
                </Col>
            </Row>
            <div style={borderBottom}></div>
            {ListOfSubExercises(tempData)}
        </>
    )
}
export default ListOfExercises;