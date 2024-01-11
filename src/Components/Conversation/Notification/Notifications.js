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
  useEffect(() => {
    ApiServices.getUserRequest({ email: email }).then((res) => {
      setMessageRequest(res.data);
    });
  }, [email, notificationTrigger]);
  return (
    <div className="messageRequests">
      <div className="reloadNotification">
        <attr title="Reload for latest notification updates">
          <CachedIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              setNotificationtrigger(!notificationTrigger);
            }}
          />
        </attr>
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
