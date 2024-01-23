import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'

import '../LivePitches/LivePitches.css'
import ReviewStars from '../LivePitches/ReviewStars'
import AddReviewStars from '../LivePitches/AddReviewStars'
import { jwtDecode } from 'jwt-decode'

const IndividualUser = () => {
    const [user, setuser] = useState('')
    const [averagereview, setAverageReview] = useState(0)
    const [emailTrigger, setemailTrigger] = useState(false)
    const { email } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (email) {
            ApiServices.getProfile({ email: email }).then(res => {
                setuser({ ...res.data })
                if (res.data.review !== undefined && res.data.review?.length > 0) {
                    let avgR = 0
                    res.data.review?.map((rev) => {
                        avgR += rev.review
                    })
                    setAverageReview(avgR / res.data.review.length)
                }
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
    }, [email, emailTrigger])


    const [filledStars, setFilledStars] = useState(0)

    useEffect(() => {
        ApiServices.getUsersStarsFrom({ userEmail: email, email: jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken).email }).then(res => {
            setFilledStars(res.data.review !== undefined ? res.data.review : 0)
        })
    }, [email])


    const sendReview = async () => {
        await ApiServices.addUserReview({ userId: user._id, review: { email: email, review: filledStars } }).then(res => {
            dispatch(setToast({
                message: 'Review Updated',
                visible: 'yes',
                bgColor: ToastColors.success
            }))
            setemailTrigger(!emailTrigger)
        }).catch(err => {
            dispatch(setToast({
                message: 'Error Occured',
                visible: 'yes',
                bgColor: ToastColors.failure
            }))
        })
        setTimeout(() => {
            dispatch(setToast({
                message: '',
                visible: '',
                bgColor: ''
            }))
        }, 4000)
    }



    return (
        <div>
            <div className='individualPitchContainer'>
                <div className='bgPitch'>
                    <img src="https://www.f-cdn.com/assets/main/en/assets/project-view/logged-out/header.jpg?image-optimizer=force&format=webply&width=1920" alt="" />
                </div>
                <div className='indiUserDetailsContainer'>
                    <div className='indiUserDetails'>
                        <div style={{ display: 'flex', gap: '0px' }}>
                            <div>
                                <div>
                                    <img src={user?.image?.url} alt="" srcset="" style={{height: '120px', width: '120px'}} />
                                </div>
                                <div className='indiUserHeading'>{user?.userName}

                                </div>
                           </div>

                            <div className='reviewIntrestContainer'>

                                {user.verification == 'approved' && <img title='verified' src='/verify.png' alt="" style={{ width: "25px", height: "25px", marginLeft: "5px" }} />}
                                <div className=''>
                                    <ReviewStars avg={averagereview} />
                                </div>
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
                        <div>
                            <AddReviewStars filledStars={filledStars} setFilledStars={setFilledStars} sendReview={sendReview} />
                        </div>
                        <div></div>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default IndividualUser