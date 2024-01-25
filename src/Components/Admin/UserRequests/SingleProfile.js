import { useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom/dist";
import "../../Editprofile/Editprofile.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";
import { AdminServices } from "../../../Services/AdminServices";
import { setLoading, setLoginData, setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { convertToDate, socket_io } from "../../../Utils";
import { Box, Dialog, DialogContent } from "@mui/material";
import { gridCSS } from "../../CommonStyles";

export const SingleRequestProfile = () => {
    const { visible } = useSelector(state => state.auth.LoadingDetails);

    const { email } = useParams();
    const [skills, setSkills] = useState([])

    const [inputs, setInputs] = useState({

        email: null,
        emailOtp: null,
        mobile: null,
        mobileOtp: null,
        name: null,
        role: null,
        image: null,
        isMobileOtpSent: null,
        isEmailOtpSent: null,
        emailVerified: null,
        mobileVerified: null,
        isEmailValid: null,
        isMobileValid: null,
        isNameValid: null,
    });

    const {
        mobile,
        mobileOtp,
        name, image, role,
        isMobileOtpSent,
        mobileVerified,
        updatedAt,
    } = inputs;

    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);


    const [isLoading, setIsLoading] = useState(false);
    const [experienceDetails, setExperience] = useState({
        experience: '',
        job: '',
        qualification: '',
        fee: 1
    })
    const [totalExperienceData, setTotalExperienceData] = useState([])
    const [totalEducationData, setTotalEducationData] = useState([])
    const [fee, setFee] = useState('')
    const [bio, setBio] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [town, settown] = useState('')
    const [oldDocs, setOldDocs] = useState({
        resume: "",
        expertise: "",
        acheivements: "",
        working: "",
        degree: "",
    });

    const [languagesKnown, setlanguagesKnown] = useState([])
    const [singlelanguagesKnown, setSinglelanguagesKnown] = useState('')


    const navigate = useNavigate()


    useEffect(() => {
        dispatch(setLoading({ visible: "yes" }))
        AdminServices.getApprovalRequestProfile({ email: email })
            .then((res) => {
                console.log(res.data);
                setInputs((prev) => ({
                    ...prev,
                    updatedAt: res.data.updatedAt,
                    name: res.data.userName,
                    mobile: res.data.phone,
                    role: res.data.role, image: res.data.image?.url || '', status: res.data.verification,
                    mobileVerified: true,
                }));


                if (res.data.documents !== undefined) {
                    setOldDocs((prev) => ({
                        ...prev,
                        resume: res.data.documents.resume,
                        expertise: res.data.documents.expertise,
                        acheivements: res.data.documents.acheivements,
                        working: res.data.documents.working,
                        degree: res.data.documents.degree,
                    }));
                }
                setTotalEducationData(res.data.educationDetails || [])
                setTotalExperienceData(res.data.experienceDetails || [])
                setFee(res.data.fee || '')
                setBio(res.data.bio || '')
                settown(res.data.town || '')
                setCountry(res.data.country || '')
                setState(res.data.state || '')
                dispatch(setLoading({ visible: "no" }))
                setSkills(res.data.skills || [])
                setlanguagesKnown(res.data.languagesKnown || [])


            })
            .catch((error) => {
                dispatch(
                    setToast({
                        message: 'No User Found For Request',
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
                dispatch(setLoading({ visible: "no" }))
                navigate('/profileRequests')
            });
    }, [email]);




    const dispatch = useDispatch();

    const [reasonPop, setReasonPop] = useState(false)
    const [reason, setReason] = useState('')


    const update = async (e, status) => {
        e.preventDefault();
        e.target.disabled = true;
        // setIsLoading(true);
        if (status == 'approved' || (status == 'rejected' && reason !== '')) {
            await AdminServices.updateVerification({
                email: email,
                status: status, reason: reason
            })
                .then((res) => {
                    dispatch(
                        setToast({
                            message: `Profile Status changed to ${status}`,
                            bgColor: ToastColors.success,
                            visible: "yes",
                        })
                    );
                    socket.current.emit("sendNotification", {
                        senderId: jwtDecode(JSON.parse(localStorage.getItem('user')).accessToken).email,
                        receiverId: email,
                    });
                    // setIsLoading(false);
                    e.target.disabled = false
                    navigate('/profileRequests')
                    setReasonPop(false)
                    setReason('')

                })
                .catch((err) => {
                    e.target.disabled = false;
                    dispatch(
                        setToast({
                            message: "Error occured when changing status",
                            bgColor: ToastColors.failure,
                            visible: "yes",
                        })
                    );
                    // setIsLoading(false);
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
            e.target.disabled = false
            setReasonPop(true)
        }
    };


    return (
        visible === "no" &&
        <div className="update-container" style={{ minHeight: '80vh' }}>
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
                            {name}
                        </div>
                        <div
                            style={{ fontSize: "12px", color: "#717B9E", marginBottom: "40px" }}
                        >
                            Profile requested -{" "}
                            <span style={{ color: "black" }}>
                                <i class="fas fa-clock" style={{ marginRight: '5px' }}></i>
                                {format(updatedAt)}
                            </span>
                            <span style={{
                                marginLeft: '5px', color: inputs.status == 'approved' ? 'green' : (inputs.status == 'pending' ? 'orange' : 'red'),
                                border: `1px dotted ${inputs.status == 'approved' ? 'green' : (inputs.status == 'pending' ? 'orange' : 'red')}`,
                                padding: '5px'
                            }}>{inputs.status}</span>
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

                            </div>
                        </div>
                    </div>
                </div>

                <>
                    {totalExperienceData.length > 0 && <div className="update-form-container" style={{ flexDirection: 'column' }}>

                        <h3 className="update-heading">Work Experience</h3>

                        {totalExperienceData.length > 0 &&
                            totalExperienceData.map((te, i) => (
                                <div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                                            <div className="company">
                                                {te.company}
                                            </div>
                                            <div className="profession">
                                                {te.profession}
                                            </div>
                                            <div className="timeline">
                                                {convertToDate(te.start)}-{te.end == '' ? 'Present' : convertToDate(te.end)}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            ))
                        }
                    </div>}
                </>
                {totalEducationData.length > 0 && <div className="update-form-container" style={{ flexDirection: 'column' }}>
                    <form className="update-form">
                        <h3 className="update-heading">Educational Details</h3>

                    </form>

                    {totalEducationData.length > 0 &&
                        totalEducationData.map((te, i) => (
                            <div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                                        <div className="company">
                                            {te.college}
                                        </div>
                                        <div className="profession">
                                            {te.grade}
                                        </div>
                                        <div className="timeline">
                                            {convertToDate(te.Edstart)}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))
                    }

                </div>}

                <div className="update-form-container">
                    <form className="update-form">
                        <h3 className="update-heading">Personal / Fee Negotiation</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                            <div>
                                <div>
                                    <label className="update-form-label">Country</label>
                                </div>
                                <div>
                                    <input type="text" value={country} disabled />
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="update-form-label">State</label>
                                </div>
                                <div>
                                    <input type="text" value={state} disabled />
                                </div>

                            </div>

                            <div>
                                <div>
                                    <label className="update-form-label">Town/city</label>
                                </div>
                                <div>
                                    <input type="text" value={town} disabled />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className="update-form-label">Bio</label>
                                </div>
                                <div>
                                    <textarea name="bio" cols={45} value={bio} id="" disabled placeholder="Enter your bio" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className="update-form-label">Skills</label>
                                </div>
                                <div>
                                    {skills?.length > 0 && (
                                        <div className="listedTeam">
                                            {skills?.map((t, i) => (
                                                <div className="singleMember">
                                                    <div>{t}</div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div>
                                <div>
                                    <label className="update-form-label">Languages Known</label>
                                </div>
                                <div>
                                    {languagesKnown?.length > 0 && (
                                        <div className="listedTeam">
                                            {languagesKnown?.map((t, i) => (
                                                <div className="singleMember">
                                                    <div>{t}</div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {role == 'Mentor' && <div>
                                <div>
                                    <label className="update-form-label">Fee request</label>
                                </div>
                                <div>
                                    <input type="range" min={1} max={50} name="fee" value={fee} id="" disabled placeholder="Enter Fee request per minute" /> &#8377; {fee} / per min
                                </div>
                            </div>}
                        </div>

                    </form>
                </div>
                <div className="update-form-container" >
                    <form className="update-form" >
                        <h3 className="update-heading">Requested files</h3>



                        <div
                            style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
                        >
                            <div>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                                >
                                    <label className="update-form-label">Resume</label>
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
                                                        src="/view.png"

                                                    />
                                                </a>
                                            </attr>
                                        )}
                                </div>

                            </div>

                            <div>
                                <div>
                                    <div
                                        style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                                    >
                                        <label className="update-form-label">Acheivements</label>
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
                                                            src="/view.png"

                                                        />
                                                    </a>
                                                </attr>
                                            )}
                                    </div>

                                </div>
                            </div>

                            <div>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                                >
                                    <label className="update-form-label">Degree</label>
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
                                                        src="/view.png"

                                                    />
                                                </a>
                                            </attr>
                                        )}
                                </div>
                            </div>

                            <div>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                                >
                                    <label className="update-form-label">Expertise</label>
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
                                                        src="/view.png"

                                                    />
                                                </a>
                                            </attr>
                                        )}
                                </div>

                            </div>

                            <div>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: 'space-between' }}
                                >
                                    <label className="update-form-label">Working</label>
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
                                                        src="/view.png"

                                                    />
                                                </a>
                                            </attr>
                                        )}
                                </div>

                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "25%",
                                gap: "10px",
                                marginTop: "15px",
                            }}
                        >
                        <button type="button" className="back-button" onClick={() => navigate(-1)}>Back</button>

                            <button type="submit" className="reject-button" onClick={(e) => update(e, 'rejected')} style={{ whiteSpace: 'nowrap', position: 'relative' }} disabled = {inputs.status === "rejected"}>
                                {/* {isLoading ? (
                                    <>
                                        <img
                                            src="/loading-button.gif"
                                            style={{ height: "20px", width: "20px", position: 'absolute', left: '-10px', top: '12px' }}
                                            alt="Loading..."
                                        />
                                        <span style={{ marginLeft: "12px" }}>Rejecting...</span>
                                    </>
                                ) : ( */}
                                <>Reject</>
                                {/* )} */}
                            </button>
                            <button type="submit" onClick={(e) => update(e, 'approved')} style={{ whiteSpace: 'nowrap', position: 'relative' }} disabled={inputs.status === "approved"}>
                                {isLoading ? (
                                    <>
                                        <img
                                            src="/loading-button.gif"
                                            style={{ height: "20px", width: "20px", position: 'absolute', left: '-10px', top: '12px' }}
                                            alt="Loading..."
                                        />
                                        <span style={{ marginLeft: "12px" }}>Approving...</span>
                                    </>
                                ) : (
                                    <>Approve</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Dialog
                open={reasonPop}
                onClose={() => setReasonPop(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='xl'
                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >


                <DialogContent style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <Box><b>Enter Reason for rejection</b></Box>
                    <Box sx={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={() => setReasonPop(false)}><CloseIcon /></Box>
                    <Box>
                        <input type="text" name="" value={reason} id="" onChange={(e) => setReason(e.target.value)} />
                    </Box>
                    <button type="submit" disabled={reason == ''} onClick={(e) => {
                        update(e, 'rejected')
                    }}>
                        Ok
                    </button>

                </DialogContent>
            </Dialog>
        </div>

    );
};
