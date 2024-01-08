import React, { useEffect, useState } from 'react'
import './Notification.css'
import { ApiServices } from '../../../Services/ApiServices'
import { useSelector } from 'react-redux'
import MessageRequest from './MessageRequest'
const Notifications = () => {
    const { email } = useSelector(state => state.auth.loginDetails)
    const [messageRequest, setMessageRequest] = useState([])
    useEffect(() => {
        ApiServices.getUserRequest({ email: email }).then(res => {
            setMessageRequest(res.data)
        })

    }, [email])
    return (
        <div className='messageRequests'>
            {messageRequest.length > 0 ? messageRequest.map((m) => (
                <MessageRequest m={m} setMessageRequest={setMessageRequest} />
            )) : <>No New Message Request</>}
        </div>
    )
}

export default Notifications