
import React from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const SingleUserDetails = ({ d }) => {
    const { email } = useSelector(state => state.auth.loginDetails)

    const navigate = useNavigate()
    return (
        <div className='singleUserWrapper'>
            <div className='singleUser' onClick={() => { navigate(`${d._id}`) }}>
                <div className='headingIntrested'>
                    <b>{d.userName}</b>
                    {d.verification == 'approved' &&
                    <img src='/verify.png'></img>
                     }
                </div>
                <div className='desc'>{d.role}</div>

                <div className='desc'>{d.bio}</div>
                

                {d?.country !== '' && <div className='tags'>
                    Country:
                    {d.country}
                </div>}
                {d?.state !== '' && <div className='tags'>
                    State:
                    {d.state}
                </div>}
                {d?.town !== '' && <div className='tags'>
                    Town:
                    {d.town}
                </div>}

            </div>
        </div>

    )
}

export default SingleUserDetails