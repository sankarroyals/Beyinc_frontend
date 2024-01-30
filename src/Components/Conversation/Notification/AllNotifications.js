import React from 'react'
import { format } from 'timeago.js'
import { ApiServices } from '../../../Services/ApiServices'
import { useNavigate } from 'react-router'

const AllNotifications = ({ n }) => {
  const navigate = useNavigate()
  const changeStatus = async() => {
    await ApiServices.changeNotification({ notificationId: n._id }).then(res => {
      
    })
  }
  return (
    <div className={`individualrequest`} onClick={() => {
      navigate(`/user/${n.senderEmail}`)
      changeStatus()
    }} style={{marginLeft: '-10px'}}>
      <div className='individualrequestWrapper' style={{gap: '5px', alignItems: 'center'}}>
        <div>
          <img style={{ height: '50px', width: '50px', borderRadius: '50%' }} src={n.senderProfile == undefined ? '/profile.jpeg' : n.senderProfile} alt="" srcset="" />
        </div>
        <div>{n.message} </div>
        <div className=''>
          {/* <div>{format(n.createdAt)}</div> */}
        </div>
      </div>

    </div>
  )
}

export default AllNotifications