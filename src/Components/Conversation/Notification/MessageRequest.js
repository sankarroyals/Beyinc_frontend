import React from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useSelector } from 'react-redux'

const MessageRequest = ({ m }) => {
    const {email} = useSelector(state=>state.auth.loginDetails)
    const update = async (status) => {
        await ApiServices.updateUserMessageRequest({ conversationId: m._id, status: status }).then((res) => {
            
        })
    }
  return (
      <div className='individualrequest'>
          <div>{m.members?.filter((f) => f !== email)[0]} sent you a message request</div>
          <div className='updateActions'>
              <div onClick={() => update('approved')}><i class="fas fa-check"></i></div>
              <div onClick={() => update('rejected')}>delete</div>
          </div>

      </div>
  )
}

export default MessageRequest