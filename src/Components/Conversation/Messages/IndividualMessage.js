import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiServices } from "../../../Services/ApiServices";
import SendIcon from "@mui/icons-material/Send";
import { setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { format } from "timeago.js";
import { io } from "socket.io-client";
import {
  setConversationId,
  setOnlineUsers,
} from "../../../redux/Conversationreducer/ConversationReducer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams, useNavigate } from "react-router";
import "./IndividualMessage.css";
import sendSound from "../Notification/send.mp3";
import { socket_io } from "../../../Utils";
import { Howl } from "howler";
import moment from "moment";

const IndividualMessage = () => {
  const [loadingFile, setLoadingFile] = useState("");
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

  const [isSending, setIsSending] = useState(false);
  const sound = new Howl({
    src: ["/send.mp3"],
  });

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
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
      })
        .then((res) => {
          setMessages(res.data);
          setNormalFileName("");
          setFile("");
          setSendMessage("");
          setLoadingFile("");
        })
        .catch((err) => {
          navigate("/conversations");
        });
    }
  }, [conversationId, messageTrigger]);

  // useEffect(() => {
  //   sendSoundRef.current = new Audio(sendSound);
  // }, []);

  useEffect(() => {
    if (liveMessage?.fileSent == true) {
      ApiServices.getMessages({
        conversationId: conversationId,
      })
        .then((res) => {
          setMessages(res.data);
          setNormalFileName("");
          setFile("");
          setSendMessage("");
          // sendSoundRef?.current?.play()
          sound.play();
        })
        .catch((err) => {
          navigate("/conversations");
        });
    }
  }, [liveMessage?.fileSent]);

  useEffect(() => {
    console.log(liveMessage);
    if (Object.keys(liveMessage).length > 0) {
      // sendSoundRef?.current?.play();
      sound.play();

      setMessages((prev) => [
        ...prev,
        { ...liveMessage, createdAt: Date.now() },
      ]);
    }
  }, [liveMessage]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setNormalFileName(file);
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
    if (file != "") {
      setLoadingFile(file);
      console.log(file);
    }
    setFile("");
    setIsSending(true);
    setIsSending(false);
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
              visible: "yes",
            })
          );
        });
    }
  };

  // useEffect(() => {
  //   return () => {
  //     sendSoundRef.current.pause();
  //     sendSoundRef.current.currentTime = 0;
  //   };
  // }, []);

  useEffect(() => {
    console.log(messages);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messageContainer">
      <div className="messageNavbar">
        <div
          onClick={() => {
            dispatch(setConversationId(""));

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
              receiverId?.user?.image?.url !== undefined &&
              receiverId?.user?.image?.url !== ""
                ? receiverId.user?.image?.url
                : "/profile.jpeg"
            }
            alt=""
            srcset=""
          />
        </div>
        <div>
          <div className="User-name">{receiverId?.user?.userName}</div>
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
                      : receiverId?.user?.image?.url !== undefined &&
                        receiverId?.user?.image?.url !== "" &&
                        m.senderId !== email
                      ? receiverId.user?.image?.url
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
                    <div className="time">
                      {moment(m.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </div>
                  ) : (
                    <div className="friendDetails">
                      <div className="userName">{receiverId?.user?.userName}</div>
                      <div className="time">
                        {moment(m.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                      </div>
                    </div>
                  )}
                </div>
                {m.message !== "" && <div className="text">{m.message}</div>}
                {m.file !== "" && m.file !== undefined && (
                  <a href={m.file.secure_url} target="_blank" rel="noreferrer">
                    {m.file.secure_url?.includes(".png") ||
                    m.file.secure_url?.includes(".jpg") ||
                    m.file.secure_url?.includes(".webp") ||
                    m.file.secure_url?.includes(".gif") ||
                    m.file.secure_url?.includes(".svg") ||
                    m.file.secure_url?.includes(".jpeg") ? (
                      <img
                        src={m.file.secure_url}
                        alt=""
                        srcset=""
                        style={{
                          borderRadius: "none",
                          height: "150px",
                          width: "150px",
                        }}
                      />
                    ) : (
                      "File"
                    )}
                  </a>
                )}
              </div>
            </div>
          ))}
        {loadingFile != "" && (
          <div className={`details owner`} ref={scrollRef}>
            <div className="personalDetails">
              <div className="email">
                {/* <div className="time">
                  {moment(new Date()).format("MMMM Do YYYY, h:mm:ss a")}
                </div> */}
              </div>
              {loadingFile !== "" && loadingFile !== undefined && (
                <div style={{position: 'relative'}}>
                  {loadingFile?.includes("data:image/png") ||
                  loadingFile?.includes("data:image/jpg") ||
                  loadingFile?.includes("data:image/webp") ||
                  loadingFile?.includes("data:image/gif") ||
                  loadingFile?.includes("data:image/svg") ||
                  loadingFile?.includes("data:image/jpeg") ? (
                    <>
                   
                      <img src={loadingFile} alt="" srcset="" style={{ borderRadius: 'none', height: '150px', width: '150px' }} />
                      <div className="loading_viewer" ><img
                        src="/loading-button.gif"
                        alt="Loading..."
                      /></div>
                      
                    </>
                  ) : (
                    "Sending File"
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="bottom-line"></div>

      <div className="sendBoxContainer">
        <div className="sendBox">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ marginLeft: "10px" }}>
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
            {file !== "" &&
              (file.split(";")[0]?.includes("data:image") ? (
                <div
                  style={{ position: "relative" }}
                  className="senMessageView"
                >
                  <img
                    src={file}
                    style={{
                      height: "250px",
                      width: "250px",
                      objectFit: "cover",
                    }}
                    className="sendingFiles"
                  ></img>
                  <div
                    style={{ position: "absolute", top: "10px", right: "0px" }}
                  >
                    <i
                      className="fas fa-times cross"
                      onClick={() => setFile("")}
                    ></i>
                  </div>
                </div>
              ) : (
                <div
                  style={{ position: "relative" }}
                  className="senMessageView"
                >
                  <iframe
                    src={file}
                    width="250px"
                    height="250px"
                    frameborder="0"
                    className="sendingFiles"
                  ></iframe>{" "}
                  <div
                    style={{ position: "absolute", top: "20px", right: "20px" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "0px",
                      }}
                    >
                      <i
                        className="fas fa-times cross"
                        onClick={() => {
                          setFile("") 
                        }

                        }
                      ></i>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div style={{ position: "absolute", right: "50px" }}>
            <label htmlFor="chatFile" className="uploadingFileIcon">
              <CloudUploadIcon />
            </label>
            <input
              type="file"
              id="chatFile"
              onChange={handleFile}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }}
            />
          </div>
          <div>
            <label className="uploadingFileIcon">
              <i class="fas fa-link"></i>
            </label>
          </div>
        </div>
        <div>
          {sendMessage !== "" || file !== "" ? (
            <SendIcon
              className=""
              onClick={sendText}
              style={{ color: "#0b57d0", cursor: "pointer", fontSize: "24px" }}
            />
          ) : (
            <SendIcon
              className=""
              // onClick={sendText}

              style={{ color: "gray", fontSize: "24px", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualMessage;
