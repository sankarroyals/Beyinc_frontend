import React, { useEffect, useState } from "react";
import "./Notification.css";
import { ApiServices } from "../../../Services/ApiServices";
import { useSelector } from "react-redux";
import MessageRequest from "./MessageRequest";
import CachedIcon from "@mui/icons-material/Cached";

const Notifications = () => {
  const { email } = useSelector((state) => state.auth.loginDetails);
  const [messageRequest, setMessageRequest] = useState([]);
  const [notificationTrigger, setNotificationtrigger] = useState(false);
  const [isSpinning, setSpinning] = useState(false);

  const handleReloadClick = () => {
    setSpinning(true);

    // Stop the spinning after 2 seconds
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    ApiServices.getUserRequest({ email: email }).then((res) => {
      setMessageRequest(res.data);
    });
  }, [email, notificationTrigger]);
  return (
    <div className="messageRequests">
         <div className="reloadNotification" title="Reload for latest notification updates">
      <img
        src="/refresh.png"
        alt="Reload"
        className={isSpinning ? 'spin' : ''}
        style={{ cursor: "pointer", marginTop: '5px' }}
        onClick={handleReloadClick}
      />
    </div>
      {messageRequest.length > 0 ? (
        messageRequest.map((m) => (
          <MessageRequest m={m} setMessageRequest={setMessageRequest} />
        ))
      ) : (
        <div className="noSelected" style={{ height: "70vh" }}>
        <img className="no-request" src="/No_Conversation.png" alt="No Conversation" />
         <p style={{marginTop: '-60px'}}> Oops...! No new message requests found</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
