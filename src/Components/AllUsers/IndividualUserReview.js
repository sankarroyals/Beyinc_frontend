import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import moment from "moment";

const IndividualUserReview = ({ c, deleteComment, onLike }) => {
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const { pitchId } = useParams();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(c.likes?.includes(user_id));
  const [count, setCount] = useState(c.likes?.length);

  const handleLike = (id) => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
    }
    onLike(id, !c.likes?.includes(user_id));
  };

  return (
    <div className="IndicommentsSection">
      <div className="IndicommentsSectionImage">
        <img
          src={c?.profile_pic || c?.commentBy?.image?.url || "/profile.jpeg"}
          alt=""
        />
      </div>
      <div className="IndicommentsSectionDetails">
        <div className="IndicommentsSectionDetailsUserName">
          <div title={c?.email || c?.commentBy?.email}>
            {c?.userName || c?.commentBy?.userName}
          </div>
          <div title={"Delete Comment"} onClick={() => deleteComment(c._id)}>
            {(c?.email || c?.commentBy?.email) == email && (
              <i className="fas fa-trash"></i>
            )}
          </div>
        </div>
        <div
          title={c?.email || c?.commentBy?.email}
          className="IndicommentsSectionDetailscomment"
        >
          {c?.comment}
        </div>
        <div
          title={c?.email || c?.commentBy?.email}
          className="IndicommentsSectionDetailsdate"
        >
          {moment(c.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </div>
      </div>
      <div className="IndicommentsSectionActions">
        {count > 0 && <span>{count}</span>}
        {liked ? (
          <i
            class="fa fa-thumbs-up icon-blue"
            aria-hidden="true"
            onClick={() => handleLike(c._id)}
          />
        ) : (
          <i
            class="far fa-thumbs-up"
            aria-hidden="true"
            onClick={() => handleLike(c._id)}
          />
        )}
      </div>
    </div>
  );
};

export default IndividualUserReview;
