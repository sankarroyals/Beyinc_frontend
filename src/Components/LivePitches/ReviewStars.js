import React from 'react';

const ReviewStars = ({ avg }) => {
    const filledStars = Math.round(avg * 2) / 2; // Round to the nearest half star

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

            stars.push(<span key={i} className={`star ${starClass}`}>&#9733;</span>);
        }

        return stars;
    };

    return (
        <div className="star-rating" title='Average review'>
            {/* <div>Average Review: </div> */}
            <div>
                {renderStars()}
            </div>
            <div>
                <span className="average-rating">{avg.toFixed(1)}</span>
            </div>
        </div>
    );
};

export default ReviewStars;
