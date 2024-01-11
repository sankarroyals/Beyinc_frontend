import React, { Suspense, useEffect }from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import AuthHoc, { AdminDeciderHoc, LoginAuth } from "./AuthHoc";
import Toast from "./Components/Toast/Toast";
import { useDispatch } from "react-redux";
import { apicallloginDetails } from "./redux/AuthReducers/AuthReducer";
import { ApiServices } from "./Services/ApiServices";
import UserRequests from "./Components/Admin/UserRequests/UserRequests";
import { SingleRequestProfile } from "./Components/Admin/UserRequests/SingleProfile";

const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() => wait(1000).then(() => import("./Components/ForgotPassword/ForgotPassword")));
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() => wait(1000).then(() => import("./Components/Home/Home")));
const Editprofile = React.lazy(() => wait(1000).then(() => import("./Components/Editprofile/Editprofile")));
const Conversations = React.lazy(() => wait(1000).then(()=> import("./Components/Conversation/Conversations")));
const  Notifications= React.lazy(() => wait(1000).then(()=> import("./Components/Conversation/Notification/Notifications")));
const  PitchDecider= React.lazy(() => wait(1000).then(()=> import("./Components/Admin/pitchDecider/PitchDecider")));


const ENV = process.env;

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(apicallloginDetails());
  }, [])

  return (
    <div >
      <Suspense fallback={<div className="Loading">
        <img src="Loader.gif"/>
        <div className="Loading-Text">Loading...</div>
      </div>}>
        <Toast />
        <Navbar/>

        <Routes>
          <Route path="/signup" Component={LoginAuth(SignUp)} />
          <Route path="/login" Component={LoginAuth(Login)} />
          <Route path="/forgotpassword" Component={LoginAuth(ForgotPassword)} />
          <Route path="/" Component={AuthHoc(Home)} />
          <Route path="/editProfile" Component={AuthHoc(Editprofile)} />
          <Route path="/conversations" Component={AuthHoc(Conversations)} />
          <Route path="/conversations/:conversationId" Component={AuthHoc(Conversations)} />
          <Route path="/notifications" Component={AuthHoc(Notifications)} />
          <Route path="/pitchs" Component={AdminDeciderHoc(PitchDecider)} />
          <Route path="/profileRequests" Component={AdminDeciderHoc(UserRequests)} />
          <Route path="/singleProfileRequest/:email" Component={AuthHoc(SingleRequestProfile)} />






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
