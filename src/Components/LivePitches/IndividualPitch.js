import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import { format } from 'timeago.js'
import ReviewStars from './ReviewStars'

const IndividualPitch = () => {
    const [pitch, setpitch] = useState('')
    const [averagereview, setAverageReview] = useState(0)
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
      <div className='individualPitchContainer'>
          <div className='bgPitch'>
              <img src="https://www.f-cdn.com/assets/main/en/assets/project-view/logged-out/header.jpg?image-optimizer=force&format=webply&width=1920" alt="" />
          </div>
          <div className='indiPitchDetailsContainer'>
              <div className='indiPitchDetails'>
                  <div className='indiPitchHeading'>{pitch?.heading}</div>
                  <div>
                      <div className='indiPitchDate'>Posted about {format(pitch?.createdAt)}</div>
                  </div>
                  <div className='indiPitchDesc'>{pitch?.description}</div>
                  <div className='indiPitchId'>Pitch ID: {pitch?._id}</div>
                  <div className='indiPitchId'>
                      <ReviewStars avg={averagereview} />
                  </div>
              </div>
          </div>
    </div>
  )
}

export default IndividualPitch