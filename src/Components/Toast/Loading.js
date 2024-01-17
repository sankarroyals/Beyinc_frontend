import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LoadingData = () => {
    const { visible } = useSelector(state => state.auth.LoadingDetails);
    const dispatch = useDispatch()
    return (
        <>
            <div className="loadingSubmit" style={{ display: visible == 'yes' ? 'flex' : 'none' }}>
                <img src="/Loader.gif" alt="" />
            </div>
        </>
    )
}

export default LoadingData