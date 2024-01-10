import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./Messages.css";
import IndividualMessage from "./IndividualMessage";

const Messages = () => {
  const conversationId = useSelector((state) => state.conv.conversationId);

  return (
    <div className="messages">
      {conversationId === "" ? (
        <div className="noSelected">
          <img className="No_Conversation" src="No_Conversation.png" alt="No Conversation" />
          <div style={{marginTop: '-50px'}}>
            No Conversations...yet!
            <p style={{fontSize: '16px'}}>Start a new conversation</p>
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
