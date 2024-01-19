import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LoadingData = () => {
    const { visible } = useSelector(state => state.auth.LoadingDetails);
    const dispatch = useDispatch()
    useEffect(() => {
        if (visible == 'yes') {
            document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
        }
        else{
            document.getElementsByTagName('body')[0].style.overflowY = 'scroll'
        }
    }, [visible])
    return (
        <div className='loadingContainer' style={{ display: visible == 'yes' ? 'block' : 'none' }}
>
            
            <div className="loader"
            >
                
            </div>
        </div>
    )
}

export default LoadingData