import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './Messages.css'
import IndividualMessage from './IndividualMessage'
import { useParams } from 'react-router'
const Messages = () => {
  // const conversationId = useSelector(state => state.conv.conversationId)
  const { conversationId } = useParams()

  return (
    <div className='messages'>
      {(conversationId === '' || conversationId === undefined) ? (
        <div className="noSelected">
          <img className="No_Conversation" src="/no-request.png" alt="No Conversation" />
          <div style={{ marginTop: '-50px' }}>
            No Conversations Selected !
            <p style={{ fontSize: '16px' }}>Start a conversation</p>
          </div>
        </div>
      ) : (
        <div>
          <IndividualMessage />
        </div>
      )}
    </div>
  );
};

export default Messages;
