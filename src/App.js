import React, { Suspense, useEffect, useRef }from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import AuthHoc, { AdminDeciderHoc, LoginAuth } from "./AuthHoc";
import Toast from "./Components/Toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { apicallloginDetails } from "./redux/AuthReducers/AuthReducer";
import { ApiServices } from "./Services/ApiServices";
import UserRequests from "./Components/Admin/UserRequests/UserRequests";
import { SingleRequestProfile } from "./Components/Admin/UserRequests/SingleProfile";
import { Socket, io } from "socket.io-client";
import { setLiveMessage, setNotification, setOnlineUsers } from "./redux/Conversationreducer/ConversationReducer";
import LivePitches from "./Components/LivePitches/LivePitches";
import IndividualPitch from "./Components/LivePitches/IndividualPitch";


const SignUp = React.lazy(() => import("./Components/Signup/SignUp"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const ForgotPassword = React.lazy(() => wait(1000).then(() => import("./Components/ForgotPassword/ForgotPassword")));
const Navbar = React.lazy(() => import("./Components/Navbar/Navbar"));
const Home = React.lazy(() => wait(1000).then(() => import("./Components/Home/Home")));
const Editprofile = React.lazy(() => wait(1000).then(() => import("./Components/Editprofile/Editprofile")));
const Conversations = React.lazy(() => wait(1000).then(()=> import("./Components/Conversation/Conversations")));
const  Notifications= React.lazy(() => wait(1000).then(()=> import("./Components/Conversation/Notification/Notifications")));
const AllPitches = React.lazy(() => wait(1000).then(() => import("./Components/Admin/pitchDecider/AllPitches")));

const LoggedInPitches = React.lazy(() => wait(1000).then(() => import('./Components/LoggedInPitches/LoggedInPitches')))

const ENV = process.env;

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(apicallloginDetails());
  }, [])



  // intialize socket io
  const socket = useRef()
  const { email } = useSelector(
    (store) => store.auth.loginDetails
  );

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO)
  }, [])

  // adding online users to socket io
  useEffect(() => {
    socket.current.emit("addUser", email);
    socket.current.on("getUsers", users => {
      console.log('online', users);
      dispatch(setOnlineUsers(users))
    })
  }, [email])

  // live message updates
  useEffect(() => {
    socket.current.on('getMessage', data => {
      console.log(data);
      dispatch(setLiveMessage({
        message: data.message,
        senderId: data.senderId,
        fileSent: data.fileSent
      }))
      // setMessages(prev => [...prev, data])
    })
  }, [])



  useEffect(() => {
    socket.current.on('getNotification', data => {
      console.log(data);
      dispatch(setNotification(true))
      // setMessages(prev => [...prev, data])
    })
  }, [])

  return (
    <div >
      <Suspense fallback={<div className="Loading">
        <img src="/Loader.gif"/>
        {/* <div className="Loading-Text">Loading...</div> */}
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
          <Route path="/userPitches" Component={AuthHoc(LoggedInPitches)} />
          <Route path="/livePitches" Component={AuthHoc(LivePitches)} />
          <Route path="/livePitches/:pitchId" Component={AuthHoc(IndividualPitch)} />



          
          <Route path="/pitches" Component={AdminDeciderHoc(AllPitches)} />
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
