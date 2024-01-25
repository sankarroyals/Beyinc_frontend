import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'
import SendIcon from "@mui/icons-material/Send";

import '../LivePitches/LivePitches.css'
import ReviewStars from '../LivePitches/ReviewStars'
import AddReviewStars from '../LivePitches/AddReviewStars'
import { jwtDecode } from 'jwt-decode'
import IndividualPitchComment from '../LivePitches/IndividualPitchComment'
import { convertToDate } from '../../Utils'

const IndividualUser = () => {
    const { image, userName } = useSelector(state => state.auth.loginDetails)

    const [user, setuser] = useState('')
    const [averagereview, setAverageReview] = useState(0)
    const [emailTrigger, setemailTrigger] = useState(false)
    const { email } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [comment, setComment] = useState('')

    useEffect(() => {
        if (email) {
            ApiServices.getProfile({ email: email }).then(res => {
                setuser({ ...res.data, comments: [...res.data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))] })

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

    const sendText = async () => {
        await ApiServices.addUserComment({ userEmail: email, comment: { email: jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken).email, comment: comment } }).then(res => {
            // setPitchTrigger(!pitchTrigger)
            setuser(prev => ({ ...prev, comments: [{ email: jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken).email, profile_pic: image, userName: userName, comment: comment, createdAt: new Date() }, ...user.comments] }))
            setComment('')
        }).catch(err => {
            navigate('/searchusers')
        })
    }

    const deleteComment = async (id) => {
        await ApiServices.removeUserComment({ email: email, commentId: id }).then(res => {
            setuser(prev => ({ ...prev, comments: user.comments = user.comments.filter(f => f._id !== id) }))
        }).catch(err => {
            dispatch(setToast({
                visible: 'yes',
                message: 'Error Occured',
                bgColor: 'red'
            }))
        })
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
                            <div>
                                <label className="indiPitchHiringPositions">Skills</label>
                            </div>
                            <div>
                                {user.skills?.length > 0 && (
                                    <div className="listedTeam">
                                        {user.skills?.map((t, i) => (
                                            <div className="singleMember indiPitchHiringPositions">
                                                <div>{t}</div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div>
                            <div>
                                <label className="indiPitchHiringPositions">Languages Known</label>
                            </div>
                            <div>
                                {user.languagesKnown?.length > 0 && (
                                    <div className="listedTeam">
                                        {user.languagesKnown?.map((t, i) => (
                                            <div className="singleMember indiPitchHiringPositions">
                                                <div>{t}</div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {user.educationDetails?.length > 0 && <div className="" style={{ flexDirection: 'column' }}>
                            <form className="update-form">
                                <h3 className="indiPitchHiringPositions">Educational Details</h3>

                            </form>

                            {user.educationDetails?.length > 0 &&
                                user.educationDetails?.map((te, i) => (
                                    <div style={{ marginLeft: '20px' }}>

                                        <div style={{ display: 'flex', flexWrap: 'wrap',  gap: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="company indiPitchHiringPositions">
                                                    {te.college}
                                                </div>
                                                <div className="profession indiPitchHiringPositions">
                                                    {te.grade}
                                                </div>
                                                <div className="timeline indiPitchHiringPositions">
                                                    {convertToDate(te.Edstart)}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>}

                        {user.experienceDetails?.length > 0 && <div className="" style={{ flexDirection: 'column' }}>
                            <form className="update-form">
                                <h3 className="indiPitchHiringPositions">Experience Details</h3>

                            </form>

                            {user.experienceDetails?.length > 0 &&
                                user.experienceDetails?.map((te, i) => (
                                    <div style={{ marginLeft: '20px' }}>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div className="company indiPitchHiringPositions">
                                                    {te.company}
                                                </div>
                                                <div className="profession indiPitchHiringPositions">
                                                    {te.profession}
                                                </div>
                                                <div className="timeline indiPitchHiringPositions">
                                                    {convertToDate(te.start)}-{te.end == '' ? 'Present' : convertToDate(te.end)}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>}
                        {email !== user?.email && <div>
                            <AddReviewStars filledStars={filledStars} setFilledStars={setFilledStars} sendReview={sendReview} />
                        </div>}
                        <div></div>

                    </div>
                </div>
                <div className='commentsContainer'>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div>
                            <textarea row={4} cols={50} value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Enter Comment' />
                        </div>
                        <div>
                            {comment !== "" ? (
                                <SendIcon
                                    className="sendIcon"
                                    onClick={sendText}
                                    style={{ color: "#0b57d0", cursor: "pointer", fontSize: "24px" }}
                                />
                            ) : (
                                <SendIcon
                                    className="sendIcon"
                                    style={{ color: "gray", fontSize: "24px", marginTop: "10px" }}
                                />
                            )}
                        </div>
                    </div>
                    {user?.comments?.length > 0 && <div>Reviews:</div>}
                    {user?.comments?.length > 0 && user.comments?.map(c => (
                        <IndividualPitchComment c={c} deleteComment={deleteComment} />
                    ))}
                </div>
            </div>


        </div>
    )
}

export default IndividualUser