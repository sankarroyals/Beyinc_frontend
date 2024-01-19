import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'

import '../LivePitches/LivePitches.css'

const IndividualUser = () => {
    const [user, setuser] = useState('')

    const { email } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (email) {
            ApiServices.getProfile({ email: email }).then(res => {
                setuser({ ...res.data })
               
            }).catch(err => {
                dispatch(
                    setToast({
                        message: "Error Occured",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            })
        }
    }, [email])


 


   

    return (
        <div>
            <div className='individualPitchContainer'>
                <div className='bgPitch'>
                    <img src="https://www.f-cdn.com/assets/main/en/assets/project-view/logged-out/header.jpg?image-optimizer=force&format=webply&width=1920" alt="" />
                </div>
                <div className='indiUserDetailsContainer'>
                    <div className='indiUserDetails'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='indiUserHeading'>{user?.userName}
                               
                            </div>
                            
                            <div className='reviewIntrestContainer'>
                               
                                {user.verification == 'approved' && <img title='verified' src='/verify.png' alt="" style={{ width: "25px", height: "25px", marginLeft: "5px" }} />}

                            </div>
                        </div>
                        <div>
                            <div className='indiPitchDate'>Last profile updated at {format(user?.updatedAt)} by admin</div>

                        </div>
                        <div className='indiPitchDesc'>
                            <textarea style={{ width: '100%', border: 'none', fontFamily: "'Google Sans Text', sans- serif" }} disabled rows={13} value={user?.bio}></textarea>
                        </div>
                        <div className='indiPitchId'>Mail ID: <a href={`mailto:${user.email}`}>{user?.email}</a></div>

                       
                        {user?.country !== '' && <div className='indiPitchHiringPositions'>
                            Country:

                            <div className='hp'>{user?.country}</div>

                        </div>}
                        {user?.state !== '' && <div className='indiPitchHiringPositions'>
                            State:

                            <div className='hp'>{user?.state}</div>

                        </div>}
                        {user?.town !== '' && <div className='indiPitchHiringPositions'>
                            Town:

                            <div className='hp'>{user?.town}</div>

                        </div>}
                        <div></div>
                        
                    </div>
                </div>
            </div>

           
        </div>
    )
}

export default IndividualUser