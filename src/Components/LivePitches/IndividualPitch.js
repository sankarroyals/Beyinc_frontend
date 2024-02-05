import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { format } from "timeago.js";
import ReviewStars from "./ReviewStars";
import PitchDetailsReadOnly from "../Common/PitchDetailsReadOnly";
import IndividualPitchComment from "./IndividualPitchComment";
import SendIcon from "@mui/icons-material/Send";
import AddReviewStars from "./AddReviewStars";
import { io } from "socket.io-client";
import { socket_io } from "../../Utils";
import moment from "moment";

const IndividualPitch = () => {
  const [pitch, setpitch] = useState("");
  const { email, image, userName } = useSelector(
    (state) => state.auth.loginDetails
  );
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [averagereview, setAverageReview] = useState(0);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const { pitchId } = useParams();
  const [comment, setComment] = useState("");
  const [pitchTrigger, setPitchTrigger] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    ApiServices.getStarsFrom({ pitchId: pitchId, email: email }).then((res) => {
      setFilledStars(res.data.review !== undefined ? res.data.review : 0);
    });
  }, [pitchId]);

  const sendReview = async () => {
    await ApiServices.addPitchReview({
      pitchId: pitchId,
      review: { email: email, review: filledStars },
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Review Updated",
            visible: "yes",
            bgColor: ToastColors.success,
          })
        );
        setPitchTrigger(!pitchTrigger);
        socket.current.emit("sendNotification", {
          senderId: email,
          receiverId: pitch?.email,
        });
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            visible: "yes",
            bgColor: ToastColors.failure,
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          visible: "",
          bgColor: "",
        })
      );
    }, 4000);
  };

  useEffect(() => {
    console.log("object");
    if (pitchId) {
      ApiServices.fetchSinglePitch({ pitchId: pitchId })
        .then((res) => {
          console.log(res.data);
          setpitch({
            ...res.data,
            comments: [
              ...res.data.comments.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              ),
            ],
          });
          if (res.data.review !== undefined && res.data.review?.length > 0) {
            let avgR = 0;
            res.data.review?.map((rev) => {
              avgR += rev.review;
            });
            setAverageReview(avgR / res.data.review.length);
          }
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error Occured",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [pitchId, pitchTrigger]);

  const sendText = async () => {
    await ApiServices.addPitchComment({
      pitchId: pitchId,
      comment: { email: email, comment: comment },
    })
      .then((res) => {
        // setPitchTrigger(!pitchTrigger)
        setpitch((prev) => ({
          ...prev,
          comments: [
            {
              email: email,
              profile_pic: image,
              userName: userName,
              comment: comment,
              createdAt: new Date(),
            },
            ...pitch.comments,
          ],
        }));
        setComment("");
      })
      .catch((err) => {
        navigate("/livePitches");
      });
  };

  const deleteComment = async (id) => {
    await ApiServices.removePitchComment({ pitchId: pitchId, commentId: id })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          comments: (pitch.comments = pitch.comments.filter(
            (f) => f._id !== id
          )),
        }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            visible: "yes",
            message: "Error Occured",
            bgColor: "red",
          })
        );
      });
  };

  const addToIntrest = async () => {
    await ApiServices.addIntrest({ pitchId: pitchId, email: email })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          intrest: [
            ...pitch.intrest,
            { email: email, profile_pic: image, userName: userName },
          ],
        }));
        dispatch(
          setToast({
            message: "Added to Interest",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        socket.current.emit("sendNotification", {
          senderId: email,
          receiverId: pitch?.email,
        });
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          bgColor: "",
          visible: "no",
        })
      );
    }, 4000);
  };

  const removeFromIntrest = async () => {
    await ApiServices.removeIntrest({ pitchId: pitchId, email: email })
      .then((res) => {
        setpitch((prev) => ({
          ...prev,
          intrest: [...pitch.intrest.filter((p) => p.email !== email)],
        }));
        dispatch(
          setToast({
            message: "Removed from Interest",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error Occured",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          bgColor: "",
          visible: "no",
        })
      );
    }, 4000);
  };

  return (
    <div className="profile-Container">
      <div className="individualPitchContainer">
        <div className="Top-Notch">
          <i
            className="fas fa-users"
            onClick={() => {
              navigate(-1);
            }}
          ></i>
          <span>{pitch.userName}'s Pitch</span>
        </div>
        <div className="indiPitchDetailsContainer">
          <div className="indiPitchDetails">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="indiPitchHeading">
                {pitch?.heading}
                <i
                  className="fas fa-eye"
                  title="View Pitch"
                  style={{ fontSize: "16px", marginLeft: "20px" }}
                  onClick={() => {
                    setOpen(true);
                  }}
                ></i>
                <div className="reviewIntrestContainer">
                  <div className="">
                    <ReviewStars avg={averagereview} />
                  </div>
                  {email !== pitch?.email && (
                    <div
                      className={`intrestButton ${pitch?.intrest?.length > 0 &&
                          pitch?.intrest.filter((p) => p.email === email).length >
                          0
                          ? "removeIntrest"
                          : "addIntrest"
                        }`}
                    >
                      {pitch?.intrest?.length > 0 &&
                        pitch?.intrest.filter((p) => p.email === email).length >
                        0 ? (
                        <span onClick={removeFromIntrest}>
                          Remove From interest
                        </span>
                      ) : (
                        <span onClick={addToIntrest}>Add To interest</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="indiPitchDate">
                Posted about {moment(pitch?.createdAt).format('MMM Do YY')} by{" "}
                <b>{pitch?.userInfo?.userName}</b>
              </div>
            </div>
            <div className="indiPitchDesc">
              <textarea
                style={{
                  width: "100%",
                  border: "none",
                  fontFamily: "'Google Sans Text', sans- serif",
                }}
                disabled
                rows={13}
                value={pitch?.description}
              ></textarea>
            </div>
            <div className="indiPitchId">
              <b>Pitch ID:</b> {pitch?._id}
            </div>

            {pitch?.hiringPositions?.length > 0 && (
              <div className="indiPitchHiringPositions">
                <b> People Needed:</b>
                {pitch?.hiringPositions?.map((h) => (
                  <div className="hp">{h}</div>
                ))}
              </div>
            )}
            {pitch?.industry1 !== "" && (
              <div className="indiPitchHiringPositions">
                <b> Domain:</b>

                <div className="hp">{pitch?.industry1}</div>
              </div>
            )}
            {pitch?.industry2 !== "" && (
              <div className="indiPitchHiringPositions">
                <b> Tech:</b>

                <div className="hp">{pitch?.industry2}</div>
              </div>
            )}
            <div></div>

            <PitchDetailsReadOnly
              open={open}
              setOpen={setOpen}
              value={value}
              setValue={setValue}
              pitchDetails={pitch}
            />
          </div>
        </div>
        <div className="commentsContainer">
          <h2>Ratings & Discussion</h2>
          <div>
            <div style={{ display: "flex", gap: "10px" }}>
              <img src={image} />
              <div>
                <span>
                  <b>{userName}</b>
                </span>
                <div style={{ fontSize: "12px", marginBottom: "20px" }}>
                  Discussions are public and include your account details
                </div>
              </div>
            </div>

            <div className="Rating-Content" style={{ marginLeft: "60px" }}>
              <h4>Rate this user</h4>
              <h6>Tell others what you think</h6>
              <div
                className="stars"
                style={{ display: "flex", marginBottom: "10px" }}
              >
                <AddReviewStars
                  filledStars={filledStars}
                  setFilledStars={setFilledStars}
                />{" "}
                <button
                  className="sendIcon"
                  style={{
                    cursor: "pointer",
                    fontSize: "13px",
                    width: "auto",
                    padding: "3px 4px",
                  }}
                  onClick={sendReview}
                >
                  Post
                </button>
              </div>
              <div>
                {!isWritingReview && (
                  <div
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => setIsWritingReview(true)}
                  >
                    <b>Write a Review</b>
                  </div>
                )}
                {isWritingReview && (
                  <div
                    className="writing-review"
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <textarea
                        className="textarea"
                        rows={4}
                        cols={50}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Describe Your Experience"
                      />
                    </div>
                    <div>
                      <button
                        onClick={sendText}
                        className="sendIcon"
                        style={{
                          cursor: comment == "" ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          padding: "10px",
                        }}
                      >
                        Post Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {pitch?.comments?.length > 0 && (
            <div>
              <b>Discussions:</b>
            </div>
          )}
          {pitch?.comments?.length > 0 &&
            pitch.comments?.map((c) => (
              <IndividualPitchComment c={c} deleteComment={deleteComment} />
            ))}
        </div>
      </div>

      
    </div>
  );
};

export default IndividualPitch;
