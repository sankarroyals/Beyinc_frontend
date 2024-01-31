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

  const [roles, setRoles] = useState([]);

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
      phone: `+91${mobile}`,
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
      setRoles(res.data);
    });
  }, []);

  return (
    <>
      <main className="signup-main-container">
        <div className="signup-hero">
          {/* <img
            className="signup-image"
            src="investment.png"
            alt="investment doodle"
          /> */}
          <div className="signup-form-section">
            <div class="signup-page">
              <div class="signup-header">
                <img class="signup-logo" src="logo.png" alt="Your Alt Text" />
                <p>Sign up to turn your dreams into reality!</p>
                {/* <button>
                <i class="fab fa-google"></i> Log in with Google
              </button> */}
              </div>
              <div class="signup-container">
                <form action="">
                  <input type="text" placeholder="Mobile Number or Email" />
                  <input type="text" placeholder="Full Name" />
                  <input type="text" placeholder="Username" />
                  <input type="password" placeholder="Password" />
                  <button>Sign up</button>
                </form>

                <ul>
                  <li>By signing up, you agree to our</li>
                  <li>
                    <a href=""> Terms </a>
                  </li>
                  <li>
                    <a href=""> Data Policy </a>
                  </li>
                  <li>and</li>
                  <li>
                    <a href=""> Cookies Policy </a> .
                  </li>
                </ul>
              </div>
              <div class="signup-header">
                <div>
                  <hr />
                  <p>OR</p>
                  <hr />
                </div>
              </div>
              <p className="signup-option-text">
                Already have an account? <a href="/login">Log in</a>
              </p>
            </div>
          </div>
        </div>
        {/* <div class="signup-otherapps">
          <p>Get the app.</p>
          <button type="button">
            <i class="fab fa-apple"></i> App Store
          </button>
          <button type="button">
            <i class="fab fa-google-play"></i> Google Play
          </button>
        </div> */}
        <div class="signup-footer">
          <ul class="signup-footer-flex">
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
    </>
  );
};
export default SignUp;
