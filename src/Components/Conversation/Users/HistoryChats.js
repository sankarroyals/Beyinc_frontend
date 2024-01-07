import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import IndividualHistory from './IndividualHistory'

const HistoryChats = () => {
    const dispatch = useDispatch()
    const { email } = useSelector(state => state.auth.loginDetails)
    const onlineUsers = useSelector(state => state.conv.onlineUsers)
    const [onlineEmails, setOnlineEmails] = useState([])
    useEffect(() => {
        if (onlineUsers.length > 0) {
            const emails = []
            onlineUsers.map((ol) => {
                if (!emails.includes(ol.userId)) {
                    emails.push(ol.userId)
                }
            })
            setOnlineEmails(emails)
        }
    }, [onlineUsers])
    const historicalConversations = useSelector(state => state.conv.historicalConversations)
    useEffect(() => {
        dispatch(getAllHistoricalConversations(email))
    }, [])
    return (
        <div className='historyChats'>
            <div>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                    <IndividualHistory a={a} onlineEmails={onlineEmails} />
                ))}
            </div>
        </div>
    )
}

export default HistoryChats