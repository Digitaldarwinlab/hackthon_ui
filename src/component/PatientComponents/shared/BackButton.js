import { useHistory } from 'react-router-dom';
import React from 'react';
const BackButton = () => {
    let history = useHistory();
    return (
        <i className="fas fa-arrow-left"
        style={{ cursor: "pointer" }}
        title="Go Back"
        onClick={() => {
            history.goBack()
        }} role="button"></i>
    )
}
export default BackButton;