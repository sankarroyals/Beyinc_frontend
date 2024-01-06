import { jwtDecode } from 'jwt-decode';
import React , {useEffect, useState}from 'react'
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { useSelector } from 'react-redux';

export const LoginAuth = (Component) => {
    return function WithHooks(props) {
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );
        return (
            email !== undefined ? <Home /> : <Component />
        )
    } 
}

const AuthHoc = (Component) => {
    return function WithHooks(props) {
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );

        return(
            email !== undefined ? <Component /> : <Login />
        )
    }
}

export default AuthHoc