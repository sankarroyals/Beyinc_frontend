import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'
import { format } from 'timeago.js'

const MessageRequest = ({ m, setMessageRequest }) => {
    const { email } = useSelector(state => state.auth.loginDetails)
    const [pitchDetails, setPitchdetails] = useState(null)
    const dispatch = useDispatch()
    const update = async (status) => {
        await ApiServices.updateUserMessageRequest({ conversationId: m._id, status: status }).then((res) => {
            dispatch(
                setToast({
                    message: `Message request ${status}`,
                    bgColor: ToastColors.success,
                    visibile: "yes",
                })
            );
            setMessageRequest(prev => [...prev.filter((f) => f._id !== m._id)])
        }).catch(err => {
            setToast({
                message: 'Error occured when updating request',
                bgColor: ToastColors.failure,
                visibile: "yes",
            })
        })
        setTimeout(() => {
            dispatch(
                setToast({
                    message: "",
                    bgColor: "",
                    visibile: "no",
                })
            );
        }, 4000);
    }

    useEffect(() => {
        ApiServices.fetchSinglePitch({ pitchId: m.pitchId }).then(res => {
            setPitchdetails(res.data)
        })
    }, [m])

    return (
        <div className='individualrequest'>
            <div className='individualrequestWrapper'>
                <div>{m.members?.filter((f) => f !== email)[0]} sent you a message request</div>
                <div className='updateActions'>
                    <div>{format(m.createdAt)}</div>
                    <div onClick={() => update('approved')} className='approveRequest'><i class="fas fa-check"></i></div>
                    <div onClick={() => update('rejected')} className='rejectRequest'><i class="fas fa-trash"></i></div>
                    <div className='extraDetails'
                        onClick={() => {
                            document.getElementsByClassName('pitchdetails')[0].classList.toggle('show')
                        }}
                    ><i class="fas fa-chevron-down"></i></div>
                </div>

            </div>
            <div className='pitchdetails'>
                {pitchDetails &&
                    <div className='individualPitchDetails'>
                        
                        <div>
                            <div><label>Pitch Title</label></div>
                            <div>{pitchDetails.title}</div>
                        </div>
                        <div>
                            <div><label>Pitch Tags</label></div>
                            <div>{pitchDetails.tags.join(',')}</div>
                        </div>
                        {pitchDetails?.pitch?.secure_url !== undefined &&
                            <div>
                                <div><label>Pitch Docs</label></div>
                                <div><a href={pitchDetails?.pitch?.secure_url} target='_blank' rel="noreferrer">view doc</a>
                                </div>
                            </div>
                        }
                    </div>

                }
            </div>
        </div>
    )
}

export default MessageRequest