import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../../Services/ApiServices';
import SendIcon from '@mui/icons-material/Send';
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { format } from "timeago.js";
const IndividualMessage = () => {
    const conversationId = useSelector(state => state.conv.conversationId)
    const { email } = useSelector(state => state.auth.loginDetails)
    const [messages, setMessages] = useState([])
    const [sendMessage, setSendMessage] = useState('')
    const [file, setFile] = useState('');
    const scrollRef = useRef();
    const dispatch = useDispatch()
    useEffect(() => {
        if (conversationId !== '') {
            ApiServices.getMessages({
                "conversationId": conversationId
            }).then((res) => {
                setMessages(res.data)
            })
        }
    }, [conversationId])

    const handleFile = (e) => {
        const file = e.target.files[0];
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
        e.preventDefault();
        if (sendMessage !== '') {
            await ApiServices.sendMessages(
                {   "email": email,
                    "conversationId": conversationId,
                    "senderId": email,
                    "receiverId": messages[0].receiverId,
                    "message": sendMessage,
                    "file": file
                }
            ).then(res => {
                setMessages(prev => [...prev, {
                    "conversationId": conversationId,
                    "senderId": email,
                    "receiverId": messages[0].receiverId,
                    "message": sendMessage
                }])
                setSendMessage('')
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
                          <div className='text'>{m.message}</div>
                          {(m.file!=='' && m.file!==undefined) && <a href={m.file.secure_url}>click</a> }
                      </div>
                  </div>
              ))}

          </div>
          <div className="sendBox" onSubmit={sendText}>
              <input
                  type="text"
                  name="message"
                  id='message'
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Enter a message"
              />
              <input type='file' onChange={handleFile}/>
              <SendIcon className='sendIcon' onClick={sendText} />
          </div>
      </div>
  )
}

export default IndividualMessage