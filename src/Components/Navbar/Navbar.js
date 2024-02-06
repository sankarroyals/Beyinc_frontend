import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import axiosInstance from "../axiosInstance";
import { setLoginData, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { Howl } from "howler";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { io } from "socket.io-client";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  getAllNotifications,
  setNotification,
} from "../../redux/Conversationreducer/ConversationReducer";
import { Drawer, Tab, Tabs, Typography } from "@mui/material";
import MessageRequest from "../Conversation/Notification/MessageRequest";
import { format } from "timeago.js";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { className, children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={className}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Navbar = () => {
  const { email, role, userName, image, verification } = useSelector(
    (store) => store.auth.loginDetails
  );

  const sound = new Howl({
    src: ["/send.mp3"],
  });

  const [messageRequest, setMessageRequest] = useState([]);

  const notifications = useSelector((state) => state.conv.notifications);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isMobile, setIsMobile] = useState(window.outerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.outerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const notificationAlert = useSelector(
    (state) => state.conv.notificationAlert
  );
  useEffect(() => {
    if (notificationAlert) {
      sound.play();
    }
  }, [notificationAlert]);
  const [notificationDrawerState, setNotificationDrawerState] = useState({
    right: false,
  });
  const getNotifys = async () => {
    await ApiServices.getUserRequest({ email: email }).then((res) => {
      setMessageRequest(res.data);
    });
    dispatch(getAllNotifications(email));
  };

  useEffect(() => {
    if (notificationDrawerState.right == true) {
      getNotifys();
    }
  }, [notificationDrawerState]);

  const [drawerState, setDrawerState] = useState({
    right: false,
    // Add other anchors if needed (left, top, bottom)
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const toggleNotificationDrawer = (anchor, open) => (event) => {
    dispatch(setNotification(false));
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setNotificationDrawerState({ ...drawerState, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {isMobile && (
          <>
            <ListItem button key="home" onClick={() => navigate("/home")}>
              <ListItemIcon>
                <i className="fas fa-home"></i>
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              key="conversations"
              onClick={() => navigate("/conversations")}
            >
              <ListItemIcon>
                <i className="far fa-comment-alt"></i>
              </ListItemIcon>
              <ListItemText primary="Conversations" />
            </ListItem>
          </>
        )}

        {isMobile && <>
          <ListItem
            button
            key="searchUsers"
            onClick={() => navigate("/searchusers")}
          >
            <ListItemIcon>
              <SearchOutlinedIcon
                id="searchusers"
                className="icon"
              ></SearchOutlinedIcon>
            </ListItemIcon>
            <ListItemText primary="Search Users" />
          </ListItem>

          <ListItem
            button
            key="livePitches"
            onClick={() => navigate("/livePitches")}
          >
            <ListItemIcon>
              <QuestionAnswerOutlinedIcon
                id="livePitches"
                className="icon"
              ></QuestionAnswerOutlinedIcon>
            </ListItemIcon>
            <ListItemText primary="Live Pitches" />
          </ListItem>
        </>}

        {role === "Admin" && (
          <>
            <ListItem
              button
              key="profileRequests"
              onClick={() => navigate("/profileRequests")}
            >
              <ListItemIcon>
                <i className="fas fa-users"></i>
              </ListItemIcon>
              <ListItemText primary="Profile Requests" />
            </ListItem>

            <ListItem button key="pitches" onClick={() => navigate("/pitches")}>
              <ListItemIcon>
                <i className="far fa-file"></i>
              </ListItemIcon>
              <ListItemText primary="Pitch Request" />
              {role === "Admin" && <i className="fas fa-plus" id="plus"></i>}
            </ListItem>
          </>
        )}

        {role !== "Admin" && (
          <ListItem
            button
            key="userPitches"
            onClick={() => navigate("/userPitches")}
          >
            <ListItemIcon>
              <i className="far fa-file"></i>
            </ListItemIcon>
            <ListItemText primary="User Pitch" />
          </ListItem>
        )}
      </List>
    </Box>
  );
  const NotificationList = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        overFlowX: "hidden", 
      }}
      role="presentation"
    >
      <Tabs
        value={value}
        className="pitchTabs"
        style={{ width: "500px" }}
        textColor="primary"
        indicatorColor="secondary"
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab
          className="tabs"
          sx={{
            width: "250px",
            background: "none",
            textTransform: "capitalize",
            padding: "0px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          label={`Notifications (${notifications?.length})`}
          {...a11yProps(1)}
        />
        <Tab
          className="tabs"
          sx={{
            width: "250px",
            background: "none",
            textTransform: "capitalize",
            padding: "0px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          label={`Message Requests (${messageRequest?.length})`}
          {...a11yProps(0)}
        />
      </Tabs>
      <TabPanel style={{ padding: 0 }} className="" value={value} index={0}>
        {notifications.map((n) => (
          <>
            <div
              className={`individualrequest`}
              onClick={() => {
                navigate(`/user/${n.senderInfo?.email}`);
              }}
              style={{ width: "500px", marginLeft: "15px", textAlign: "start" }}
            >
              <div
                className="individualrequestWrapper"
                style={{ gap: "5px", alignItems: "center", width: "100%" }}
              >
                <div>
                  <img
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                    }}
                    src={
                      n.senderInfo?.image?.url == undefined
                        ? "/profile.jpeg"
                        : n.senderInfo?.image?.url
                    }
                    alt=""
                    srcset=""
                  />
                </div>
                <div>{n.message} </div>
              </div>
            </div>
            <div className="divider"></div>
          </>
        ))}
      </TabPanel>
      <TabPanel style={{ padding: 0 }} className="" value={value} index={1}>
        {(messageRequest.length > 0 || notifications.length > 0) && (
          <>
            <div>
              {messageRequest?.map((m) => (
                <>
                  <MessageRequest m={m} setMessageRequest={setMessageRequest} />
                  <div className="divider"></div>
                </>
              ))}
            </div>
          </>
        )}
      </TabPanel>
    </Box>
  );

  const [open, setOpen] = React.useState(false);
  const userDetailsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const [originalImage, setOriginalImage] = useState("");
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert(
        `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
      );
      e.target.value = null; // Clear the selected file
      return;
    }
    setOriginalImage(file.name);
    setFileBase(file);
  };
  const setFileBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setchangeImage(reader.result);
    };
  };

  const submit = async (e) => {
    e.target.disabled = true;
    setIsLoading(true);
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
            visible: "yes",
          })
        );
        e.target.disabled = false;
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image upload",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        setIsLoading(false);
        e.target.disabled = false;
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
            visible: "yes",
          })
        );
        e.target.disabled = false;
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error during image delete",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = false;
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

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "editProfile" &&
      event.target.id !== "Profile-img"
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

  useEffect(() => {
    console.log(window.location.pathname.slice(1));

    if (document.getElementsByClassName("navSelected")?.length > 0) {
      document
        .getElementsByClassName("navSelected")[0]
        ?.classList.remove("navSelected");
    }
    if (document.getElementsByClassName("highletNavImg")?.length > 0) {
      document
        .getElementsByClassName("highletNavImg")[0]
        ?.classList.remove("highletNavImg");
    }

    if (window.location.pathname.slice(1) !== "editProfile") {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.classList.add("navSelected");
    } else {
      document
        .getElementById(window.location.pathname.slice(1))
        ?.children[0].classList.add("highletNavImg");
    }
  }, [window.location.pathname]);

  return (
    <div
      className="navbar"
      style={{ display: email == undefined ? "none" : "flex" }}
    >
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <img id="logoImage" src={localStorage.getItem('theme') == 'light' ? "/Footer-Logo.png" : "/Footer-Logo.png"} alt="logo" />
      </div>

      <div className="menuIcons">
        {isMobile || (
          <>
            <div title="Home">
              <HomeOutlinedIcon
                id="home"
                className="icon"
                onClick={() => {
                  navigate("/home");
                }}
              ></HomeOutlinedIcon>
            </div>
            <div style={{ position: "relative" }} title="Conversations">
              {" "}
              <ChatBubbleOutlineOutlinedIcon
                id="conversations"
                className="icon"
                onClick={() => {
                  navigate("/conversations");
                }}
              ></ChatBubbleOutlineOutlinedIcon>
              <div
                className="Conversations-count"
                title="unread conversations"
              ></div>
            </div>

            <div title="Search Users">
              <SearchOutlinedIcon
                id="searchusers"
                className="icon"
                onClick={() => navigate("/searchusers")}
              ></SearchOutlinedIcon>
            </div>

            <div title="Live Pitches">
              <QuestionAnswerOutlinedIcon
                id="livePitches"
                className="icon"
                onClick={() => navigate("/livePitches")}
              ></QuestionAnswerOutlinedIcon>
            </div>

            <div title="Notifications">
              <NotificationsNoneIcon
                id="notifications"
                className="icon"
                onClick={toggleNotificationDrawer("right", true)}
              >
                {notificationAlert && <div className="blinkBall"> </div>}
              </NotificationsNoneIcon>
            </div>

            <Drawer
              anchor="right"
              open={notificationDrawerState["right"]}
              onClose={toggleNotificationDrawer("right", false)}
              onOpen={toggleNotificationDrawer("right", true)}
            >
              {NotificationList("right")}
            </Drawer>
          </>
        )}
        {isMobile && (
          <div id="notifications" className="icon">
            <i
              className="far fa-bell"
              title="notifications"
              onClick={() => {
                navigate("/notifications");
              }}
            ></i>
            {notificationAlert && <div className="blinkBall"> </div>}
          </div>
        )}

        {/* DARK AND WHITE THEME */}
        {/* <div
          id=""
          className="icon"
          title={`Switch to ${
            localStorage.getItem("theme") === "light" ? "Dark" : "Light"
          } Mode`}
          onClick={(e) => {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const mode = newTheme === "light" ? "Dark" : "Light";

            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            document.getElementById("themeIcon").className = `fas fa-${
              newTheme == "light" ? "moon" : "sun"
            }`;

            // Switching the logo based on the theme
            const logoImg = document.getElementById("logoImage");
            logoImg.src =
              newTheme === "light" ? "/Footer-Logo.png" : "/Footer-Logo.png";
            logoImg.alt = `${mode} Logo`;

            e.currentTarget.title = `Switch to ${mode} Mode`;
          }}
        >
          <i
            id="themeIcon"
            class={`fas fa-${
              localStorage.getItem("theme") == "light" ? "moon" : "sun"
            }`}
          ></i>
        </div> */}

        <div
          id="editProfile"
          style={{ position: "relative" }}
          onClick={(e) => {
            document
              .getElementsByClassName("userDetails")[0]
              .classList.toggle("showUserDetails");
          }}
        >
          <img
            title={`${userName} \n ${email}`}
            id="Profile-img"
            className="Profile-img"
            src={image !== undefined && image !== "" ? image : "/profile.jpeg"}
            alt=""
          />
          {verification === "approved" && (
            <abbr title="verified user">
              <img
                src="/verify.png"
                height={20}
                style={{
                  right: "2px",
                  top: "3px",
                  height: "13px",
                  width: "13px",
                }}
                alt="Your Alt Text"
                className="successIcons"
              />
            </abbr>
          )}
        </div>

        <div className="userDetails" ref={userDetailsRef}>
          <span className="line-loader"></span>
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
                src={
                  image !== undefined && image !== "" ? image : "/profile.jpeg"
                }
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
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  <i
                    className="fas fa-sign-out-alt"
                    style={{ marginRight: "5px" }}
                  ></i>{" "}
                  Logout
                </div>
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
            <b> {"Profile Picture"}</b>
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
                  src={
                    image !== undefined && image !== ""
                      ? image
                      : "/profile.jpeg"
                  }
                  alt="Profile"
                />
              </div>

              <div>
                <label htmlFor="profilePic" className="profileImage">
                  <CloudUploadIcon />
                  <span className="fileName">{originalImage || "Upload"}</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.webp"
                  name=""
                  id="profilePic"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "2px", borderRadius: "10px" }}
              >
                <button
                  onClick={submit}
                  style={{ whiteSpace: "nowrap", position: "relative" }}
                  disabled={changeImage === "" && isLoading}
                >
                  {isLoading ? (
                    <>
                      <img
                        src="/loading-button.gif"
                        style={{
                          height: "20px",
                          width: "20px",
                          position: "absolute",
                          left: "55px",
                          marginTop: "-4px",
                        }}
                        alt="Loading..."
                      />
                      <span style={{ marginLeft: "10px" }}>Updating...</span>
                    </>
                  ) : (
                    <>
                      <i
                        className="fas fa-upload"
                        style={{ marginRight: "5px", top: "-5px" }}
                      ></i>{" "}
                      Update
                    </>
                  )}
                </button>

                <button onClick={deleteImg}>
                  <i
                    class="fas fa-trash-alt"
                    style={{ marginRight: "5px" }}
                  ></i>{" "}
                  Delete
                </button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {/* Button to open the right drawer */}
        <div onClick={toggleDrawer("right", true)}>
          <i className="fas fa-bars" title="Menu"></i>
        </div>

        {/* Swipeable Drawer for right anchor */}
        <Drawer
          anchor="right"
          open={drawerState["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          {list("right")}
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
