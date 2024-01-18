import React from 'react'
import { format } from 'timeago.js'
import { ApiServices } from '../../../Services/ApiServices'

const AllNotifications = ({ n }) => {
  const changeStatus = async() => {
    await ApiServices.changeNotification({ notificationId: n._id }).then(res => {
      
    })
  }
  return (
    <div className={`${n.read ? 'read' : 'unread'} individualrequest`} onClick={()=> {changeStatus()}}>
      <div className='individualrequestWrapper'>
        <div>{n.message} </div>
        <div className=''>
          <div>{format(n.createdAt)}</div>
        </div>
      </div>

    </div>
  )
}

export default AllNotifications