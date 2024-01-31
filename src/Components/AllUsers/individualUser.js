import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { format } from "timeago.js";
import SendIcon from "@mui/icons-material/Send";

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
        navigate("/searchusers");
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
    <div>
      <div className="individualPitchContainer">
        <div className="bgPitch">
          <img
            src="https://www.f-cdn.com/assets/main/en/assets/project-view/logged-out/header.jpg?image-optimizer=force&format=webply&width=1920"
            alt=""
          />
        </div>
        <div className="indiUserDetailsContainer">
          <div className="indiUserDetails">
            <i className="fas fa-arrow-left"onClick={() => {
            navigate(-1);
          }}></i>
            <div style={{ display: "flex", gap: "0px" }}>
              <div>
                <div style={{ display: "flex" }}>
                  <img
                    src={
                      user?.image?.url !== undefined
                        ? user?.image?.url
                        : "/profile.jpeg"
                    }
                    alt=""
                    srcset=""
                    style={{ height: "120px", width: "120px" }}
                  />
                  <div className="indiUserHeading">
                    {user?.userName}{" "}
                    {user.verification == "approved" && (
                      <img
                        title="verified"
                        src="/verify.png"
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          marginLeft: "-5px",
                          marginBottom: "15px",
                        }}
                      />
                    )}
                    <div className="reviewInterestContainer">
                      <div className="">
                        <ReviewStars avg={averagereview} />
                      </div>
                    </div>
                    <div className="indiPitchDate">
                      Profile Created on <b>{formatedDate(user?.createdAt)}</b>
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
                        value={user?.bio}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="indiPitchId">
              <b>Mail:</b> <a href={`mailto:${user.email}`}>{user?.email}</a>
            </div>

            {user?.country !== "" && (
              <div className="indiPitchHiringPositions">
                <b> Country:</b>
                <div className="hp">{user?.country}</div>
              </div>
            )}
            {user?.state !== "" && (
              <div className="indiPitchHiringPositions">
                <b>State:</b>
                <div className="hp">{user?.state}</div>
              </div>
            )}
            {user?.town !== "" && (
              <div className="indiPitchHiringPositions">
                <b>Town:</b>
                <div className="hp">{user?.town}</div>
              </div>
            )}
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
                          <div style={{ marginLeft: '10px' }}>
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
                          <div style={{ marginLeft: '10px'}}>
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

              <div style={{ marginLeft: "60px" }}>
                <h4>Rate this user</h4>
                <h6>Tell others what you think</h6>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <AddReviewStars
                    filledStars={filledStars}
                    setFilledStars={setFilledStars}
                  />{" "}
                  <button
                    style={{
                      cursor: "pointer",
                      fontSize: "13px",
                      width: "5%",
                      padding: "0",
                      marginLeft: "15px",
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
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <textarea
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
                            cursor: comment == ''?'not-allowed':"pointer",
                            fontSize: "13px",
                            width: "90%",
                            padding: "5px",
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
