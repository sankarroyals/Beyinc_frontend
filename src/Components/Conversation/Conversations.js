import React, { useEffect, useRef } from 'react'
import './conversations.css'
import Messages from './Messages/Messages'
import HistoryChats from './Users/HistoryChats'
import { useDispatch } from 'react-redux'
import { ApiServices } from '../../Services/ApiServices'
import { setAllUsers } from '../../redux/Conversationreducer/ConversationReducer'
import SearchBox from './Users/SearchBox'
const Conversations = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    ApiServices.getAllUsers({ type: '' }).then((res) => {
      dispatch(setAllUsers(res.data))
    })
  }, [])
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