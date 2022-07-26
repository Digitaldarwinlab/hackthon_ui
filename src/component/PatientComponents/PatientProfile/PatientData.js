import { Button, Col, Result, Row, Select, Table } from 'antd'
import { Segmented } from 'antd';
import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../../../API/userAuth';
import { GetPatientCarePlan } from '../../PatientAPI/PatientShedule';
import Navigationbar from '../../UtilityComponents/Navbar';
import BackButton from '../shared/BackButton'
const Option = { Select }
const PatientData = () => {
    const [value, setValue] = useState('Map');
    const [exercises, setExercises] = useState({})
    const [exerslot, setExerSlot] = useState({})
    const [time, setTime] = useState([])
    function convert() {
        var date = new Date(),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        console.log([date.getFullYear(), mnth, day].join("-"))

        return [date.getFullYear(), mnth, day].join("-");
    }
    const columns = [
        {
            title: "Angles",
            dataIndex: "angles",
            key: "angles",
        },
        {
            title: "Min",
            dataIndex: "min",
            key: "min",
            render: (number) => Math.round(number),
        },
        {
            title: "Max",
            dataIndex: "max",
            key: "max",
            render: (number) => Math.round(number),
        },
    ];
    const tableLabels = {
        leftShoulder: "L Shoulder Abd/Add",
        rightShoulder: "R Shoulder Abd/Add",
        leftElbow: "L Elbow Flex",
        rightElbow: "R Elbow Flex",
        leftHipAdductionAbduction: "L Hip Fwd Flex",
        rightHipAdductionAbduction: "R Hip Fwd Flex",
        leftKnee: "L Knee Flex/Ext",
        rightKnee: "R Knee Flex/Ext",
        leftNeck: "L Cervical Side flex",
        rightNeck: "R Cervical Side Flex",
        leftPelvic: "L Lateral Side Flex",
        rightPelvic: "R Lateral Side Flex",
        leftWrist: "L Wrist",
        rightWrist: "R Wrist",
        leftAnkle: "L Ankle",
        rightAnkle: "R Ankle",
        leftHip: "L Hip Abd/Add",
        rightHip: "R Hip Abd/Add",
        cervicalForwardFlexion: "Cervical Fwd Flex",
    };
    const callApi = async () => {
        let result = await GetPatientCarePlan(Number(localStorage.getItem("userId")), convert());
        console.log("data ", result)
        if (result[0]) {
            setExercises(result[1][0].output_json)
            console.log("data ", result[1][0].output_json)
            // let temp = Object.keys(result[1][0].output_json)
            setTime(Object.keys(result[1][0].output_json))
            setValue(Object.keys(result[1][0].output_json)[0])
            setExerSlot(result[1][0].output_json[Object.keys(result[1][0].output_json)[0]])
        }
    }
    useEffect(() => {
        callApi()
    }, [])
    const changeEx = (slot) => {
        console.log("slot is ", exercises[slot])
        setExerSlot(exercises[slot])
    }
    return (
        <>
            <Navigationbar />
            <div style={{ minHeight: '10px' }}></div>
            <Row style={{ margin: '5px' }} gutter={[16, 16]}>
                <Col span={12}>
                    <BackButton />
                </Col>
                <Col span={12}>
                    <Segmented options={time} value={value} onChange={(e) => {
                        setValue(e)
                        changeEx(e)
                    }} />
                </Col>
            </Row>
            <div style={{ minHeight: '10px' }}></div>
            <Row gutter={[10, 10]}>
                {Object.keys(exerslot).length > 0 && Object.keys(exerslot).map(ex => (
                    <Col sm={24} md={12}>
                        <Row gutter={[10, 10]}><Col span={10}><b>{ex} </b></Col>
                            <Col span={6}>Set : <b>{exerslot[ex].set}</b> </Col>
                            <Col span={6}>Reps : <b>{exerslot[ex].rep}</b> </Col></Row>
                        <Col span={24}>
                            <Table
                                pagination={false}
                                columns={columns}
                                dataSource={Object.keys(exerslot[ex].rom).map((item, index) => {
                                    let t = {};
                                    t["key"] = index;
                                    t["angles"] =
                                        tableLabels[item]
                                            ? tableLabels[item]
                                            : "Not Available";
                                    console.log("testing ", Object(exerslot[ex].rom[item]).max)
                                    t["max"] = Object(exerslot[ex].rom[item]).max
                                    t["min"] = Object(exerslot[ex].rom[item]).min
                                    return t;
                                })}
                            />
                        </Col>
                    </Col>
                ))}
            </Row>
            {
                Object.keys(exerslot).length == 0 && <Row justify="center">
                    <Result

                        title="No data available for this time slot"

                    />
                </Row>
            }
        </>
    )
}
export default PatientData