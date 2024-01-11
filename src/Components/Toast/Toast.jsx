import React from 'react'
import './Toast.css'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from "@mui/icons-material/Close";
import { setToast } from '../../redux/AuthReducers/AuthReducer';
const Toast = () => {
  const { message, visibile, bgColor } = useSelector(state => state.auth.ToastDetails)
  const dispatch = useDispatch()
  return (
   <div style={{justifyContent: 'center', display: visibile==='yes'?'flex':'none'}}>
     <div className='toastStyles' style={{backgroundColor: bgColor, color: 'white'}}>
        <div>{ message }</div>
        <CloseIcon style={{cursor: 'pointer'}} onClick={() => {
          dispatch(
            setToast({
              message: ``,
              bgColor: '',
              visibile: "no",
            })
          );
        }} />
      </div>
      
   </div>
  )
}

export default Toast