import React from "react";
import { FaMedal } from "react-icons/fa";


//styles
const styles = {
    item: {
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "5px",
        fontSize: 13,
        height: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    }
}
const PreviousWeekAchievements = ({ data, showPrevious = true }) => {
    return (
        <div className="mt-2" style={{
            height: "auto",
            width: "100%",
            backgroundColor: "#fbfbfb",
            border:"0px",
        }}>
            {/* {showPrevious && <h4 className="fw-bold AchievementWeek">Last Week's Achievement</h4>} */}
            {showPrevious && <hr className="m-0" />}
            {
                data.map((item, value) => {
                    return (
                        <div className="AchievementList" style={{ display: "flex"
                        ,borderBottom: (value !== data.length-1)?"1px solid #C1C7C6":""}} key={value}>
                            <div style={styles.item}>
                                <div style={{ display: "flex" }}>
                                    <FaMedal size={20} color="black" />
                                    <h4 className="fw-bold">{item.key}</h4>
                                </div>
                                <h4 className="fw-bold">{item.number}</h4>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default PreviousWeekAchievements;