import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import IndividualHistory from './IndividualHistory'

const HistoryChats = () => {
    const dispatch = useDispatch()
    const { email, role } = useSelector(state => state.auth.loginDetails)
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


    const handleMenuVisibile = (e) => {
        if (e.target.classList[1] == 'fa-chevron-right') {
            e.target.classList.remove('fa-chevron-right')
            e.target.classList.add('fa-chevron-down')
            document.getElementsByClassName(e.target.id)[0].style.display = 'block'
            
        } else {
            e.target.classList.remove('fa-chevron-down')
            e.target.classList.add('fa-chevron-right')
            document.getElementsByClassName(e.target.id)[0].style.display = 'none'

        }
    }
    useEffect(() => {
        document.getElementById('approved').classList.remove('fa-chevron-right')
        document.getElementById('approved').classList.add('fa-chevron-down')
        document.getElementsByClassName('approved')[0].style.display = 'block'
    }, [])

    return (
        <div className='historyChats'>
            <div className='statusHeader'>
                <i class={`fas fa-chevron-right`} id='pending' onClick={handleMenuVisibile}></i>Pending
            </div>
            <div className='pending'>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                    a.status === 'pending' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='pending' />
                ))}
            </div>

            {/* approved */}
            <div className='statusHeader'>
                <i class={`fas fa-chevron-right`} id='approved' onClick={handleMenuVisibile}></i>Approved
            </div>
            <div className='approved'>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                    a.status === 'approved' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='approved' />
                ))}
            </div>
        </div>
    )
}

export default HistoryChats