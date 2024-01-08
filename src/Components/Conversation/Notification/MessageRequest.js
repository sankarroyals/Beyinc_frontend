import React from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'

const MessageRequest = ({ m, setMessageRequest }) => {
    const { email } = useSelector(state => state.auth.loginDetails)
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
            setMessageRequest(prev=>[...prev.filter((f)=>f._id !== m._id)])
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
  return (
      <div className='individualrequest'>
          <div>{m.members?.filter((f) => f !== email)[0]} sent you a message request</div>
          <div className='updateActions'>
              <div onClick={() => update('approved')} className='approveRequest'><i class="fas fa-check"></i></div>
              <div onClick={() => update('rejected')} className='rejectRequest'><i class="fas fa-trash"></i></div>
          </div>

      </div>
  )
}

export default MessageRequest