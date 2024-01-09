import { jwtDecode } from 'jwt-decode';
import React , {useEffect, useState}from 'react'
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export const LoginAuth = (Component) => {
    return function WithHooks(props) {
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );
        const [loading, setLoading] = useState(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return (
            email !== undefined ? <Navigate to='/' /> : loading ? <></> : <Component />
        )
    } 
}

export const AdminDeciderHoc = (Component) => {
    return function WithHooks(props) {
        const { role } = useSelector(state => state.auth.loginDetails);
        return (
            (role !== undefined && role == 'Admin') ? <Component /> : <Navigate to='/' /> 
        )
    }
}

const AuthHoc = (Component) => {
    return function WithHooks(props) {
        const { email } = useSelector(
            (store) => store.auth.loginDetails
        );

        return(
            email !== undefined ? <Component /> : <Navigate to='/login' /> 
        )
    }
}

export default AuthHoc