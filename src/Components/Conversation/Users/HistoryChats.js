import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import IndividualHistory from './IndividualHistory'

const HistoryChats = () => {
    const dispatch = useDispatch()
    const { email } = useSelector(state => state.auth.loginDetails)
    const historicalConversations = useSelector(state => state.conv.historicalConversations)
    useEffect(() => {
        dispatch(getAllHistoricalConversations(email))
    }, [])
    return (
        <div className='historyChats'>
            <div>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                   <IndividualHistory a={a} />
                ))}
            </div>
        </div>
    )
}

export default HistoryChats