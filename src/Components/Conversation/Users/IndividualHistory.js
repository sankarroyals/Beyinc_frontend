import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../../Services/ApiServices'
import { setConversationId, setReceiverId } from '../../../redux/Conversationreducer/ConversationReducer'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const IndividualHistory = ({ a, onlineEmails, status }) => {
    const [friend, setFriend] = useState({})
    const { email } = useSelector(state => state.auth.loginDetails)
    const dispatch = useDispatch()
    useEffect(() => {
        const friendMail = a.members.filter((f) => f !== email)[0]
        ApiServices.getProfile({ email: friendMail }).then((res) => {
            setFriend(res.data)
        })
    }, [a])

    const storingDetails = () => {
        if (status !== 'pending') {
            dispatch(setConversationId(a._id))
            ApiServices.getProfile({ email: a.members.filter((f) => f !== email)[0] }).then((res) => {
                dispatch(setReceiverId(res.data))
            })
            
        }
    }
  return (
      <div className='individuals' onClick={storingDetails} style={{ display: (a.requestedTo === email && status == 'pending') && 'none'}}>
          <div><img src={friend.image?.url === undefined ? 'Profile.jpeg' : friend.image.url} alt="" srcset="" /></div>
          <div className='onlineHolder'>
              <div className='userName'>{friend.userName}</div>
              {status === 'pending' ? <abbr title='pending'>
                  <div className='pendingStatusIcon'>
                      <AccessTimeIcon style={{fontSize: '14px'}} />
                  </div>
              </abbr>
                  : 
                  <abbr title={onlineEmails.includes(friend.email) ? 'online' : 'away'}>
                      <div className={onlineEmails.includes(friend.email) ? 'online' : 'away'}>
                          {/* {onlineEmails.includes(friend.email) ? 'online' : 'away'} */}
                      </div>
                  </abbr>
              }
              <div className='role'>{friend.role}</div>
          </div>
      </div>
  )
}

export default IndividualHistory