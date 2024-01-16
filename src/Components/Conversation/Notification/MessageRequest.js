import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'
import { format } from 'timeago.js'
import '../Users/searchBox.css'
import PitchDetailsReadOnly from '../../Common/PitchDetailsReadOnly'


const MessageRequest = ({ m, setMessageRequest }) => {
    const { email } = useSelector(state => state.auth.loginDetails)
    const [pitchDetails, setPitchdetails] = useState(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)
    
    const dispatch = useDispatch()
    
    const update = async (e, status) => {
        e.target.disabled = true
        await ApiServices.updateUserMessageRequest({ conversationId: m._id, status: status }).then((res) => {

            dispatch(
                setToast({
                    message: `Message request ${status}`,
                    bgColor: ToastColors.success,
                    visibile: "yes",
                })
            );
            setMessageRequest(prev => [...prev.filter((f) => f._id !== m._id)])
            e.target.disabled = false

        }).catch(err => {
            setToast({
                message: 'Error occured when updating request',
                bgColor: ToastColors.failure,
                visibile: "yes",
            })
            e.target.disabled = false

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
                    <attr title='Preview Pitch Details'>
                        <div className='extraDetails'
                            onClick={() => {
                                setOpen(true)
                            }}
                        ><i class="fas fa-eye"></i></div>
                    </attr>
                </div>
                {open &&
                    <PitchDetailsReadOnly approve='Approve Chat Request' reject='Reject' open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />
                }
            </div>

        </div>
    )
}

export default MessageRequest