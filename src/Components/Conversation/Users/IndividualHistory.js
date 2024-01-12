import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../../Services/ApiServices'
import { getAllHistoricalConversations, setConversationId, setReceiverId } from '../../../redux/Conversationreducer/ConversationReducer'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate, useParams } from 'react-router';
import { Box, Dialog, DialogContent } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

import { gridCSS } from '../../CommonStyles';
import { io } from 'socket.io-client';
const IndividualHistory = ({ a, onlineEmails, status }) => {
    const { conversationId } = useParams()
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false);
    };
    const [friend, setFriend] = useState({})
    const { email } = useSelector(state => state.auth.loginDetails)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const friendMail = a.members.filter((f) => f !== email)[0]
        ApiServices.getProfile({ email: friendMail }).then((res) => {
            setFriend(res.data)
        })
    }, [a])

    const storingDetails = async () => {
        if (status !== 'pending') {
            dispatch(setConversationId(a._id))
            await ApiServices.getProfile({ email: a.members.filter((f) => f !== email)[0] }).then((res) => {
                dispatch(setReceiverId(res.data))
            })
            navigate(`/conversations/${a._id}`)

        }
    }

    const socket = useRef()
    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET_IO)
    }, [])
    const deletePendingRequest = async () => {
        await ApiServices.deleteConversation({ conversationId: a._id }).then((res) => {
            dispatch(getAllHistoricalConversations(email))

        })
        socket.current.emit("sendNotification", {
            senderId: email,
            receiverId: friend.email,
        });
    }

    return (
        <div className={`individuals ${conversationId == a._id && 'selected'}`} onClick={storingDetails} style={{ display: (a.requestedTo === email && status == 'pending') && 'none' }}>
            <div><img src={friend.image?.url === undefined ? '/profile.jpeg' : friend.image.url} alt="" srcset="" /></div>
            <div className='onlineHolder'>
                <abbr title={friend.email} style={{ textDecoration: 'none' }}><div className='userName'>{friend.userName}</div></abbr>
                {status === 'pending' ? <><abbr title='pending'>
                    <div className='pendingStatusIcon'>
                        <AccessTimeIcon style={{ fontSize: '14px' }} />
                    </div>
                </abbr></>
                    :
                    <abbr title={onlineEmails.includes(friend.email) ? 'online' : 'away'}>
                        <div className={onlineEmails.includes(friend.email) ? 'online' : 'away'}>
                            {/* {onlineEmails.includes(friend.email) ? 'online' : 'away'} */}
                        </div>
                    </abbr>
                }
                <div className='deleteConv'>
                    <div className='role'>{friend.role}</div>
                    {status == 'pending' && <div className=''>
                        <i className='fas fa-trash' onClick={() => setOpen(true)}></i>
                    </div>}
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >
                <DialogContent
                    style={{
                        // height: "90vh",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "5px",
                            right: "10px",
                            cursor: "pointer",
                        }}
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </Box>
                    <Box style={{ padding: '10px', marginBottom: '10px' }}>
                        Are you sure to delete the <b>{friend.userName}</b> conversation?
                    </Box>
                    <button onClick={deletePendingRequest} style={{ width: 'auto' }}>
                        Yes
                    </button>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndividualHistory