import React, { Suspense, useEffect }from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import AuthHoc from "./AuthHoc";
import Toast from "./Components/Toast/Toast";
import { useDispatch } from "react-redux";
import { apicallloginDetails } from "./redux/AuthReducers/AuthReducer";
import { ApiServices } from "./Services/ApiServices";

const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() => wait(1000).then(() => import("./Components/ForgotPassword/ForgotPassword")));
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() => wait(1000).then(() => import("./Components/Home/Home")));
const Editprofile = React.lazy(() => wait(1000).then(() => import("./Components/Editprofile/Editprofile")));

const ENV = process.env;


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(apicallloginDetails());
  }, [])

  return (
    <div>
      <Suspense fallback={<div className="Loading">
        <img src="Loader.gif"/>
        <div className="Loading-Text">Loading...</div>
      </div>}>
        <Toast />
        <Navbar/>

        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/editProfile" element={<Editprofile />} />

        </Routes>
      </Suspense>
    </div>
  );
};

function wait(time) {
  return new Promise( resolve => {
      setTimeout(resolve, time)
  })
}
export default App;
