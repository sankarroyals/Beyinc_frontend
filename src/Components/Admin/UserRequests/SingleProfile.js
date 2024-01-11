import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom/dist";
import "../../Editprofile/Editprofile.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";
import { AdminServices } from "../../../Services/AdminServices";
import { setLoginData, setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";

export const SingleRequestProfile = () => {


    const { email } = useParams();

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


    const [isLoading, setIsLoading] = useState(false);
    const [experienceDetails, setExperience] = useState({
        experience: '',
        job: '',
        qualification: '',
        fee: 1
    })

    const [oldDocs, setOldDocs] = useState({
        resume: "",
        expertise: "",
        acheivements: "",
        working: "",
        degree: "",
    });


    const navigate = useNavigate()


    useEffect(() => {
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
                }
            })
            .catch((error) => {
                dispatch(
                    setToast({
                        message: 'No User Found For Request',
                        bgColor: ToastColors.failure,
                        visibile: "yes",
                    })
                );
                navigate('/profileRequests')
            });
    }, [email]);




    const dispatch = useDispatch();




    const update = async (e, status) => {
        e.preventDefault();
        e.target.disabled = true;
        // setIsLoading(true);
        await AdminServices.updateVerification({
            email: email,
            status: status
        })
            .then((res) => {
                dispatch(
                    setToast({
                        message: `Profile Status changed to ${status}`,
                        bgColor: ToastColors.success,
                        visibile: "yes",
                    })
                );
                // setIsLoading(false);
                e.target.disabled = false
                navigate('/profileRequests')
            })
            .catch((err) => {
                e.target.disabled = false;
                dispatch(
                    setToast({
                        message: "Error occured when changing status",
                        bgColor: ToastColors.failure,
                        visibile: "yes",
                    })
                );
                // setIsLoading(false);
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


    return (
        <div className="update-container" style={{minHeight: '80vh'}}>
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
                {role == 'Mentor' && <div className="update-form-container">
                    <form className="update-form">
                        <h3 className="update-heading">Experience / Fee Negotiation</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div>
                                    <label className="update-form-label">Experience</label>
                                </div>
                                <div>
                                    <input disabled type="text" value={experienceDetails.experience} name="experience" id="" placeholder="Enter Your Experience" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className="update-form-label">Profession</label>
                                </div>
                                <div>
                                    <input disabled type="text" name="job" value={experienceDetails.job} id="" placeholder="Enter Your Profession" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className="update-form-label">Qualification</label>
                                </div>
                                <div>
                                    <input disabled type="text" name="qualification" id="" value={experienceDetails.qualification} placeholder="Enter Your Qualification" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className="update-form-label">Fee request</label>
                                </div>
                                <div>
                                    <input disabled type="range" min={1} max={50} name="fee" value={experienceDetails.fee} id="" placeholder="Enter Fee request per minute" /> &#8377; {experienceDetails.fee} / per min
                                </div>
                            </div>
                        </div>

                    </form>
                </div>}
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
                                marginLeft: "30px",
                                marginTop: "5px",
                            }}
                        >
                            <button type="submit" onClick={(e) => update(e,'rejected')} style={{ whiteSpace: 'nowrap', position: 'relative' }}>
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
                            <button type="submit" onClick={(e)=>update(e,'approved')} style={{ whiteSpace: 'nowrap', position: 'relative' }}>
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
        </div>
    );
};
