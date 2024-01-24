import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { format } from 'timeago.js'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { setToast } from '../../redux/AuthReducers/AuthReducer'

const IndividualPitchComment = ({ c, deleteComment }) => {
  const { email } = useSelector(state => state.auth.loginDetails)
  const { pitchId } = useParams()
  const dispatch = useDispatch()
 
  return (
    <div className='IndicommentsSection'>
      <div className='IndicommentsSectionImage'>
        <img src={c?.profile_pic || '/profile.jpeg'} alt="" />
      </div>
      <div className='IndicommentsSectionDetails'>
        <div className='IndicommentsSectionDetailsUserName'>
          <div title={c?.email}>{c?.userName}</div>
          <div title={'Delete Comment'} onClick={()=>deleteComment(c._id)}>{c?.email == email && <i className='fas fa-trash'></i>}</div>
        </div>
        <div title={c?.email} className='IndicommentsSectionDetailscomment'>
          {c?.comment}
        </div>
        <div title={c?.email} className='IndicommentsSectionDetailsdate'>
          {format(c?.createdAt)}
        </div>
        
      </div>
        

    </div>
  )
}

export default IndividualPitchComment