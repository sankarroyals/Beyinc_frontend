import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'
import ReviewStars from './ReviewStars'
import PitchDetailsReadOnly from '../Common/PitchDetailsReadOnly'
import IndividualPitchComment from './IndividualPitchComment'

const IndividualPitch = () => {
    const [pitch, setpitch] = useState('')
    const [averagereview, setAverageReview] = useState(0)
    const [value, setValue] = useState(0)
    const [open, setOpen] = useState(false)
    const { pitchId } = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        if (pitchId) {
            ApiServices.fetchSinglePitch({ pitchId: pitchId }).then(res => {
                console.log(res.data);
                setpitch(res.data)
                if (res.data.review!==undefined && res.data.review?.length > 0) {
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
                        visibile: "yes",
                    })
                );
            })
        }
    }, [pitchId])
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
                          <div className='indiPitchDate'>Posted about {format(pitch?.createdAt)} by {pitch.email}</div>
                      </div>
                      <div className='indiPitchDesc'>
                          <textarea style={{ width: '100%', border: 'none', fontFamily: "'Google Sans Text', sans- serif" }} disabled rows={13} value={pitch?.description}></textarea>
                      </div>
                      <div className='indiPitchId'>Pitch ID: {pitch?._id}</div>
                      <PitchDetailsReadOnly open={open} setOpen={setOpen} value={value} setValue={setValue} pitchDetails={pitch} />

                  </div>
              </div>
          </div>
          {pitch?.comments?.length > 0 && <div className='commentsContainer'>
              {pitch.comments?.map(c => (
                  <IndividualPitchComment c={c} />
              ))}
          </div>}
      </div>
  )
}

export default IndividualPitch