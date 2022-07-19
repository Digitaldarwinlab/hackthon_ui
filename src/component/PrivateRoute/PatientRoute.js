import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../../API/userAuth';

const PatientRoute = ({ component: Component, ...rest }) => {
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isAuthenticated() ?
                (getUserData() === "admin" || getUserData() === "physio" || getUserData() === "HeadPhysio")
                    ? <Redirect to="/dashboard" />
                    : (<Component {...props} />)
                : <Redirect to="/login" />
        )} />
    );
};
export default PatientRoute;