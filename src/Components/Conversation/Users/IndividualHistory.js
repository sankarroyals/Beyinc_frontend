import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../../Services/ApiServices'
import { setConversationId, setReceiverId } from '../../../redux/Conversationreducer/ConversationReducer'

const IndividualHistory = ({ a }) => {
    const [friend, setFriend] = useState({})
    const { email } = useSelector(state => state.auth.loginDetails)
    const dispatch = useDispatch()
    useEffect(() => {
        const friendMail = a.members.filter((f) => f !== email)[0]
        ApiServices.getProfile({ email: friendMail }).then((res) => {
            setFriend(res.data)
        })
    }, [a])
  return (
      <div className='individuals' onClick={() => {
          dispatch(setConversationId(a._id))
          dispatch(setReceiverId(a.members.filter((f) => f !== email)[0]))
      }}>
          <div><img src={friend.image?.url === undefined ? 'Profile.jpeg' : friend.image.url} alt="" srcset="" /></div>
          <div>
              <div className='userName'>{friend.userName}</div>
              <div className='role'>{friend.role}</div>
          </div>
      </div>
  )
}

export default IndividualHistory