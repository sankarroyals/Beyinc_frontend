import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom/dist";
import '../Login/Login.css'
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

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setInputs({
      email: null,
      emailOtp: null,
      mobile: null,
      mobileOtp: null,
      name: null,
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
    setOtpVisible(false);
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
    // <div className="form-container">
    //   <form className="form">
    //     <center>
    //       <h2>Reset Password</h2>
    //       <p>Reset your password with email</p>
    //     </center>
    //     {/* <div className="login-type-toggle">
    //       <span
    //         className={loginType === "email" ? "active" : ""}
    //         onClick={() => handleLoginTypeChange("email")}
    //       >
    //         Email
    //       </span>
    //       <span
    //         className={loginType === "mobile" ? "active" : ""}
    //         onClick={() => handleLoginTypeChange("mobile")}
    //       >
    //         Mobile
    //       </span>
    //     </div> */}
    //     {loginType === "email" ? (
    //       <>
    //         <input
    //           type="text"
    //           name="email"
    //           className={
    //             isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
    //           }
    //           value={email}
    //           placeholder="Email Address"
    //           disabled={emailVerified}
    //           onChange={handleChanges}
    //         />
    //         {emailVerified === true && (
    //           <img
    //             src="checked.png"
    //             height={20}
    //             alt="Your Alt Text"
    //             className="successIcons"
    //           />
    //         )}

    //         {isEmailValid && !otpVisible && (
    //           <button
    //             type="button"
    //             className="otp_button"
    //             onClick={handleGetOtp}
    //           >
    //             Get OTP
    //           </button>
    //         )}
    //         {otpVisible && emailVerified !== true && (
    //           <>
    //             <input
    //               type="text"
    //               name="otp"
    //               value={otp}
    //               placeholder="Enter OTP"
    //               onChange={handleChanges}
    //             />
    //             {otp !== null && otp.length === 6 && (
    //               <button
    //                 type="button"
    //                 className="otp_button"
    //                 onClick={verifyOtp}
    //                 id="emailVerify"
    //               >
    //                 Verify otp
    //               </button>
    //             )}
    //           </>
    //         )}
    //       </>
    //     ) : (
    //       <>
    //         <input
    //           type="text"
    //           disabled={mobileVerified}
    //           value={mobile}
    //           placeholder="Mobile Number"
    //           onChange={(e) => handleMobileChange(e.target.value)}
    //         />
    //         {mobileVerified === true && (
    //           <img
    //             src="checked.png"
    //             height={20}
    //             alt="Your Alt Text"
    //             className="successIcons"
    //           />
    //         )}

    //         {isMobileValid && !otpVisible && (
    //           <button
    //             type="button"
    //             className="otp_button"
    //             onClick={handleGetOtp}
    //           >
    //             Get OTP
    //           </button>
    //         )}
    //         {otpVisible && (
    //           <>
    //             <input type="text" value={otp} placeholder="Enter OTP" />
    //             <button
    //               type="button"
    //               className="otp_button"
    //               onClick={handleGetOtp}
    //               style={{ whiteSpace: "noWrap" }}
    //             >
    //               Resend OTP
    //             </button>
    //           </>
    //         )}
    //       </>
    //     )}
    //     {(emailVerified || mobileVerified) && (
    //       <>
    //         <input
    //           name="newPassword"
    //           type="password"
    //           className={
    //             isPasswordValid !== null &&
    //             (isPasswordValid ? "valid" : "invalid")
    //           }
    //           value={newPassword}
    //           placeholder="New Password"
    //           onChange={handleChanges}
    //         />
    //         {isPasswordValid && (
    //           <input
    //             name="confirmPassword"
    //             type="password"
    //             className={
    //               confirmPassword !== null &&
    //               (confirmPassword === newPassword ? "valid" : "invalid")
    //             }
    //             value={confirmPassword}
    //             placeholder="Confirm Password"
    //             onChange={handleChanges}
    //           />
    //         )}
    //       </>
    //     )}
    //     <button
    //       type="button"
    //       onClick={handleResetPassword}
    //       disabled={
    //         !emailVerified ||
    //         newPassword === "" ||
    //         newPassword !== confirmPassword
    //       }
    //     >
    //       Reset Password
    //     </button>
    //     <p>
    //       Remember your password?{" "}
    //       <RouterLink
    //         to="/login"
    //         style={{
    //           textDecoration: "none",
    //           fontWeight: "600",
    //           color: "#1e4bb8",
    //           transition: "color 0.3s",
    //         }}
    //         onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
    //         onMouseOut={(e) => (e.target.style.textDecoration = "none")}
    //       >
    //         Login
    //       </RouterLink>
    //     </p>
    //   </form>
    // </div>
    <main className="login-main-container">
      <div className="login-hero">
        {/* <img
          className="login-image"
          src="investment.png"
          alt="investment doodle"
        /> */}
        <div className="login-form-section">
          <div class="login-page">
            <div class="login-header">
              <img
                class="login-logo"
                src="logo.png"
                alt="Your Alt Text"
                onClick={() => {
                  navigate("/");
                }}
              />
              <p>Change your password here!</p>
              {/* <button>
              <i class="fab fa-google"></i> Log in with Google
            </button> */}
            </div>
            <div class="login-container">
              <div class="tab-wrap">
                <input
                  type="radio"
                  id="tab1"
                  name="tabGroup1"
                  class="tab"
                  checked={loginType === "email"}
                  onClick={() => handleLoginTypeChange("email")}
                />
                <label for="tab1">Email</label>
                <input
                  onClick={() => handleLoginTypeChange("mobile")}
                  type="radio"
                  id="tab2"
                  name="tabGroup1"
                  class="tab"
                />
                <label for="tab2">Mobile</label>
              </div>
              {/* <form action="">
                {loginType === "email" ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      className={
                        isEmailValid !== null &&
                        (isEmailValid ? "valid" : "invalid")
                      }
                      placeholder="Email Address"
                      onChange={handleChanges}
                    />
                    <input
                      type="password"
                      className={
                        isPasswordValid !== null &&
                        (isPasswordValid ? "valid" : "invalid")
                      }
                      name="password"
                      value={password}
                      placeholder="Password"
                      onChange={handleChanges}
                    />
                  </>
                ) : (
                  <>
                    <div className="input-button-row">
                      <input
                        type="number"
                        value={mobile}
                        className={
                          isMobileValid !== null &&
                          (isMobileValid ? "valid" : "invalid")
                        }
                        disabled={mobileVerified}
                        placeholder="Mobile Number"
                        autoComplete="off"
                        name="mobile"
                        onChange={handleChanges}
                      />
                      {mobileVerified === true && (
                        <img
                          src="checked.png"
                          height={20}
                          style={{ right: "20px" }}
                          alt="Your Alt Text"
                          className="successIcons"
                        />
                      )}
                      {isMobileValid && !otpVisible && (
                        <button type="button" onClick={sendMobileOtpF}>
                          Get OTP
                        </button>
                      )}
                    </div>
                    {otpVisible && mobileVerified !== true && (
                      <>
                        <input
                          type="text"
                          value={mobileOtp}
                          className={
                            mobileOtp !== null &&
                            (mobileOtp.length === 6 ? "valid" : "invalid")
                          }
                          placeholder="Enter OTP"
                          name="mobileOtp"
                          onChange={handleChanges}
                        />
                        {mobileOtp !== null && mobileOtp.length === 6 && (
                          <button
                            type="button"
                            id="mobileVerify"
                            onClick={verifyMobileOtp}
                            style={{ whiteSpace: "noWrap" }}
                          >
                            Verify OTP
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
                <button
                  className="full-width-button"
                  type="submit"
                  disabled={!isFormValid}
                  onClick={loginType === "email" ? login : mobileLogin}
                >
                  Login
                </button>
              </form> */}
            </div>
            <div class="login-header">
              <div>
                <hr />
                <p>OR</p>
                <hr />
              </div>
            </div>
            <p className="login-option-text">
              All Set? <a href="/login">Login in</a>
            </p>
          </div>
        </div>
      </div>
      {/* <div class="login-otherapps">
        <p>Get the app.</p>
        <button type="button">
          <i class="fab fa-apple"></i> App Store
        </button>
        <button type="button">
          <i class="fab fa-google-play"></i> Google Play
        </button>
      </div> */}
      <div class="login-footer">
        <ul class="login-footer-flex">
          <li>
            <a href="">ABOUT</a>
          </li>
          <li>
            <a href="">HELP</a>
          </li>
          <li>
            <a href="">API</a>
          </li>
          <li>
            <a href="">JOBS</a>
          </li>
          <li>
            <a href="">PRIVACY</a>
          </li>
          <li>
            <a href="">TERMS</a>
          </li>
          <li>
            <a href="">LOCATIONS</a>
          </li>
          <li>
            <a href="">LANGUAGE</a>
          </li>
        </ul>
        <p>© 2024 BeyInc</p>
      </div>
    </main>
  );
};

export default ResetPassword;
