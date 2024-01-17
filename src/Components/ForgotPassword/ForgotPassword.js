import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom/dist";

const ResetPassword = () => {
  const [inputs, setInputs] = useState({
    email: null,
    mobile: null,
    otp: null,
    newPassword: null,
    confirmPassword: null,
    isEmailValid: null,
    isMobileValid: null,

    isPasswordValid: null,
  });

  const {
    email,
    mobile,
    newPassword,
    confirmPassword,
    isMobileValid,
    otp,
    mobileVerified,
    isEmailValid,
    isPasswordValid,
  } = inputs;
  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@gmail.com/.test(e.target.value),
      }));
    }
    if (e.target.name === "newPassword") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            e.target.value
          ),
      }));
    }
  };

  const [loginType, setLoginType] = useState("email");
  const [otpVisible, setOtpVisible] = useState(false);
  const [emailVerified, setemailVerified] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const handleLoginTypeChange = (type) => {
  //   setLoginType(type);
  //   setEmail("");
  //   setMobile("");
  //   setOtp("");
  //   setNewPassword("");
  //   setConfirmPassword("");
  //   setOtpVisible(false);
  //   setIsMobileValid(false);
  // };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const obj = {
      email: email,
      password: newPassword,
    };
    await ApiServices.resetPassword(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "Password changed Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        navigate("/login");
      })
      .catch((err) => {
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

  const handleGetOtp = async (e) => {
    e.target.disabled = true;
    if (loginType === "email") {
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
          setOtpVisible(true);
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "OTP sent successfully !",
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
    } else {
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: email,
      otp: otp,
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
        setemailVerified(true);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "OTP Entered Wrong",
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

  const handleMobileChange = (value) => {
    // setMobile(value);
    // setIsMobileValid(/^[0-9]{10}$/.test(value));
  };

  return (
    <div className="form-container">
      <form className="form">
        <center>
          <h2>Reset Password</h2>
          <p>Reset your password with email</p>
        </center>
        {/* <div className="login-type-toggle">
          <span
            className={loginType === "email" ? "active" : ""}
            onClick={() => handleLoginTypeChange("email")}
          >
            Email
          </span>
          <span
            className={loginType === "mobile" ? "active" : ""}
            onClick={() => handleLoginTypeChange("mobile")}
          >
            Mobile
          </span>
        </div> */}
        {loginType === "email" ? (
          <>
            <input
              type="text"
              name="email"
              className={
                isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
              }
              value={email}
              placeholder="Email Address"
              disabled={emailVerified}
              onChange={handleChanges}
            />
            {emailVerified === true && (
              <img
                src="checked.png"
                height={20}
                alt="Your Alt Text"
                className="successIcons"
              />
            )}

            {isEmailValid && !otpVisible && (
              <button
                type="button"
                className="otp_button"
                onClick={handleGetOtp}
              >
                Get OTP
              </button>
            )}
            {otpVisible && emailVerified !== true && (
              <>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  placeholder="Enter OTP"
                  onChange={handleChanges}
                />
                {otp !== null && otp.length === 6 && (
                  <button
                    type="button"
                    className="otp_button"
                    onClick={verifyOtp}
                    id="emailVerify"
                  >
                    Verify otp
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              disabled={mobileVerified}
              value={mobile}
              placeholder="Mobile Number"
              onChange={(e) => handleMobileChange(e.target.value)}
            />
            {mobileVerified === true && (
              <img
                src="checked.png"
                height={20}
                alt="Your Alt Text"
                className="successIcons"
              />
            )}

            {isMobileValid && !otpVisible && (
              <button
                type="button"
                className="otp_button"
                onClick={handleGetOtp}
              >
                Get OTP
              </button>
            )}
            {otpVisible && (
              <>
                <input type="text" value={otp} placeholder="Enter OTP" />
                <button
                  type="button"
                  className="otp_button"
                  onClick={handleGetOtp}
                  style={{ whiteSpace: "noWrap" }}
                >
                  Resend OTP
                </button>
              </>
            )}
          </>
        )}
        {(emailVerified || mobileVerified) && (
          <>
            <input
              name="newPassword"
              type="password"
              className={
                isPasswordValid !== null &&
                (isPasswordValid ? "valid" : "invalid")
              }
              value={newPassword}
              placeholder="New Password"
              onChange={handleChanges}
            />
            {isPasswordValid && (
              <input
                name="confirmPassword"
                type="password"
                className={
                  confirmPassword !== null &&
                  (confirmPassword === newPassword ? "valid" : "invalid")
                }
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChanges}
              />
            )}
          </>
        )}
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={
            !emailVerified ||
            newPassword === "" ||
            newPassword !== confirmPassword
          }
        >
          Reset Password
        </button>
        <p>
          Remember your password?{" "}
          <RouterLink
            to="/login"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              color: "#1e4bb8",
              transition: "color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Login
          </RouterLink>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
