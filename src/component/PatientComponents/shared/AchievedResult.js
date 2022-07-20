import React from "react";
//Styles
const styles = {
    scoreCard:{
        display:"flex"
    },
    score:{
        fontWeight: "bold",
        fontSize:20
    },
    successMessage:{
        fontSize:10,
        color:"gray",
        textAlign:"center"
    }
}
//Component
const AchievedResult = (props) => {
    return (
        <div>
            <div style={styles.scoreCard}>
                {props.icon}
                <h4 style={styles.score}>{props.score}</h4>
            </div>
            <h5 style={styles.successMessage}>{props.message}</h5>
        </div>
    )
}
export default AchievedResult;