import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom/dist";
import "./Editprofile.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { AdminServices } from "../../Services/AdminServices";
import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";

const Editprofile = () => {
  const { email, role, userName, image, phone } = useSelector(
    (store) => store.auth.loginDetails
  );

  const [showPreviousFile, setShowPreviousFile] = useState(false);

  const [inputs, setInputs] = useState({
    email: null,
    emailOtp: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    role: null,
    isMobileOtpSent: null,
    isEmailOtpSent: null,
    emailVerified: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
  });

  const {
    // email,
    // emailOtp,
    mobile,
    mobileOtp,
    name,
    //  role,
    // isEmailOtpSent,
    isMobileOtpSent,
    // emailVerified,
    mobileVerified,
    isEmailValid,
    isMobileValid,
    isNameValid,
    updatedAt,
  } = inputs;

  const [nameChanger, setNameChanger] = useState(false);
  const [roles, setRoles] = useState([]);

  const [experienceDetails, setExperience] = useState({
    experience: '',
    job: '',
    qualification: '',
    fee: 1
  })

  const [changeResume, setchangeDocuments] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });
  const [oldDocs, setOldDocs] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });

  const [recentUploadedDocs, setRecentUploadedDocs] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  })

  const handleChange = (e) => {
    setExperience(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleResume = (e) => {
    const file = e.target.files[0];
    setRecentUploadedDocs((prev) => ({ ...prev, [e.target.name]: file?.name }))
    setFileBase(e, file);
  };
  const setFileBase = (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setchangeDocuments((prev) => ({
        ...prev,
        [e.target.name]: reader.result,
      }));
    };
  };

  useEffect(() => {
    ApiServices.getProfile({ email: email })
      .then((res) => {
        setInputs((prev) => ({
          ...prev,
          updatedAt: res.data.updatedAt,
          name: res.data.userName,
          mobile: res.data.phone,
          role: res.data.role,
          mobileVerified: true,
        }));

        setExperience({
          experience: res.data.experience || '',
          job: res.data.job || '',
          qualification: res.data.qualification || '',
          fee: +res.data.fee || 1
        })

        if (res.data.documents !== undefined) {
          setOldDocs((prev) => ({
            ...prev,
            resume: res.data.documents.resume,
            expertise: res.data.documents.expertise,
            acheivements: res.data.documents.acheivements,
            working: res.data.documents.working,
            degree: res.data.documents.degree,
          }));
          setchangeDocuments((prev) => ({
            ...prev,
            resume: res.data.documents?.resume || "",
            expertise: res.data.documents?.expertise || "",
            acheivements: res.data.documents?.acheivements || "",
            working: res.data.documents?.working || "",
            degree: res.data.documents?.degree || "",
          }));
        }
      })
      .catch((error) => {
        dispatch(
          setToast({
            message: error.response.data.message,
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
      });
  }, [email]);

  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "name") {
      setInputs((prev) => ({ ...prev, isNameValid: e.target.value !== "" }));
    }
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@gmail.com/.test(e.target.value),
      }));
    }
    if (e.target.name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(e.target.value),
      }));
      setInputs((prev) => ({
        ...prev,
        mobileVerified: false,
        isMobileOtpSent: false,
      }));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendMobileOtp = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendOtp({
      to: email,
      subject: "Mobile Verification",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visibile: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "OTP sent failed !",
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          bgColor: "",
          visibile: "no",
        })
      );
    }, 4000);
  };

  // const verifyOtp = async (e) => {
  //   e.preventDefault();
  //   await ApiServices.verifyOtp({
  //     email: email,
  //     otp: emailOtp,
  //   })
  //     .then((res) => {
  //       dispatch(
  //         setToast({
  //           message: "Email verified successfully !",
  //           bgColor: ToastColors.success,
  //           visibile: "yes",
  //         })
  //       );
  //       document.getElementById("emailVerify").style.display = "none";
  //       document.getElementById("emailOtpInput").disabled = true;
  //       // setemailVerified(true);
  //       setInputs((prev) => ({ ...prev, emailVerified: true }));
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         setToast({
  //           message: "Incorrect OTP",
  //           bgColor: ToastColors.failure,
  //           visibile: "yes",
  //         })
  //       );
  //     });
  //   setTimeout(() => {
  //     dispatch(
  //       setToast({
  //         message: "",
  //         bgColor: "",
  //         visibile: "no",
  //       })
  //     );
  //   }, 4000);
  // };

  const verifyMobileOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: email,
      otp: mobileOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Mobile verified successfully !",
            bgColor: ToastColors.success,
            visibile: "yes",
          })
        );
        document.getElementById("mobileVerify").style.display = "none";
        document.getElementById("mobileOtpInput").disabled = true;
        document
          .getElementsByClassName("mobile-verification")[0]
          .classList.remove("showMobileVerification");
        // setmobileVerified(true);
        setInputs((prev) => ({ ...prev, mobileVerified: true }));
        document.getElementById("mobile").disabled = true;
        if (name != "") {
          setInputs((prev) => ({ ...prev, isNameValid: true }));
        }
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Incorrect OTP",
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          bgColor: "",
          visibile: "no",
        })
      );
    }, 4000);
  };

  const update = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendForApproval({
      email: email,
      userName: name,
      phone: mobile,
      role: role,
      documents: changeResume, experienceDetails: experienceDetails
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Profile Sent for approval!",
            bgColor: ToastColors.success,
            visibile: "yes",
          })
        );
        setInputs({
          email: null,
          emailOtp: null,
          mobile: null,
          mobileOtp: null,
          name: null,
          role: null,
          isMobileOtpSent: null,
          isEmailOtpSent: null,
          emailVerified: null,
          mobileVerified: null,
          isEmailValid: null,
          isMobileValid: null,
          isNameValid: null,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        navigate("/");
      })
      .catch((err) => {
        e.target.disabled = false;
        dispatch(
          setToast({
            message: "Error occured when sending profile to approval",
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
      });
    setTimeout(() => {
      dispatch(
        setToast({
          message: "",
          bgColor: "",
          visibile: "no",
        })
      );
    }, 4000);
  };

  // const sendMobileOtp = (e) => {
  //   e.preventDefault();
  //   e.target.disabled = true;
  //   setTimeout(() => {
  //     // setIsMobileOtpSent(true);
  //     setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
  //   }, 1000);
  // };

  const isFormValid =
    mobileVerified &&
    (isNameValid ||
      oldDocs.resume !== "" ||
      oldDocs.expertise !== "" ||
      oldDocs.acheivements !== "" ||
      oldDocs.working !== "" ||
      oldDocs.degree !== "" ||
      changeResume.resume !== "" ||
      changeResume.expertise !== "" ||
      changeResume.acheivements !== "" ||
      changeResume.working !== "" ||
      changeResume.degree !== "");

  const handleChangeRadio = (e) => {
    setInputs((prev) => ({ ...prev, role: e.target.value }));
  };
  useEffect(() => {
    ApiServices.getAllRoles().then((res) => {
      setRoles(res.data);
    });
  }, []);

  return (
    <div className="update-container">
      <div className="updateContainerWrapper">
        <div className="heading">
          <div>
            <img
              src={image !== undefined && image !== "" ? image : "/profile.jpeg"}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
              }}
            />
          </div>

          <div className="profile-content">
            <div style={{ fontSize: "24px" }}>
              {nameChanger ? (
                <input
                  className="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setInputs((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
              ) : (
                name
              )}
              <attr title="Edit Name" style={{ borderRadius: "5px" }}>
                <i
                  className="fas fa-pencil-alt"
                  onClick={() => {
                    setNameChanger(!nameChanger);
                  }}
                ></i>
              </attr>
            </div>
            <div
              style={{ fontSize: "12px", color: "#717B9E", marginBottom: "40px" }}
            >
              Profile last updated -{" "}
              <span style={{ color: "black" }}>
                <i class="fas fa-clock"></i>
                {format(updatedAt)}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                border: "0.2px solid #d3d3d3",
                marginTop: "-20px",
                marginBottom: "20px",
              }}
            ></div>

            <div
              style={{ fontSize: "16px", color: "#474D6A", lineHeight: "1.5" }}
            >
              <div
                style={{ fontSize: "16px", color: "#474D6A", lineHeight: "1.5" }}
              >
                <i class="fas fa-user"></i> {role}
                <br />
                <i className="fas fa-envelope"></i> {email}{" "}
                <img
                  src="/verify.png"
                  style={{ width: "15px", height: "15px", marginLeft: "5px" }}
                />
                <br />
                <i className="fas fa-phone"></i> {mobile}{" "}
                {mobileVerified && (
                  <img
                    src="/verify.png"
                    style={{ width: "15px", height: "15px", marginLeft: "5px" }}
                  />
                )}
                <attr title="Edit Mobile Number">
                  <i
                    className="fas fa-pencil-alt"
                    onClick={(e) => {
                      document
                        .getElementsByClassName("mobile-verification")[0]
                        .classList.toggle("showMobileVerification");
                    }}
                  ></i>
                </attr>
                <div className="mobile-verification">
                  <div
                    className="closeIcon"
                    onClick={() => {
                      document
                        .getElementsByClassName("mobile-verification")[0]
                        .classList.remove("showMobileVerification");
                    }}
                  >
                    <i className="fas fa-times Cross"></i>
                  </div>
                  <div className="input-container">
                    <label style={{ marginLeft: "30px" }}>
                      Update Mobile Number
                    </label>
                    <input
                      type="text"
                      className={
                        mobile !== null &&
                        (mobile.length === 10 ? "valid" : "invalid")
                      }
                      name="mobile"
                      id="mobile"
                      value={mobile}
                      onChange={handleChanges}
                      placeholder="Mobile Number"
                    />
                    {mobileVerified === true}

                    {!isMobileOtpSent && isMobileValid && (
                      <button
                        type="button"
                        className="otp_Button"
                        onClick={sendMobileOtp}
                      >
                        Get OTP
                      </button>
                    )}
                  </div>

                  {isMobileOtpSent && mobileVerified !== true && (
                    <>
                      <div className="input-container">
                        <input
                          type="text"
                          className={
                            mobileOtp !== null &&
                            (mobileOtp.length === 6 ? "valid" : "invalid")
                          }
                          name="mobileOtp"
                          value={mobileOtp}
                          onChange={handleChanges}
                          placeholder="Enter Mobile OTP"
                          id="mobileOtpInput"
                        />
                        {mobileOtp !== null && mobileOtp.length === 6 && (
                          <button
                            type="button"
                            className="otp_Button"
                            id="mobileVerify"
                            onClick={verifyMobileOtp}
                            style={{ whiteSpace: "noWrap" }}
                          >
                            Verify OTP
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {role == 'Mentor' && <div className="update-form-container">
          <form className="update-form">
            <h3 className="update-heading">Experience / Fee Negotiation</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <label>Experience</label>
                </div>
                <div>
                  <input type="text" value={experienceDetails.experience} name="experience" id="" onChange={handleChange} placeholder="Enter Your Experience" />
                </div>
              </div>
              <div>
                <div>
                  <label>Profession</label>
                </div>
                <div>
                  <input type="text" name="job" value={experienceDetails.job} id="" onChange={handleChange} placeholder="Enter Your Profession" />
                </div>
              </div>
              <div>
                <div>
                  <label>Qualification</label>
                </div>
                <div>
                  <input type="text" name="qualification" id="" value={experienceDetails.qualification} onChange={handleChange} placeholder="Enter Your Qualification" />
                </div>
              </div>
              <div>
                <div>
                  <label>Fee request</label>
                </div>
                <div>
                  <input type="range" min={1} max={50} name="fee" value={experienceDetails.fee} id="" onChange={handleChange} placeholder="Enter Fee request per minute" /> &#8377; {experienceDetails.fee} / per min
                </div>
              </div>
            </div>

          </form>
        </div>}
        <div className="update-form-container">
          <form className="update-form">
            <h3 className="update-heading">Upload files</h3>



            <div
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                >
                  <label>Resume</label>
                  {oldDocs.resume !== "" &&
                    oldDocs.resume !== undefined &&
                    Object.keys(oldDocs.resume).length !== 0 && (
                      <attr title="view previous resume">
                        <a
                          href={oldDocs.resume?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                <label htmlFor='resume' className="resume"><CloudUploadIcon /><span className="fileName">{recentUploadedDocs?.resume || 'Upload'}</span></label>
                <input
                  className="resume"
                  type="file"
                  name="resume"
                  id="resume"
                  onChange={handleResume} style={{ display: 'none' }}
                />
              </div>

              <div>
                <div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                  >
                    <label>Acheivements</label>
                    {oldDocs.acheivements !== "" &&
                      oldDocs.acheivements !== undefined &&
                      Object.keys(oldDocs.acheivements).length !== 0 && (
                        <attr title="view previous acheivements">
                          <a
                            href={oldDocs.acheivements?.secure_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              style={{
                                height: "30px",
                                width: "30px",
                              }}
                              src="view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                          </a>
                        </attr>
                      )}
                  </div>
                  <label htmlFor='acheivements' className="resume"><CloudUploadIcon /><span className="fileName">{recentUploadedDocs?.acheivements || 'Upload'}</span></label>
                  <input
                    type="file"
                    id="acheivements"
                    className="resume"
                    name="acheivements"
                    onChange={handleResume} style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                >
                  <label>Degree</label>
                  {oldDocs.degree !== "" &&
                    oldDocs.degree !== undefined &&
                    Object.keys(oldDocs.degree).length !== 0 && (
                      <attr title="view previous degree ">
                        <a
                          href={oldDocs.degree?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                <label htmlFor='degree' className="resume"><CloudUploadIcon /><span className="fileName">{recentUploadedDocs?.degree || 'Upload'}</span></label>

                <input
                  type="file"
                  id="degree"
                  className="resume"
                  name="degree"
                  onChange={handleResume} style={{ display: 'none' }}
                />
              </div>

              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                >
                  <label>Expertise</label>
                  {oldDocs.expertise !== "" &&
                    oldDocs.expertise !== undefined &&
                    Object.keys(oldDocs.expertise).length !== 0 && (
                      <attr title="view previous expertise ">
                        <a
                          href={oldDocs.expertise?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                <label htmlFor='expertise' className="resume"><CloudUploadIcon /><span className="fileName">{recentUploadedDocs?.expertise || 'Upload'}</span></label>

                <input
                  type="file"
                  id="expertise"
                  className="resume"
                  name="expertise" style={{ display: 'none' }}
                  onChange={handleResume}
                />
              </div>

              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                >
                  <label>Working</label>
                  {oldDocs.working !== "" &&
                    oldDocs.working !== undefined &&
                    Object.keys(oldDocs.working).length !== 0 && (
                      <attr title="view previous working ">
                        <a
                          href={oldDocs.working?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                <label htmlFor='working' className="resume"><CloudUploadIcon /><span className="fileName">{recentUploadedDocs?.working || 'Upload'}</span></label>

                <input
                  type="file"
                  id="working"
                  className="resume" style={{ display: 'none' }}
                  name="working"
                  onChange={handleResume}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "25%",
                gap: "10px",
                marginLeft: "30px",
                marginTop: "5px",
              }}
            >
              <button
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </button>
              <button type="submit" disabled={!isFormValid} onClick={update}>
                Send for Approval
              </button>
            </div>
          </form>
        </div>
     </div>
    </div>
  );
};

export default Editprofile;
