import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./searchBox.css";
import { ApiServices } from "../../../Services/ApiServices";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { getAllHistoricalConversations } from "../../../redux/Conversationreducer/ConversationReducer";
import { setLoading, setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import CloseIcon from "@mui/icons-material/Close";
import { Country, State, City } from 'country-state-city';

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { io } from "socket.io-client";
import { domainPitch, itPositions, techPitch } from "../../../Utils";
const gridCSS = {
  activeButton: {
    background: "#4297d3",
    color: "#ffffff",
    fontSize: "12px",
    border: "none",
    outline: "0px",
    cursor: "pointer",
    borderRadius: "3px",
    padding: "2px 3px",
  },
  inActiveButton: {
    background: "#ffffff",
    color: "#6d7888",
    fontSize: "12px",
    cursor: "pointer",
    border: "none",
    outline: "0px",
    padding: "2px 3px",
  },
  tabContainer: {
    padding: "15px",
    height: "95vh",
  },
  grid: {
    background: "#F8F8F8",
    padding: "10px 0px",
    borderRadius: "10px",
    margin: "0 !important",
    width: "100% !important",
  },
  head: {
    color: "#0071DC",
    fontSize: "12px",
    fontWeight: 600,
    font: "normal normal 600 12px/16px Segoe UI",
    marginBottom: "8px",
  },
  text: {
    color: "#3B3A39",
    fontSize: "12px",
    font: "normal normal 600 12px/16px Segoe UI",
  },
};
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SearchBox = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [tags, setTags] = useState([]);

  const [teamMembers, setTeamMembers] = useState([]);
  const [singleTeamMember, setSingleTeamMember] = useState({
    memberPic: "",
    name: "",
    bio: "",
    socialLink: "",
    position: "",
  });

  const [defaultTrigger, setdefaultTrigger] = useState(false);
  const [showPreviousFile, setShowPreviousFile] = useState(false);
  const [Teampic, setTeampic] = useState('')
  const [Logo, SetLogo] = useState('');
  const [Banner, SetBanner] = useState('');
  const [Business, SetBusiness] = useState('');
  const [Financial, SetFinancial] = useState('');

  const handleTeamMemberPic = (e) => {
    setTeampic(e.target.files[0].name)
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSingleTeamMember((prev) => ({ ...prev, memberPic: reader.result }));
      setForm((prev) => ({ ...prev, changeStatus: "change" }));
    };
  };

  const saveSingleMember = () => {
    setTeampic('')
    SetLogo('')
    SetBanner('')
    SetBusiness('')
    SetFinancial('')
    setTeamMembers((prev) => [...prev, singleTeamMember]);
    setSingleTeamMember({
      memberPic: "",
      name: "",
      bio: "",
      socialLink: "",
      position: "",
    });
    console.log(singleTeamMember);
  };

  const cancelSingleMember = () => {
    setSingleTeamMember({
      memberPic: "",
      name: "",
      bio: "",
      socialLink: "",
      position: "",
    });
  };

  const decidingRolesMessage = async (receiverMail) => {
    if (role === "Admin") {
      await ApiServices.directConversationCreation({
        email: email,
        receiverId: receiverMail,
        senderId: email,
        status: 'approved'
      })
        .then((res) => {
          dispatch(getAllHistoricalConversations(email));
          dispatch(
            setToast({
              message: res.data,
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          setOpen(false);
          setdefaultTrigger(!defaultTrigger);
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            setToast({
              message: `Error Occured`,
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    } else {
      console.log(process.env.REACT_APP_ADMIN_MAIL);
      if (verification == 'approved' && receiverMail !== process.env.REACT_APP_ADMIN_MAIL) {
        setOpen(true);
      } else if (receiverMail === process.env.REACT_APP_ADMIN_MAIL) {
        // addconversation()
        await ApiServices.directConversationCreation({
          email: email,
          receiverId: receiverMail,
          senderId: email,
          status: 'pending'
        })
          .then((res) => {
            dispatch(getAllHistoricalConversations(email));
            dispatch(
              setToast({
                message: res.data,
                bgColor: ToastColors.success,
                visible: "yes",
              })
            );
            socket.current.emit("sendNotification", {
              senderId: email,
              receiverId: receiverMail,
            });
            setOpen(false);
            setdefaultTrigger(!defaultTrigger);
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              setToast({
                message: `Error Occured`,
                bgColor: ToastColors.failure,
                visible: "yes",
              })
            );
          });
      } else {
        dispatch(
          setToast({
            message: `Please Verify Yourself first to create conversation`,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      }
    }
  };
  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  const socket = useRef();
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_IO);
  }, []);
  const [search, setSearch] = useState("");
  const allUsers = useSelector((state) => state.conv.allUsers);
  const { email, role, verification } = useSelector((state) => state.auth.loginDetails);
  const [filteredusers, setFilteredUsers] = useState([]);
  const userDetailsRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = useState({
    title: "",
    tags: "",
    changeStatus: "change",
    hiringPositions: []
  });
  const [file, setFile] = useState("");
  const [receiverMail, setReceivermail] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    setFilteredUsers(allUsers.filter((a) => a.userName.toLowerCase().includes(search.toLowerCase())));
  }, [search]);

  const handleChanges = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      changeStatus: "change",
    }));
  };

  const handlePitchBusiness = (e) => {
    SetBusiness(e.target.files[0].name)
    const file = e.target.files[0];
    setFileBase(file);
  };
  const setFileBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        pitch: reader.result,
      }));
    };
  };

  const handlePitchFinancials = (e) => {
    SetFinancial(e.target.files[0].name)
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        financials: reader.result,
      }));
    };
  };

  const handlePitchLogo = (e) => {
    SetLogo(e.target.files[0].name)
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        logo: reader.result,
      }));
    };
  };

  const handleBannerPic = (e) => {
    SetBanner(e.target.files[0].name)
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        banner: reader.result,
      }));
    };
  };

  const addconversation = async (e) => {
    // e.preventDefault();
    dispatch(setLoading({ visible: "yes" }));
    e.target.disabled = true;
    const conversation = {
      senderId: email,
      receiverId: receiverMail,
      pitch: file,
      email: email,
      role: role,
      form: { ...form, pitchId: form?._id },
      tags: tags,
      teamMembers: teamMembers,
      pitchRequiredStatus: "show",
    };
    await ApiServices.addConversation(conversation)
      .then((res) => {
        dispatch(getAllHistoricalConversations(email));
        console.log(res.data);
        dispatch(
          setToast({
            message: res.data,
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        setOpen(false);
        setdefaultTrigger(!defaultTrigger);
        e.target.disabled = false;
        socket.current.emit("sendNotification", {
          senderId: email,
          receiverId: receiverMail,
        });
        dispatch(setLoading({ visible: "no" }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            message: `Error Occured/try use different pitch title`,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = false;
        dispatch(setLoading({ visible: "no" }));
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
    document
      .getElementsByClassName("newConversation")[0]
      .classList.remove("show");
  };

  useEffect(() => {
    const getDefault = async () => {
      await ApiServices.getlastUpdatedPitch({ email: email })
        .then((res) => {
          console.log(res.data);
          if (res.data.length > 0) {
            setForm({
              ...res.data[0],
              pitchId: res.data[0]._id,
              changeStatus: "",
              tags: "",
            });
            setTags(res.data[0].tags);
            setTeamMembers(res.data[0].teamMembers);
          }
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: `Error Occured`,
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
    getDefault();
  }, [email, defaultTrigger]);

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target)
    ) {
      document
        .getElementsByClassName("newConversation")[0]
        .classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          className="newChat"
          onClick={() => {
            document
              .getElementsByClassName("newConversation")[0]
              .classList.toggle("show");
          }}
        >
          <div>
            <MapsUgcIcon style={{ fontSize: "24px" }} />{" "}
          </div>
          <div>New Chat</div>
        </div>

        <div title="Reload for latest request updates">
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : ""}
            onClick={() => {
              handleReloadClick();
              dispatch(getAllHistoricalConversations(email));
            }}
          />
        </div>
      </div>
      <div className="newConversation" ref={userDetailsRef}>
        <div>
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Users to message" autoComplete="off" aria-autocomplete="off"
          />
        </div>
        <div className="searchedUsers">
          {filteredusers.length > 0 &&
            filteredusers
              .filter((f) => f.email !== email)
              .map((a) => (
                <div
                  className="individuals"
                  onClick={() => {
                    setReceivermail(a.email);
                    decidingRolesMessage(a.email);
                  }}
                >
                  <div className="searchPic">
                    <img
                      src={
                        a.image === undefined || a.image == ""
                          ? "/profile.jpeg"
                          : a.image.url
                      }
                      alt=""
                      srcset=""
                    />
                    {a.verification === "approved" && (
                      <div
                        style={{
                          right: "8px",
                          top: "3px",
                          height: "13px",
                          width: "13px",
                          position: "absolute",
                        }}
                      >
                        <abbr title="verified user">
                          <img
                            src="/verify.png"
                            height={20}
                            style={{ height: "13px", width: "13px" }}
                            alt="Your Alt Text"
                            className=""
                          />
                        </abbr>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="userName">{a.userName}</div>
                    <div className="role">{a.role}</div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        sx={gridCSS.tabContainer}
        // sx={ gridCSS.tabContainer }
      >
        <DialogContent
          style={{
            height: "90vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
            }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </Box>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              height: "22px",
              marginBottom: "7.5px",
              border: "none",
              alignItems: "center",
            }}
          >
            <Tabs
              value={value}
              className="pitchTabs"
              textColor="primary"
              indicatorColor="secondary"
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Company Info"
                {...a11yProps(0)}
              />
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Pitch & Deal"
                {...a11yProps(1)}
              />
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Team"
                {...a11yProps(2)}
              />
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Image & videos"
                {...a11yProps(3)}
              />
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Documents"
                {...a11yProps(5)}
              />
              <Tab
                className="tabs"
                sx={{
                  width: "200px",
                  background: "none",
                  textTransform: "capitalize",
                  padding: "0px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                label="Requirements"
                {...a11yProps(6)}
              />
            </Tabs>
          </Box>
          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={0}
          >
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Pitch title*</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="title"
                    value={form?.title}
                    onChange={handleChanges}
                    placeholder="Enter title for pitch"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>Website</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="website"
                    value={form?.website}
                    onChange={handleChanges}
                    placeholder="Enter your website with https:// or http://"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>Where is management located ?</label>
                </div>
                <div>
                  <select
                    name="memberscountry"
                    value={form?.memberscountry}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {Country?.getAllCountries().length > 0 && Country?.getAllCountries().map(c => (
                      <option value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label>Industry 1</label>
                </div>
                <div>
                  <select
                    name="industry1"
                    value={form?.industry1}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {domainPitch.map(d => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>


              <div>
                <div>
                  <label>Industry 2</label>
                </div>
                <div>
                  <select
                    name="industry2"
                    value={form?.industry2}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {techPitch.map(d => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label>Stage</label>
                </div>
                <div>
                  <select
                    name="stage"
                    value={form?.stage}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>

                    <option value="pre/startup">Pre/Startup</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label>Ideal Investor Role</label>
                </div>
                <div>
                  <select
                    name="idealInvestor"
                    value={form?.idealInvestor}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>

                    <option value="investor">Investor Role</option>
                    <option value="mentor">mentor Role</option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label> How much did you raise in previous?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="previousRoundRaise"
                    value={form?.previousRoundRaise}
                    onChange={handleChanges}
                    placeholder="Enter how much did you raise in previous? *"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>How much are you raising in total?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="raising"
                    value={form?.raising}
                    onChange={handleChanges}
                    placeholder="Enter how much are you raising in total?"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>How much of this total you have raised?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="raised"
                    value={form?.raised}
                    onChange={handleChanges}
                    placeholder="Enter how much of this total you have raised?"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>What is the minimum investment per investor?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="minimumInvestment"
                    value={form?.minimumInvestment}
                    onChange={handleChanges}
                    placeholder="Enter the minimum investment per investor?"
                  />
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={1}
          >
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Short Summary</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="shortSummary"
                    value={form?.shortSummary}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>The Business</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="business"
                    value={form?.business}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>The Market</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="market"
                    value={form?.market}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Progress</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="progress"
                    value={form?.progress}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Objectives/Future</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="objectives"
                    value={form?.objectives}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={2}
          >
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Team Overview</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="teamOverview"
                    value={form?.teamOverview}
                    onChange={handleChanges}
                    rows={10}
                    cols={70}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Team Members</label>
                </div>
                {teamMembers.length > 0 && (
                  <div className="listedTeam">
                    {teamMembers.map((t, i) => (
                      <div className="singleMember">
                        {t?.memberPic?.secure_url !== undefined && (
                          <div>
                            <img src={t.memberPic?.secure_url} alt="" />
                          </div>
                        )}
                        <div>{t.name}</div>
                        <div
                          onClick={(e) => {
                            setTeamMembers(
                              teamMembers.filter((f, j) => i !== j)
                            );
                            setForm((prev) => ({
                              ...prev,
                              changeStatus: "change",
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="addTeamMembers">
                  <div className="teamInputs">
                    <div>
                      <div>
                        <label>Photo*</label>
                        <label htmlFor="photo" className="file">
                          <CloudUploadIcon />
                          <span className="fileName">{Teampic}</span>
                        </label>
                      </div>
                      <input
                        className="file"
                        type="file"
                        name="name"
                        id="photo"
                        onChange={handleTeamMemberPic}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Name*</label>
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={singleTeamMember?.name}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <div>
                        <label>Bio</label>
                      </div>
                      <input
                        type="text"
                        name="bio"
                        placeholder="Bio"
                        value={singleTeamMember?.bio}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Social Link</label>
                      </div>
                      <input
                        type="text"
                        name="socialLink"
                        placeholder="Social Links"
                        value={singleTeamMember?.socialLink}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            socialLink: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Position</label>
                      </div>
                      <input
                        type="text"
                        name="position"
                        placeholder="position"
                        value={singleTeamMember?.position}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "-20px" }}>
                      <button
                        onClick={saveSingleMember}
                        disabled={
                          singleTeamMember.name == "" ||
                          singleTeamMember.memberPic == ""
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={3}
          >
            <div className="pitchForm">
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>Logo*</label>
                  {form?.logo?.secure_url !== undefined &&
                    form?.logo?.secure_url !== "" && (
                      <a
                        href={form?.logo.secure_url}
                        style={{ display: "inline-block" }}
                      >
                       <img title='view Previous Logo'
                              style={{
                                height: "30px",
                                width: "30px",
                                marginLeft: '270px'
                              }}
                              src="/view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="logo" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Logo}</span>
                  </label>
                  <input
                    className="file"
                    type="file"
                    name="name"
                    id="logo"
                    onChange={handlePitchLogo}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>Banner Image</label>
                  {form?.banner?.secure_url !== undefined &&
                    form?.banner?.secure_url !== "" && (
                      <a
                        href={form?.banner.secure_url}
                        style={{ display: "inline-block" }}
                      >
                      <img title='view Previous Banner Image'
                              style={{
                                height: "30px",
                                width: "30px",
                                marginLeft: '210px',
                              }}
                              src="/view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="Banner" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Banner}</span>
                  </label>
                  <input
                    className="file"
                    id="Banner"
                    type="file"
                    name="name"
                    onChange={handleBannerPic}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={4}
          >
            <div className="pitchForm">
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>Pitch Docs/Business Plan*</label>
                  {form?.pitch?.secure_url !== undefined &&
                    form?.pitch?.secure_url !== "" && (
                      <a
                        href={form?.pitch.secure_url}
                        style={{ display: "inline-block" }}
                      >
                       <img title='view Previous Business Plan'
                              style={{
                                height: "30px",
                                width: "30px",
                                marginLeft: '110px'
                              }}
                              src="/view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                      </a>
                    )}
                </div>
                <div>
                <label htmlFor="Business" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Business}</span>
                  </label>
                  <input
                  className="file"
                  id="Business"
                    type="file"
                    name="name"
                    onChange={handlePitchBusiness}
                    style={{display: 'none'}}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>Financials*</label>
                  {form?.financials?.secure_url !== undefined &&
                    form?.financials?.secure_url !== "" && (
                      <a
                        href={form?.financials.secure_url}
                        style={{ display: "inline-block" }}
                      >
                       <img title='view Previous Financials'
                              style={{
                                height: "30px",
                                width: "30px",
                                marginLeft: '230px'
                              }}
                              src="/view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                      </a>
                    )}
                </div>
                <div>
                <label htmlFor="Financials" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Financial}</span>
                  </label>
                  <input
                  className="file"
                  id='Financials'
                    type="file"
                    name="name"
                    onChange={handlePitchFinancials}
                    style={{display: 'none'}}
                  />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel
            style={{ padding: 0 }}
            className="forecast-container"
            value={value}
            index={5}
          >
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Heading*</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="heading"
                    value={form?.heading}
                    onChange={handleChanges}
                    placeholder="Enter heading to show pitch"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>People needed ?</label>
                  {form.hiringPositions.length > 0 && (
                    <div className="listedTeam">
                      {form.hiringPositions.map((t, i) => (
                        <div className="singleMember">
                          
                          <div>{t}</div>
                          <div
                            onClick={(e) => {
 
                              setForm((prev) => ({
                                ...prev, hiringPositions: form.hiringPositions.filter((f, j) => i !== j),
                                changeStatus: "change",
                              }));
                            }}
                          >
                            <CloseIcon className="deleteMember" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!form.hiringPositions.includes(e.target.value)) {
                        setForm(prev => ({ ...form, hiringPositions: [...form.hiringPositions, e.target.value], changeStatus: 'change' }))
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {itPositions.map(h => (
                      <option value={h}>{h}</option>
                    ))}
                   
                  </select>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Description*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="description"
                    value={form?.description}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>
              <div>
                <div>
                  <label>Tags*</label>
                </div>
                <div>
                  {tags.length > 0 && (
                    <div className="listedTeam">
                      {tags.map((t, i) => (
                        <div className="singleMember">
                          <div>{t}</div>
                          <div
                            onClick={(e) => {
                              setTags(tags.filter((f, j) => i !== j));
                              setForm((prev) => ({
                                ...prev,
                                changeStatus: "change",
                              }));
                            }}
                          >
                            <CloseIcon className="deleteMember" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tags">
                  <div>
                    <input
                      type="text"
                      name="tags"
                      value={form?.tags}
                      onChange={handleChanges}
                      placeholder="Enter tags for pitch *"
                    />
                  </div>
                  <div
                    className="addtags"
                    onClick={() => {
                      if (form.tags !== "") {
                        setTags((prev) => [...prev, form.tags]);
                        setForm((prev) => ({
                          ...prev,
                          changeStatus: "change",
                          tags: "",
                        }));
                      }
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
              </div>
              {/* <div>
                <div>
                  <label>Do you want pich hide/show after pitch go live?</label>
                </div>
                <div>
                  <select
                    name="pitchRequiredStatus"
                    value={form?.pitchRequiredStatus}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    <option value="hide">Hide</option>
                    <option value="show">Show</option>
                  </select>
                </div>
              </div> */}
            </div>
          </TabPanel>

          {value == 5 ? (
            <div className="pitchSubmit">
              <button type="submit" onClick={addconversation}>
                Send request
              </button>
            </div>
          ) : (
            <div className="pitchSubmit">
              <button
                type="submit"
                onClick={() => {
                  if (value < 5) {
                    setValue((prev) => prev + 1);
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBox;
