import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../../Services/ApiServices';
import SendIcon from '@mui/icons-material/Send';
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { format } from "timeago.js";
import { io } from 'socket.io-client';
import { setOnlineUsers } from '../../../redux/Conversationreducer/ConversationReducer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './IndividualMessage.css'

const IndividualMessage = () => {
    const conversationId = useSelector(state => state.conv.conversationId)
    const receiverId = useSelector(state => state.conv.receiverId)
    const liveMessage = useSelector(state => state.conv.liveMessage)

    const { email } = useSelector(state => state.auth.loginDetails)
    const [messages, setMessages] = useState([])
    const [sendMessage, setSendMessage] = useState('')
    const [file, setFile] = useState('');
    const [messageTrigger, setMessageTrigger] = useState('')
    const [normalFileName, setNormalFileName] = useState('')
    const scrollRef = useRef();
    const dispatch = useDispatch()
    

    const socket = useRef()
    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET_IO)
    }, [])



    useEffect(() => {
        if (conversationId !== '' ) {
            ApiServices.getMessages({
                "conversationId": conversationId
            }).then((res) => {
                setMessages(res.data)
                setNormalFileName('')
                setFile('')
                setSendMessage('')
            })
        }
    }, [conversationId, messageTrigger])

    useEffect(() => {
        if (liveMessage?.fileSent == true) {
            ApiServices.getMessages({
                "conversationId": conversationId
            }).then((res) => {
                setMessages(res.data)
                setNormalFileName('')
                setFile('')
                setSendMessage('')
            })
        }
    }, [liveMessage?.fileSent])

    useEffect(() => {
        console.log(liveMessage);
        if (liveMessage) {
            setMessages(prev=>[...prev, {...liveMessage, createdAt: Date.now()}])
        }
    }, [liveMessage])

    const handleFile = (e) => {
        const file = e.target.files[0];
        setNormalFileName(file.name)
        setFileBase(e, file);
    };
    const setFileBase = (e, file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFile(reader.result)
        };
    };

    const sendText = async (e) => {
        if (sendMessage !== '' || file !== '') {
            await ApiServices.sendMessages(
                {   "email": email,
                    "conversationId": conversationId,
                    "senderId": email,
                    "receiverId": receiverId,
                    "message": sendMessage,
                    "file": file
                }
            ).then(res => {
                setMessages(prev => [...prev, {
                    "conversationId": conversationId,
                    "senderId": email,
                    "receiverId": receiverId,
                    "message": sendMessage
                }])
                setSendMessage('')
                socket.current.emit('sendMessage', {
                    senderId: email,
                    receiverId: receiverId,
                    message: sendMessage,
                    fileSent: file !== ''
                })
                if (file !== '') {
                    setMessageTrigger(!messageTrigger)
                }
                document.getElementById('chatFile').value=''
            }).catch((err) => {
                dispatch(
                    setToast({
                        message: err.response.data.message,
                        bgColor: ToastColors.failure,
                        visibile: "yes",
                    })
                );
            })
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
  return (
      <div className='messageContainer'>
          <div className='messageBox' >
              {messages.length > 0 && messages.map((m) => (
                  <div className={`details ${m.senderId === email ? 'owner' : 'friend'}`} ref={scrollRef}>
                      <div className='imageContainer'>
                          <img src={m.image?.url === undefined ? 'Profile.jpeg' : m.image.url} alt="" srcset="" />
                          <div className="messageBottom">{format(m.createdAt)}</div>
                      </div>
                      <div className='personalDetails'>
                          <div className='email'>{m.senderId}</div>
                          {m.message !== '' && <div className='text'>{m.message}</div>}
                          {(m.file!=='' && m.file!==undefined) && <a href={m.file.secure_url} target='_blank' rel="noreferrer">sent an attachment</a> }
                      </div>
                  </div>
              ))}

          </div>
          <div className="sendBox">
              <textarea
                  type="text"
                  name="message"
                  id='message'
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Enter a message"
              />
              <label htmlFor='chatFile' className='uploadingFileIcon'><CloudUploadIcon />
                  <span className='fileName'>{normalFileName}</span></label>
              <input type='file' id='chatFile' onChange={handleFile} style={{display: 'none'}}/>
              <SendIcon className='sendIcon' onClick={sendText} />
          </div>
      </div>
  )
}

export default IndividualMessage;