import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = () => {
  const { email, role, userName, image, verification } = useSelector(
    (store) => store.auth.loginDetails
  );

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);

  const handleClickOpen = () => {
      document
        .getElementsByClassName("userDetails")[0]
        .classList.remove("showUserDetails");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [changeImage, setchangeImage] = useState("");
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileBase(file);
  };
  const setFileBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setchangeImage(reader.result);
    };
  };
  console.log(image)
  const submit = async (e) => {
    e.target.disabled = true;
    await ApiServices.updateuserProfileImage({
      email: email,
      image: changeImage,
    })
      .then(async (res) => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        dispatch(
          setToast({
            message: "Image uploaded successfully",
            bgColor: ToastColors.success,
            visibile: "yes",
          })
        );
        e.target.disabled = false;
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image upload",
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
        e.target.disabled = false;
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

  const deleteImg = async (e) => {
    e.target.disabled = true;
    await ApiServices.deleteuserProfileImage({ email: email })
      .then(async (res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        await axiosInstance.customFnAddTokenInHeader(res.data.accessToken);
        dispatch(
          setToast({
            message: "Image removed successfully",
            bgColor: ToastColors.success,
            visibile: "yes",
          })
        );
        e.target.disabled = false;
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image delete",
            bgColor: ToastColors.failure,
            visibile: "yes",
          })
        );
        e.target.disabled = false;
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

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target)
    ) {
      document
        .getElementsByClassName("userDetails")[0]
        .classList.remove("showUserDetails");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="navbar"
      style={{ display: email == undefined ? "none" : "flex" }}
    >
      <div className="logo" onClick={() => {
        navigate('/')
      }} >BEYINC</div>
      <div className="navRight">
        <div>
          <MessageIcon style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => {
            navigate('/conversations')
          }} />
        </div>
        <div>
          <NotificationsIcon style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => {
            navigate('/notifications')
          }} />
        </div>
        <div style={{position: 'relative'}}
          onClick={(e) => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          <img
            className="Profile-img"
            src={(image !== undefined && image !== '') ? image : "profile.jpeg"}
            alt=""
          />
          {verification === 'approved' && <abbr title="verified user">
            <img
              src="verify.png"
              height={20}
              style={{ right: "2px", top: '3px', height: '13px', width: '13px' }}
              alt="Your Alt Text"
              className="successIcons"
            />
          </abbr>}
        </div>
      </div>
      
      <div className="userDetails" ref={userDetailsRef}>
        <div
          className="closeIcon"
          onClick={() => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.remove("showUserDetails");
          }}
        >
          <i className="fas fa-times cross"></i>
        </div>
        <div>
          <div className="email">{email}</div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              style={{
                borderRadius: "50%",
                cursor: "pointer",
                maxWidth: "100%",
              }}
              src={(image !== undefined && image !== '') ? image : "profile.jpeg"}
              alt="Profile"
            />
            <i
              className="fas fa-pencil-alt edit-icon"
              onClick={handleClickOpen}
            ></i>
          </div>
        </div>

        <div className="username">Hi, {userName}!</div>
        <div className="manage">{role}</div>
        <div>
          <div>
            <div>
              <div
                className="Account"
                onClick={() => {
                  document
                    .getElementsByClassName("userDetails")[0]
                    .classList.remove("showUserDetails");
                  navigate(`/editProfile`);
                }}
              >
                <i
                  className="fas fa-user-edit"
                  style={{ marginRight: "5px" }}
                ></i>{" "}
                Edit Profile
              </div>
              <div
                className="logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: "5px" }}
                ></i>{" "}
                Logout
              </div>
              <div className="Privacy">Privacy Policy</div>
              <div className="dot">•</div>
              <div className="Terms">Terms of Service</div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{}}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {"Profile Picture"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <img
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  height: "150px",
                  width: "150px",
                }}
                src={(image !== undefined && image !== '') ? image : "Profile.jpeg" }
                alt="Profile"
              />
            </div>
            <div>
              <input type="file" name="" onChange={handleImage} />
            </div>
            <div style={{ display: "flex", gap: "2px", borderRadius: "10px" }}>

              <button onClick={submit} disabled = {changeImage ==''? true : false}>
                <i class="fas fa-upload" style={{marginRight: '5px'}}></i> Update
              </button>

              <button onClick={deleteImg}>
                <i class="fas fa-trash-alt" style={{marginRight: '5px'}}></i> Delete
              </button>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
