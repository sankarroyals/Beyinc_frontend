import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import AddPitch from "../Common/AddPitch";
import { setReceiverId } from "../../redux/Conversationreducer/ConversationReducer";

const SingleUserDetails = ({ d, connectStatus }) => {
  console.log(d);
  const { email } = useSelector((state) => state.auth.loginDetails);
  const dispatch = useDispatch();
  const [receiverRole, setreceiverRole] = useState("");
  const [pitchSendTo, setPitchSendTo] = useState("");
  const [averagereview, setAverageReview] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setAverageReview(0);
    if (d.review !== undefined && d.review.length > 0) {
      let avgR = 0;
      d.review?.map((rev) => {
        avgR += rev.review;
      });
      setAverageReview(avgR / d.review.length);
    }
  }, [d]);

  const openUser = () => navigate(`/user/${d.email}`);

  const isCurrentUser = email === d.email;
  const openChat = async (e) => {
    // await ApiServices.getProfile({ email: a.members.filter((f) => f.email !== email)[0].email }).then((res) => {
    dispatch(setReceiverId(d));
    // })
    navigate(`/conversations/${connectStatus[d.email]?.id}`);
  };
  return (
    <>
      <div
        className={
          "user-card-main-container " +
          (d.role === "Entrepreneur"
            ? "margin-entrepreneur"
            : d.role === "Mentor"
            ? "margin-mentor"
            : "")
        }
      >
        <div className="user-card-details">
          <div className="user-card-img-rating-container">
            <div className="user-card-image" onClick={openUser}>
              <img
                alt="user-pic"
                src={
                  d.image !== undefined && d.image.url !== ""
                    ? d.image.url
                    : "/profile.jpeg"
                }
                title={d.email}
              />
            </div>
            <div className="user-card-rating">
              <div className="rating-content">
                <i className="far fa-comment"></i>
                <span style={{ marginLeft: "3px" }}>{d.comments?.length}</span>
              </div>
              <div className="rating-content">
                <i className="far fa-star"></i>
                <span style={{ marginLeft: "3px" }}>{averagereview}</span>
              </div>
            </div>
          </div>
          <div className="user-card-details-text">
            <span className="user-name" onClick={openUser}>
              {d.userName}
            </span>
            <span>
              {d.educationDetails[0]?.grade} @ {d.educationDetails[0]?.college}
            </span>
            <span className="skills">{d.skills?.join(", ")}</span>
          </div>
        </div>
        <div className="user-card-actions">
          <div
            style={{
              fontWeight: "400",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span>{d.role}</span>
            <span>
              {d.verification === "approved" && (
                <img
                  src="/verify.png"
                  alt=""
                  style={{ width: "15px", height: "15px", marginLeft: "5px" }}
                />
              )}
            </span>
          </div>

          {!isCurrentUser &&
            (connectStatus[d.email]?.status === "pending" ? (
              <button className="pending-colour">Pending</button>
            ) : connectStatus[d.email]?.status === "approved" ? (
              <button className="approved-colour" onClick={openChat}>
                Chat
              </button>
            ) : (
              <button
                onClick={() => {
                  setPitchSendTo(d.email);
                  setreceiverRole(d.role);
                }}
              >
                Connect
              </button>
            ))}
        </div>
        <AddPitch
          receiverMail={pitchSendTo}
          setReceivermail={setPitchSendTo}
          receiverRole={receiverRole}
        />
      </div>
    </>
  );
};

export default SingleUserDetails;
