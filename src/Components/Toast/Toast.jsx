import React from 'react'
import './Toast.css'
import { useSelector } from 'react-redux'
const Toast = () => {
  const {message, visibile, bgColor} = useSelector(state=>state.auth.ToastDetails)
  return (
   <div style={{justifyContent: 'center', display: visibile==='yes'?'flex':'none'}}>
     <div className='toastStyles' style={{backgroundColor: bgColor, color: 'white'}}>
        {message}
    </div>
   </div>
  )
}

export default Toast