import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';

const AddReviewStars = ({ pitchId, setPitchTrigger, pitchTrigger }) => {
    const { email } = useSelector(state => state.auth.loginDetails)

    const [filledStars, setFilledStars] = useState(0)

    useEffect(() => {
        ApiServices.getStarsFrom({ pitchId: pitchId, email: email }).then(res => {
            setFilledStars(res.data.review !== undefined ? res.data.review : 0)
        })
    }, [pitchId])


    const dispatch = useDispatch()
    const sendReview = async () => {
        await ApiServices.addPitchReview({ pitchId: pitchId, review: { email: email, review: filledStars } }).then(res => {
            dispatch(setToast({
                message: 'Review Updated',
                visible: 'yes',
                bgColor: ToastColors.success
            }))
            setPitchTrigger(!pitchTrigger)
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
    const renderStars = () => {
        const totalStars = 5;
        const stars = [];

        for (let i = 1; i <= totalStars; i++) {
            let starClass = 'empty';

            if (i <= filledStars) {
                starClass = 'filled';
            } else if (i - 0.5 === filledStars) {
                starClass = 'half-filled';
            }

            stars.push(<span key={i} className={`star ${starClass}`} style={{ cursor: 'pointer' }} onClick={()=> setFilledStars(i)}>&#9733;</span>);
        }

        return stars;
    };

    return (
        <div className="star-rating" title='Send review'>
            {/* <div>Average Review: </div> */}
            <div>
                {renderStars()}
            </div>
            <div>
                <span style={{cursor: 'pointer', fontSize: '15px'}} onClick={sendReview}>Send Review</span>
            </div>
        </div>
    );
};

export default AddReviewStars;
