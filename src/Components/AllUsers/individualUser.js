import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import SendIcon from "@mui/icons-material/Send";
import "../LivePitches/LivePitches.css";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import { jwtDecode } from "jwt-decode";
import IndividualPitchComment from "../LivePitches/IndividualPitchComment";
import { convertToDate, formatedDate } from "../../Utils";
import IndividualUserReview from "./IndividualUserReview";
import { TextField, Tab, Tabs, Box, Typography } from "@mui/material";

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
  const [tabValue, setTabValue] = useState(0);

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
              message: "Error Occurred",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          navigate("/searchusers");
        });
    }
  }, [email, emailTrigger]);

  const [filledStars, setFilledStars] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
            message: "Error Occurred",
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
        dispatch(
          setToast({
            visible: "yes",
            message: "Error Occurred while adding comment",
            bgColor: ToastColors.failure,
          })
        );
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
            message: "Error Occurred",
            bgColor: "red",
          })
        );
      });
  };

  return visible === "yes" ? (
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
                srcSet=""
              />
              <div className="indiUserHeading">
                <div style={{ marginTop: "38px" }}>
                  {user?.userName}{" "}
                  {user.verification === "approved" && (
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
                    {user?.country && <div>{user.country}</div>}
                    {user?.state && user.country && <div>,</div>}
                    {user?.state && <div>{user.state}</div>}
                    {user?.town && (user.country || user.state) && <div>,</div>}
                    {user?.town && <div>{user.town}</div>}
                  </div>
                  <div className="indiPitchId">
                    {user?.role}
                  </div>
                  <div className="reviewInterestContainer">
                    {averagereview !== 0 && <ReviewStars avg={averagereview} />}
                  </div>
                  <div className="indiPitchDate">
                    Profile Created on <b>{formatedDate(user?.createdAt)}</b>
                  </div>
                  {user.languagesKnown?.length > 0 && (
                    <>
                      <div className="texts">
                        <div className="listedTeam">
                          {user.languagesKnown.map((t, i) => (
                            <div
                              className="singleMember indiPitchHiringPositions"
                              key={i}
                            >
                              <div>{t}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Tabs

              value={tabValue}
              onChange={handleTabChange}
              aria-label="Profile Tabs"
            >
              <Tab label="About" />
              <Tab label="Skills" />
              <Tab label="Education" />
              <Tab label="Experience" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <div className="aboutme">
                {user?.bio ? (
                  <TextField
                    sx={{
                      "& fieldset": { border: "none" },
                      width: "100%",
                      height: "auto",
                      textAlign: "justify",
                    }}
                    id="outlined-multiline-flexible"
                    name="bio"
                    value={user.bio}
                    multiline
                    maxRows={10}
                    placeholder="Enter Your Bio"
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "left",
                      background: "#ff4d4d",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                     
                    }}
                  >
                    <i
                      className="fas fa-info-circle"
                      style={{ marginRight: "10px" }}
                    ></i>
                    <span>About not added</span>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {user.skills?.length > 0 ? (
                <div>
                  {/* <label className="indiPitchHiringPositions">Skills</label> */}
                  <div className="texts">
                    <div className="listedTeam">
                      {user.skills.map((t, i) => (
                        <div
                          className="singleMember indiPitchHiringPositions"
                          key={i}
                        >
                          <div>{t}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                    style={{
                      textAlign: "left",
                      background: "#ff4d4d",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      width: '143px'
                    }}
                  >
                    <i
                      className="fas fa-info-circle"
                      style={{ marginRight: "10px" }}
                    ></i>
                    <span>Skills not added</span>
                  </div>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {user.educationDetails?.length > 0 ? (
                <div className="" style={{ flexDirection: "column" }}>
                  {user.educationDetails.map((te, i) => (
                    <div style={{ marginLeft: "20px" }} key={i}>
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
              ) : (
                <div
                    style={{
                      textAlign: "left",
                      background: "#ff4d4d",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      width: '230px'
                    }}
                  >
                    <i
                      className="fas fa-info-circle"
                      style={{ marginRight: "10px" }}
                    ></i>
                    <span>Education details not added</span>
                  </div>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {user.experienceDetails?.length > 0 ? (
                <div className="" style={{ flexDirection: "column" }}>
                  {user.experienceDetails.map((te, i) => (
                    <div style={{ marginLeft: "20px" }} key={i}>
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
                              {te.end === ""
                                ? "Present"
                                : convertToDate(te.end)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                    style={{
                      textAlign: "left",
                      background: "#ff4d4d",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      width: '240px'
                    }}
                  >
                    <i
                      className="fas fa-info-circle"
                      style={{ marginRight: "10px" }}
                    ></i>
                    <span>Experience details not added</span>
                  </div>
              )}
            </TabPanel>
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
                            cursor: comment === "" ? "not-allowed" : "pointer",
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
          <div
            style={{
              maxHeight: "340px",
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
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
    </div>
  );
};

export default IndividualUser;
// Custom TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
