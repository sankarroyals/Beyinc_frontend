import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './Messages.css'
import IndividualMessage from './IndividualMessage'
const Messages = () => {
  const conversationId = useSelector(state => state.conv.conversationId)
  return (
    <div className='messages'>
      {conversationId == '' ? <div className='noSelected'>
        No Conversation Selected
      </div> : 
        <div>
          <IndividualMessage />
        </div>
      }
    </div>
  )
}

export default Messages