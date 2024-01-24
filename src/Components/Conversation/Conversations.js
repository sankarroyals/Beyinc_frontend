import React, { useEffect, useRef } from 'react'
import './conversations.css'
import Messages from './Messages/Messages'
import HistoryChats from './Users/HistoryChats'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../Services/ApiServices'
import { setAllUsers, setLiveMessage, setOnlineUsers, setReceiverId } from '../../redux/Conversationreducer/ConversationReducer'
import SearchBox from './Users/SearchBox'
import { io } from 'socket.io-client'
import { useParams } from 'react-router'
const Conversations = () => {
  const { email } = useSelector(
    (store) => store.auth.loginDetails
  );

  const { conversationId } = useParams()
  const dispatch = useDispatch()
  // // intialize socket io
  // const socket = useRef()
  // const { email } = useSelector(
  //   (store) => store.auth.loginDetails
  // );

  // useEffect(() => {
  //   socket.current = io(socket_io)
  // }, [])

  // // adding online users to socket io
  // useEffect(() => {
  //   socket.current.emit("addUser", email);
  //   socket.current.on("getUsers", users => {
  //     console.log('online', users);
  //     dispatch(setOnlineUsers(users))
  //   })
  // }, [email])

  // // live message updates
  // useEffect(() => {
  //   socket.current.on('getMessage', data => {
  //     console.log(data);
  //     dispatch(setLiveMessage({
  //       message: data.message,
  //       senderId: data.senderId,
  //       fileSent: data.fileSent
  //     }))
  //     // setMessages(prev => [...prev, data])
  //   })
  // }, [])

  useEffect(() => {
    ApiServices.getAllUsers({ type: '' }).then((res) => {
      dispatch(setAllUsers(res.data))
    })
  }, [])


  // get friend based on params
  useEffect(() => {
    if (conversationId !== undefined) {
      ApiServices.getFriendByConvID({ conversationId: conversationId, email: email }).then((res) => {
        dispatch(setReceiverId(res.data))
      }).catch(err => {
        window.location.href = '/conversations'
      })
    }
  }, [conversationId])



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