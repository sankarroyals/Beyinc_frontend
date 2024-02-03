import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import "../LivePitches/LivePitches.css";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import { jwtDecode } from "jwt-decode";
import IndividualPitchComment from "../LivePitches/IndividualPitchComment";
import { convertToDate, formatedDate } from "../../Utils";
import IndividualUserReview from "./IndividualUserReview";

const IndividualUser = () => {
  const { image, userName } = useSelector((state) => state.auth.loginDetails);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const { visible } = useSelector((state) => state.auth.LoadingDetails);
  const [user, setuser] = useState("");
  const [averagereview, setAverageReview] = useState(0);
  const [emailTrigger, setemailTrigger] = useState(false);
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (email) {
      dispatch(setLoading({ visible: "yes" }));
      ApiServices.getProfile({ email: email })
        .then((res) => {
          setuser({
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
          dispatch(setLoading({ visible: "no" }));
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error Occured",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          navigate("/searchusers");
        });
    }
  }, [email, emailTrigger]);

  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    ApiServices.getUsersStarsFrom({
      userEmail: email,
      email: jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken)
        .email,
    }).then((res) => {
      setFilledStars(res.data.review !== undefined ? res.data.review : 0);
    });
  }, [email]);

  const sendReview = async () => {
    await ApiServices.addUserReview({
      userId: user._id,
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
        setemailTrigger(!emailTrigger);
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

  const sendText = async () => {
    await ApiServices.addUserComment({
      userEmail: email,
      comment: {
        email: jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken)
          .email,
        comment: comment,
      },
    })
      .then((res) => {
        // setPitchTrigger(!pitchTrigger)
        setuser((prev) => ({
          ...prev,
          comments: [
            {
              email: jwtDecode(
                JSON.parse(localStorage.getItem("user")).accessToken
              ).email,
              profile_pic: image,
              userName: userName,
              comment: comment,
              createdAt: new Date(),
            },
            ...user.comments,
          ],
        }));
        setComment("");
      })
      .catch((err) => {
        // navigate("/searchusers");
        dispatch(setToast({
          visible: 'yes',
          message: 'Error Occured while adding comment',
          bgColor: ToastColors.failure
        }))
      });
  };

  const deleteComment = async (id) => {
    await ApiServices.removeUserComment({ email: email, commentId: id })
      .then((res) => {
        setuser((prev) => ({
          ...prev,
          comments: (user.comments = user.comments.filter((f) => f._id !== id)),
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

  return visible == "yes" ? (
    ""
  ) : (
    <div className="profile-Container">
      <div className="individualUserContainer">
        <div className="Top-Notch">
          <i
            className="fas fa-users"
            onClick={() => {
              navigate(-1);
            }}
          ></i>
          <span>{user?.userName}'s Profile</span>
        </div>

        <div className="indiUserDetailsContainer">
          <div className="indiUserDetails">
            <div className="User-Top-Details">
              <img
                className="profile"
                src={
                  user?.image?.url !== undefined
                    ? user?.image?.url
                    : "/profile.jpeg"
                }
                alt=""
                srcset=""
              />
              <div className="indiUserHeading">
                <div style={{ marginTop: '50px' }}>
                  {user?.userName}{" "}
                  {user.verification == "approved" && (
                    <img
                      title="verified"
                      src="/verify.png"
                      alt=""
                      style={{
                        width: "20px",
                        height: "20px",
                        marginLeft: "5px",
                      }}
                    />
                  )}
                  <div className="location-info">
                    {user?.country !== "" && <div>{user?.country},</div>}
                    {user?.state !== "" && <div>{user?.state},</div>}
                    {user?.town !== "" && <div>{user?.town}</div>}
                  </div>
                  <div className="indiPitchId">
                    <a href={`mailto:${user.email}`}>{user?.email}</a>
                  </div>
                  <div className="reviewInterestContainer">
                    <ReviewStars avg={averagereview} />
                  </div>
                  <div className="indiPitchDate">
                    Profile Created on <b>{formatedDate(user?.createdAt)}</b>
                  </div>
                </div>
              </div>

            </div>
            <div className="indiPitchDesc">
              <h2>About Me</h2>
              <textarea
                className="about"
                style={{
                  border: "none",
                  fontFamily: "'Google Sans Text', sans- serif",
                }}
                disabled
                rows={13}
                value={user?.bio}
              ></textarea>
            </div>
            <div>
              <div>
                <label className="indiPitchHiringPositions">Skills</label>
              </div>
              <div className="texts">
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
                <label className="indiPitchHiringPositions">
                  Languages Known
                </label>
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

            {user.educationDetails?.length > 0 && (
              <div className="" style={{ flexDirection: "column" }}>
                <form className="update-form">
                  <h3 className="indiPitchHiringPositions">
                    Educational Details
                  </h3>
                </form>

                {user.educationDetails?.length > 0 &&
                  user.educationDetails?.map((te, i) => (
                    <div style={{ marginLeft: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {te.college}
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            <div className="profession indiPitchHiringPositions">
                              {te.grade}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(te.Edstart)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {user.experienceDetails?.length > 0 && (
              <div className="" style={{ flexDirection: "column" }}>
                <form className="update-form">
                  <h3 className="indiPitchHiringPositions">
                    Experience Details
                  </h3>
                </form>

                {user.experienceDetails?.length > 0 &&
                  user.experienceDetails?.map((te, i) => (
                    <div style={{ marginLeft: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div className="company indiPitchHiringPositions">
                            {te.company}
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            <div className="profession indiPitchHiringPositions">
                              {te.profession}
                            </div>
                            <div className="timeline indiPitchHiringPositions">
                              {convertToDate(te.start)}-
                              {te.end == "" ? "Present" : convertToDate(te.end)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="commentsContainer">
          <h2>Ratings & Reviews</h2>
          {email !==
            jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken)
              .email && (
              <div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <img src={image} />
                  <div>
                    <span>
                      <b>{userName}</b>
                    </span>
                    <div style={{ fontSize: "12px", marginBottom: "20px" }}>
                      Reviews are public and include your account details
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
            )}

          {user?.comments?.length > 0 && (
            <div>
              <b>Reviews:</b>
            </div>
          )}
          {user?.comments?.length > 0 &&
            user.comments?.map((c, index) => (
              <IndividualUserReview
                key={index}
                c={c}
                deleteComment={deleteComment}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualUser;
