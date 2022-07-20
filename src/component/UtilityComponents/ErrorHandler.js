import React, { useState } from "react";
import { Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

const Error = (props) => {
    const [visible, setVisible] = useState(true);
    const state = useSelector(state => state.Validation);
    const dispatch = useDispatch();

    const handleClose = () => {
        setVisible(false);
        dispatch({ type: "NOERROR" });
    };
    return (
        <>
            {visible && props.error ?
                <Alert type="error" message={props.error} className="mb-2" closable afterClose={handleClose} /> : null}
        </>
    )
}
export default Error;