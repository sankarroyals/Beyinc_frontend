import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom/dist";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    email: null,
    emailOtp: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    role: null,
    password: null,
    isMobileOtpSent: null,
    isEmailOtpSent: null,
    emailVerified: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });

  const [roles, setRoles] = useState([])

  const {
    email,
    emailOtp,
    mobile,
    mobileOtp,
    name,
    role,
    password,
    isEmailOtpSent,
    isMobileOtpSent,
    emailVerified,
    mobileVerified,
    isEmailValid,
    isMobileValid,
    isNameValid,
    isPasswordValid,
  } = inputs;

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
    if (e.target.name === "password") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            e.target.value
          ),
      }));
    }
    if (e.target.name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(e.target.value),
      }));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendEmailOtp = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendOtp({
      to: email,
      subject: "Email Verification",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setInputs((prev) => ({ ...prev, isEmailOtpSent: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "OTP sent failed !",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = true;
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

  const verifyOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: email,
      otp: emailOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Email verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("emailVerify").style.display = "none";
        document.getElementById("emailOtpInput").disabled = true;
        // setemailVerified(true);
        setInputs((prev) => ({ ...prev, emailVerified: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Incorrect OTP",
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

  const verifyMobileOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: `+91${mobile}`,
      otp: mobileOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Mobile verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("mobileVerify").style.display = "none";
        document.getElementById("mobileOtpInput").disabled = true;
        // setmobileVerified(true);
        setInputs((prev) => ({ ...prev, mobileVerified: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Incorrect OTP",
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

  const signup = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.register({
      email: email,
      password: password,
      userName: name,
      phone: mobile,
      role: role,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "User Registered Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        navigate("/login");
      })
      .catch((err) => {
        e.target.disabled = false;
        dispatch(
          setToast({
            message: err.response.data.message,
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

  const sendMobileOtpF = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendMobileOtp({
      phone: `+91${mobile}`
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
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
            visible: "yes",
          })
        );
        e.target.disabled = true;
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

  const isFormValid =
    isEmailValid &&
    isMobileValid &&
    emailVerified &&
    mobileVerified &&
    isNameValid &&
    isPasswordValid;

  const handleChangeRadio = (e) => {
    setInputs((prev) => ({ ...prev, role: e.target.value }));
  };



  useEffect(() => {
    ApiServices.getAllRoles().then((res) => {
      setRoles(res.data)
    })
  }, [])

  return (
    <div className="registration-container">
      {/* Image Container */}
      <div className="registration-image-container">
        <center>
          <h2 style={{ marginTop: "40px", fontWeight: "600" }}>
            Get Started Now
          </h2>
          <p style={{ fontSize: "14px" }}>
            It's free to join and gain full access to thousands of exciting
            investment opportunities.
          </p>
          <img src="investment.png" alt="Your Alt Text" />
        </center>
      </div>

      {/* Form Container */}
      <div className="registration-form-container">
        <form>
          <center>
            <h1 className="signup-heading">Signup</h1>
          </center>
          <div className="input-container">
            <input
              type="text"
              className={
                isNameValid !== null && (isNameValid ? "valid" : "invalid")
              }
              value={name}
              name="name"
              onChange={handleChanges}
              placeholder="Full Name*"
            />
          </div>
          <div
            className="input-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {roles?.map((r) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.role}
                  id={r.role}
                  onClick={handleChangeRadio}
                />
                <label for={r.role}>{r.role}</label>
              </div>
            ))}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name="role"
                value="Entrepreneur"
                id="Entrepreneur"
                onClick={handleChangeRadio}
              />
              <label for="Entrepreneur">Entrepreneur</label>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name="role"
                value="Mentor"
                id="Mentor"
                onClick={handleChangeRadio}
              />
              <label for="Mentor">Mentor</label>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name="role"
                value="Investor"
                id="Investor"
                onClick={handleChangeRadio}
              />
              <label for="Investor">Investor</label>
            </div> */}
          </div>

          <div className="input-container">
            <input
              type="email"
              className={
                isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
              }
              value={email}
              name="email"
              onChange={handleChanges}
              disabled={emailVerified}
              placeholder="Email Address*"
            />
            {emailVerified === true && (
              <img
                src="checked.png"
                height={20}
                alt="Your Alt Text"
                className="successIcons"
              />
            )}
            {!isEmailOtpSent && isEmailValid && (
              <button
                type="button"
                className="otp_button"
                onClick={sendEmailOtp}
              >
                Get OTP
              </button>
            )}
          </div>

          {isEmailOtpSent && emailVerified !== true && (
            <>
              <div className="input-container">
                <input
                  type="text"
                  className={
                    emailOtp !== null &&
                    (emailOtp.length === 6 ? "valid" : "invalid")
                  }
                  value={emailOtp}
                  name="emailOtp"
                  onChange={handleChanges}
                  placeholder="Enter Email OTP"
                  id="emailOtpInput"
                />
                {emailOtp !== null && emailOtp.length === 6 && (
                  <button
                    type="button"
                    className="otp_button"
                    id="emailVerify"
                    onClick={verifyOtp}
                    style={{ whiteSpace: "noWrap" }}
                  >
                    Verify OTP
                  </button>
                )}
              </div>
            </>
          )}

          <div className="input-container">
            <input
              type="number"
              className={
                mobile !== null && (mobile.length === 10 ? "valid" : "invalid")
              }
              name="mobile"
              value={mobile}
              disabled={mobileVerified}
              onChange={handleChanges}
              placeholder="Mobile Number*"
            />
            {mobileVerified === true && (
              <img
                src="checked.png"
                height={20}
                alt="Your Alt Text"
                className="successIcons"
              />
            )}

            {!isMobileOtpSent && isMobileValid && (
              <button
                type="button"
                className="otp_button"
                onClick={sendMobileOtpF}
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
                    className="otp_button"
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

          <div className="input-container">
            <input
              type="password"
              className={
                isPasswordValid !== null &&
                (isPasswordValid ? "valid" : "invalid")
              }
              name="password"
              value={password}
              onChange={handleChanges}
              placeholder="Create Password*"
            />
          </div>

          <button type="submit" disabled={!isFormValid} onClick={signup}>
            Signup
          </button>
          <p>
            Already have an account?{" "}
            <RouterLink
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: "600",
                color: "#1e4bb8",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Login
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
