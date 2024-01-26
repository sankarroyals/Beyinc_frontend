import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    password: null,
    isMobileOtpSent: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
    isPasswordValid: null,
  });

  const {
    email,
    mobile,
    password,
    mobileOtp,
    mobileVerified,
    isEmailValid,
    isMobileValid,
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
  const [loginType, setLoginType] = useState("email");
  const [otpVisible, setOtpVisible] = useState(false);

  // const isEmailValid = /[a-zA-Z0-9]+@gmail.com/.test(email);
  // const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const isFormValid =
    (loginType === "email" && isEmailValid && isPasswordValid) ||
    (loginType === "mobile" && mobileVerified);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setOtpVisible(true)
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

  // const handleMobileChange = (value) => {
  //   setMobile(value);
  //   setIsMobileValid(/^[0-9]{10}$/.test(value));
  // };

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
        // document.getElementById("mobileVerify").style.display = "none";
        // document.getElementById("mobileOtpInput").disabled = true;
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

  const login = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const obj = {
      email: email,
      password: password,
    };
    await ApiServices.login(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        // navigate("/");
        window.location.href = "/home";
      })
      .catch((err) => {
        e.target.disabled = false;

        dispatch(
          setToast({
            message:
              err?.response?.data?.message !== ""
                ? err?.response?.data?.message
                : "Error Occured",
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

  const mobileLogin = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const obj = {
      phone: mobile,
      password: password,
    };
    await ApiServices.mobileLogin(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "User Logged In Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        window.location.href = "/home";
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
  return (
    <div className="login-container">
      {/* Login Form */}
      <form className="login-form-container">
        <center>
        <img src="/logo.png" className="login-logo" onClick={() => {
          navigate("/");
        }}/>
          <h2>Login</h2>
          <p>Log in now to get full access.</p>
        </center>
        <div className="login-type-toggle">
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
        </div>
        {loginType === "email" ? (
          <>
            <input
              type="email"
              name="email"
              value={email}
              className={
                isEmailValid !== null && (isEmailValid ? "valid" : "invalid")
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
            <div className="input-container">
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
            </div>

            {isMobileValid && !otpVisible && (
              <button
                type="button"
                className="otp_button"
                onClick={sendMobileOtpF}
              >
                Get OTP
              </button>
            )}
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
                    className="otp_button"
                    id="mobileVerify"
                    onClick={verifyMobileOtp}
                    style={{ whiteSpace: "noWrap" }}
                  >
                    Verify OTP
                  </button>
                )}
              </>
            )}
            {/* {mobileVerified && (
              <input
                type="password"
                value={password}
                className={
                  isPasswordValid !== null &&
                  (isPasswordValid ? "valid" : "invalid")
                }
                name="password"
                placeholder="Password"
                onChange={handleChanges}
              />
            )} */}
          </>
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className="submitBtn"
          onClick={loginType === "email" ? login : mobileLogin}
        >
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <RouterLink
            to="/signup"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              color: "#1e4bb8",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Sign Up
          </RouterLink>
        </p>
        <p>
          <RouterLink
            to="/forgotpassword"
            style={{
              textDecoration: "none",
              fontWeight: "600",
              color: "#1e4bb8",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Forgot Password?
          </RouterLink>
        </p>
      </form>

      {/* Image Container */}
      <div className="login-image-container">
        {/* Add your image source here */}
        <img src="login.png" alt="Your Alt Text" />
      </div>
    </div>
  );
};

export default Login;
