import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LoadingData = () => {
    const { visible } = useSelector(state => state.auth.LoadingDetails);
    const dispatch = useDispatch()
    return (
        <>
            <div className="loader" style={{ display: visible == 'yes' ? 'flex' : 'none' }}>
                
            </div>
        </>
    )
}

export default LoadingData