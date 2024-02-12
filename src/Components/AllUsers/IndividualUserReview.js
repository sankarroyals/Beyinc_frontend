import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { format } from 'timeago.js'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import moment from 'moment';

const IndividualUserReview = ({ c, deleteComment }) => {
    const { email } = useSelector(state => state.auth.loginDetails)
    const { pitchId } = useParams()
    const dispatch = useDispatch()

    return (
        <div className='IndicommentsSection'>
            <div className='IndicommentsSectionImage'>
                <img src={c?.profile_pic || c?.commentBy?.image?.url || '/profile.jpeg'} alt="" />
            </div>
            <div className='IndicommentsSectionDetails'>
                <div className='IndicommentsSectionDetailsUserName'>
                    <div title={(c?.email || c?.commentBy?.email)}>{(c?.userName || c?.commentBy?.userName)}</div>
                    {/* <div title={'Delete Comment'} onClick={() => deleteComment(c._id)}>{(c?.email || c?.commentBy?.email) == email && <i className='fas fa-trash'></i>}</div> */}
                </div>
                <div title={(c?.email || c?.commentBy?.email)} className='IndicommentsSectionDetailscomment'>
                    {c?.comment}
                </div>
                <div title={(c?.email || c?.commentBy?.email)} className='IndicommentsSectionDetailsdate'>
                    {moment(c.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                </div>

            </div>


        </div>
    )
}

export default IndividualUserReview