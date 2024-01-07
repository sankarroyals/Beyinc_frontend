import React, { useEffect, useRef } from 'react'
import './conversations.css'
import Messages from './Messages/Messages'
import HistoryChats from './Users/HistoryChats'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../Services/ApiServices'
import { setAllUsers, setOnlineUsers } from '../../redux/Conversationreducer/ConversationReducer'
import SearchBox from './Users/SearchBox'
import {io} from 'socket.io-client'
const Conversations = () => {
  const dispatch = useDispatch()
  // intialize socket io
  const socket = useRef(io(process.env.REACT_APP_SOCKET_IO))
  const { email } = useSelector(
    (store) => store.auth.loginDetails
  );
  useEffect(() => {
    ApiServices.getAllUsers({ type: '' }).then((res) => {
      dispatch(setAllUsers(res.data))
    })
  }, [])

  // adding online users to socket io
  useEffect(() => {
    socket.current.emit("addUser", email);
    socket.current.on("getUsers", users => {
      dispatch(setOnlineUsers(users))
    })
  }, [email])
  return (
    <div className='conversationContainer'>
      <div className='users'>
        <SearchBox />
        <HistoryChats />
      </div>
      <div className='chatContainer'>
        <Messages />
      </div>
    </div>
  )
}

export default Conversations