import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../../Services/ApiServices";
import SendIcon from "@mui/icons-material/Send";
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { format } from "timeago.js";
import { io } from "socket.io-client";
import { setOnlineUsers } from "../../../redux/Conversationreducer/ConversationReducer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams, useNavigate } from "react-router";
import "./IndividualMessage.css";
const IndividualMessage = () => {
  // const conversationId = useSelector(state => state.conv.conversationId)
  const { conversationId } = useParams();
  const receiverId = useSelector((state) => state.conv.receiverId);
  const liveMessage = useSelector((state) => state.conv.liveMessage);

  const { email, image, userName } = useSelector(
    (state) => state.auth.loginDetails
  );
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [file, setFile] = useState("");
  const [messageTrigger, setMessageTrigger] = useState("");
  const [normalFileName, setNormalFileName] = useState("");
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = useRef();
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO);
  }, []);

  const onlineUsers = useSelector((state) => state.conv.onlineUsers);
  const [onlineEmails, setOnlineEmails] = useState([]);
  useEffect(() => {
    if (onlineUsers.length > 0) {
      const emails = [];
      onlineUsers.map((ol) => {
        if (!emails.includes(ol.userId)) {
          emails.push(ol.userId);
        }
      });
      setOnlineEmails(emails);
    }
  }, [onlineUsers]);

  useEffect(() => {
    if (conversationId !== "") {
      ApiServices.getMessages({
        conversationId: conversationId,
      }).then((res) => {
        setMessages(res.data);
        setNormalFileName("");
        setFile("");
        setSendMessage("");
      });
    }
  }, [conversationId, messageTrigger]);

  useEffect(() => {
    if (liveMessage?.fileSent == true) {
      ApiServices.getMessages({
        conversationId: conversationId,
      }).then((res) => {
        setMessages(res.data);
        setNormalFileName("");
        setFile("");
        setSendMessage("");
      });
    }
  }, [liveMessage?.fileSent]);

  useEffect(() => {
    console.log(liveMessage);
    if (liveMessage) {
      setMessages((prev) => [
        ...prev,
        { ...liveMessage, createdAt: Date.now() },
      ]);
    }
  }, [liveMessage]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setNormalFileName(file.name);
    setFileBase(e, file);
  };
  const setFileBase = (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(reader.result);
    };
  };

  const sendText = async (e) => {
    console.log({
      senderId: email,
      receiverId: receiverId?.email,
    });
    if (sendMessage !== "" || file !== "") {
      await ApiServices.sendMessages({
        email: email,
        conversationId: conversationId,
        senderId: email,
        receiverId: receiverId?.email,
        message: sendMessage,
        file: file,
      })
        .then((res) => {
          setMessages((prev) => [
            ...prev,
            {
              conversationId: conversationId,
              senderId: email,
              receiverId: receiverId.email,
              message: sendMessage,
            },
          ]);
          setSendMessage("");
          socket.current.emit("sendMessage", {
            senderId: email,
            receiverId: receiverId.email,
            message: sendMessage,
            fileSent: file !== "",
          });
          if (file !== "") {
            setMessageTrigger(!messageTrigger);
          }
          document.getElementById("chatFile").value = "";
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: err.response.data.message,
              bgColor: ToastColors.failure,
              visibile: "yes",
            })
          );
        });
    }
  };

  useEffect(() => {
    console.log(messages);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messageContainer">
      <div className="messageNavbar">
        <div
          onClick={() => {
            navigate(-1);
          }}
        >
          <i
            className="fas fa-arrow-left"
            title="back"
            style={{ marginLeft: "20px", color: "grey" }}
          ></i>
        </div>
        <div>
          <img
            className="Dp"
            src={
              receiverId?.image?.url !== undefined &&
              receiverId?.image?.url !== ""
                ? receiverId.image.url
                : "/profile.jpeg"
            }
            alt=""
            srcset=""
          />
        </div>
        <div>
          <div className="User-name">{receiverId?.userName}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
            }}
          >
            <div
              title={
                onlineEmails.includes(receiverId.email) ? "online" : "away"
              }
              style={{ position: "relative", marginLeft: "10px" }}
              className={
                onlineEmails.includes(receiverId.email) ? "online" : "away"
              }
            ></div>
            <div style={{ marginLeft: "-16px", fontSize: "12px" }}>
              {onlineEmails.includes(receiverId.email) ? "online" : "away"}
            </div>
          </div>
        </div>
      </div>
      <div className="messageBox">
        {messages.length > 0 &&
          messages.map((m) => (
            <div
              className={`details ${m.senderId === email ? "owner" : "friend"}`}
              ref={scrollRef}
            >
              <div
                className="imageContainer"
                style={{ display: m.senderId === email ? "none" : "flex" }}
              >
                <img
                  src={
                    image !== undefined && image !== "" && m.senderId === email
                      ? image
                      : receiverId?.image?.url !== undefined &&
                        receiverId?.image?.url !== "" &&
                        m.senderId !== email
                      ? receiverId.image.url
                      : "/profile.jpeg"
                  }
                  alt=""
                  srcset=""
                />
                {/* <div className="messageBottom">{format(m.createdAt)}</div> */}
              </div>
              <div className="personalDetails">
                <div className="email">
                  {m.senderId === email ? (
                    <div className="time">{format(m.createdAt)}</div>
                  ) : (
                    <div className="friendDetails">
                      <div className="userName">{receiverId?.userName}</div>
                      <div className="time">{format(m.createdAt)}</div>
                    </div>
                  )}
                </div>
                {m.message !== "" && <div className="text">{m.message}</div>}
                {m.file !== "" && m.file !== undefined && (
                  <a href={m.file.secure_url} target="_blank" rel="noreferrer">
                    sent an attachment
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="bottom-line"></div>

      <div className="sendBoxContainer">
        <div className="sendBox">
          <div>
            <input
              type="text"
              name="message"
              id="message"
              value={sendMessage}
              onChange={(e) => setSendMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendText();
                }
              }}
              placeholder="Type a message"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="chatFile" className="uploadingFileIcon">
              <CloudUploadIcon />
              <span className="fileName">{normalFileName}</span>
            </label>
            <input
              type="file"
              id="chatFile"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div>
          {sendMessage !== "" || file !== "" ? (
            <SendIcon
              className="sendIcon"
              onClick={sendText}
              style={{ color: "#0b57d0", cursor: "pointer", fontSize: "24px" }}
            />
          ) : (
            <SendIcon
              className="sendIcon"
              onClick={sendText}
              style={{ color: "gray", fontSize: "24px", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualMessage;
