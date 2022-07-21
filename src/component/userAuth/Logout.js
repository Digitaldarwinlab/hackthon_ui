import React,{useEffect} from 'react';
import { Redirect } from 'react-router-dom';
//import { logout } from '../../API/userAuth/userAuth';

export default function Logout() {

    useEffect(()=>{
       // logout();
        localStorage.clear();
        window.location.href="/login"
    },[]);

    return (
        <div>
            {false && <Redirect to="/login" />}
        </div>
    )
}
