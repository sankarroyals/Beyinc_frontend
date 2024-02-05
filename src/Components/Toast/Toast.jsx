import React, { useEffect } from 'react'
import './Toast.css'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from "@mui/icons-material/Close";
import { setToast } from '../../redux/AuthReducers/AuthReducer';
const Toast = () => {
  const { message, visible, bgColor } = useSelector(state => state.auth.ToastDetails)
  const dispatch = useDispatch()
  useEffect(() => {
    if (visible == 'yes') {
      setTimeout(() => {
        dispatch(
          setToast({
            message: ``,
            bgColor: '',
            visible: "no",
          })
        );
      }, 4000)
    }
  }, [visible])
  return (
    <div style={{ justifyContent: 'center', display: visible === 'yes' ? 'flex' : 'none' }}>
      <div className='toastStyles' style={{ backgroundColor: bgColor, color: 'white',zIndex: '1401' }}>
        <div>{message}</div>
        <CloseIcon style={{ cursor: 'pointer' }} onClick={() => {
          dispatch(
            setToast({
              message: ``,
              bgColor: '',
              visible: "no",
            })
          );
        }} />
      </div>

    </div>
  )
}

export default Toast