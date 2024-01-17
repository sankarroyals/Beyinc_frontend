import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'
import ReviewStars from './ReviewStars'
import PitchDetailsReadOnly from '../Common/PitchDetailsReadOnly'
import IndividualPitchComment from './IndividualPitchComment'
import SendIcon from "@mui/icons-material/Send";
import AddReviewStars from './AddReviewStars'

const IndividualPitch = () => {
    const [pitch, setpitch] = useState('')
    const { email } = useSelector(state => state.auth.loginDetails)

    const [averagereview, setAverageReview] = useState(0)
    const [value, setValue] = useState(0)
    const [open, setOpen] = useState(false)
    const { pitchId } = useParams()
    const [comment, setComment] = useState('')
    const [pitchTrigger, setPitchTrigger] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        console.log('object');
        if (pitchId) {
            ApiServices.fetchSinglePitch({ pitchId: pitchId }).then(res => {
                console.log(res.data);
                setpitch(res.data)
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
    }, [pitchId, pitchTrigger])


    const sendText = async () => {
        await ApiServices.addPitchComment({ pitchId: pitchId, comment: { email: email, comment: comment } }).then(res => {
            setPitchTrigger(!pitchTrigger)
            setComment('')
        }).catch(err => {
            navigate('/livePitches')
        })
    }
    return (
        <div>
            <div className='individualPitchContainer'>
                <div className='bgPitch'>
                    <img src="https://www.f-cdn.com/assets/main/en/assets/project-view/logged-out/header.jpg?image-optimizer=force&format=webply&width=1920" alt="" />
                </div>
                <div className='indiPitchDetailsContainer'>
                    <div className='indiPitchDetails'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='indiPitchHeading'>{pitch?.heading}
                                <i className='fas fa-eye' title='View Pitch' style={{ fontSize: '16px', marginLeft: '20px' }} onClick={() => {
                                    setOpen(true)
                                }}></i>
                            </div>
                            <div className=''>
                                <ReviewStars avg={averagereview} />
                            </div>
                        </div>
                        <div>
                            <div className='indiPitchDate'>Posted about {format(pitch?.createdAt)} by {pitch.userName}</div>
                            
                        </div>
                        <div className='indiPitchDesc'>
                            <textarea style={{ width: '100%', border: 'none', fontFamily: "'Google Sans Text', sans- serif" }} disabled rows={13} value={pitch?.description}></textarea>
                        </div>
                        <div className='indiPitchId'>Pitch ID: {pitch?._id}</div>
                        <div>
                            <AddReviewStars pitchId={pitchId} setPitchTrigger={setPitchTrigger} pitchTrigger={pitchTrigger} />
                        </div>
                        <PitchDetailsReadOnly open={open} setOpen={setOpen} value={value} setValue={setValue} pitchDetails={pitch} />

                    </div>
                </div>
            </div>

            <div className='commentsContainer'>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
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
                {pitch?.comments?.length > 0 && <div>Comments:</div>}
                {pitch?.comments?.length > 0 && pitch.comments?.map(c => (
                    <IndividualPitchComment c={c} pitch={pitch} setpitch={setpitch} setPitchTrigger={setPitchTrigger} />
                ))}
            </div>
        </div>
    )
}

export default IndividualPitch