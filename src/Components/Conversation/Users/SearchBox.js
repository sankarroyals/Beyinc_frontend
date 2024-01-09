import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './searchBox.css'
import { ApiServices } from '../../../Services/ApiServices'
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Tab, Tabs, Typography } from '@mui/material';

const gridCSS = {
    activeButton: {
        background: '#4297d3',
        color: '#ffffff',
        fontSize: '12px',
        border: 'none',
        outline: '0px',
        cursor: 'pointer',
        borderRadius: '3px',
        padding: '2px 3px',
    },
    inActiveButton: {
        background: '#ffffff',
        color: '#6d7888',
        fontSize: '12px',
        cursor: 'pointer',
        border: 'none',
        outline: '0px',
        padding: '2px 3px',
    },
    tabContainer: {
        padding: '15px',
        height: '95vh',
    },
    grid: {
        background: '#F8F8F8',
        padding: '10px 0px',
        borderRadius: '10px',
        margin: '0 !important',
        width: '100% !important',
    },
    head: {
        color: '#0071DC',
        fontSize: '12px',
        fontWeight: 600,
        font: "normal normal 600 12px/16px Segoe UI",
        marginBottom: "8px"
    },
    text: {
        color: '#3B3A39',
        fontSize: '12px',
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
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const SearchBox = () => {

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [search, setSearch] = useState('')
    const allUsers = useSelector(state => state.conv.allUsers)
    const { email } = useSelector(state => state.auth.loginDetails)
    const [filteredusers, setFilteredUsers] = useState([])
    const userDetailsRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = useState({
        title: '',
        tags: '',
        changeStatus: 'change'
    })
    const [file, setFile] = useState('');
    const [receiverMail, setReceivermail] = useState('')
    const handleClose = () => {
        setOpen(false);
    };
    const dispatch = useDispatch()
    useEffect(() => {
        setFilteredUsers(allUsers)
    }, [allUsers])

    useEffect(() => {
        setFilteredUsers(allUsers.filter((a) => a.userName.includes(search)))
    }, [search])

    const handleChanges = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value, changeStatus: 'change' }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setFileBase(file);
    };
    const setFileBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setForm((prev) => ({ ...prev, changeStatus: 'change', pitch: reader.result }));
        };
    };


    const addconversation = async (e) => {
        e.preventDefault();
        const conversation = {
            "senderId": email,
            "receiverId": receiverMail,
            "pitch": file,
            "email": email,
            "form": { ...form, pitchId: form?._id }
        }
        await ApiServices.addConversation(conversation).then((res) => {
            dispatch(getAllHistoricalConversations(email))
            console.log(res.data);
            dispatch(
                setToast({
                    message: res.data,
                    bgColor: ToastColors.success,
                    visibile: "yes",
                })
            )
            setOpen(false)
        }).catch((err) => {
            console.log(err);
            dispatch(
                setToast({
                    message: `Error Occured/try use different pitch title`,
                    bgColor: ToastColors.failure,
                    visibile: "yes",
                })
            )
        })
        setTimeout(() => {
            dispatch(
                setToast({
                    message: "",
                    bgColor: "",
                    visibile: "no",
                })
            );
        }, 4000);
        document.getElementsByClassName('newConversation')[0].classList.remove('show')

    }

    useEffect(() => {
        const getDefault = async () => {
            await ApiServices.getlastUpdatedPitch({ email: email }).then(res => {
                console.log(res.data);
                if (res.data.length > 0) {
                    setForm({ ...res.data[0], pitchId: res.data[0]._id, changeStatus: '', tags: res.data[0].tags.join(',') })
                }
            }).catch(err => {
                dispatch(
                    setToast({
                        message: `Error Occured`,
                        bgColor: ToastColors.failure,
                        visibile: "yes",
                    })
                )
            })
            setTimeout(() => {
                dispatch(
                    setToast({
                        message: "",
                        bgColor: "",
                        visibile: "no",
                    })
                );
            }, 4000);
        }
        getDefault()

    }, [email])

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
        <div style={{ position: 'relative' }} >
            <div onClick={() => {
                document.getElementsByClassName('newConversation')[0].classList.toggle('show')
            }}>
                <div className='newChat'>
                    <div><MapsUgcIcon /> </div>
                    <div>New Chat</div>
                </div>
            </div>
            <div className='newConversation' ref={userDetailsRef}>
                <div className="">
                    <input
                        type="text"
                        name="search"
                        id='search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Users to message"
                    />
                </div>
                <div className='searchedUsers'>
                    {filteredusers.length > 0 && filteredusers.filter(f => f.email !== email).map((a) => (
                        <div className='individuals' onClick={() => {
                            setReceivermail(a.email)
                            setOpen(true)
                        }}>
                            <div><img src={(a.image === undefined || a.image == '') ? 'profile.jpeg' : a.image.url} alt="" srcset="" /></div>
                            <div>
                                <div className='userName'>{a.userName}</div>
                                <div className='role'>{a.role}</div>
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
                maxWidth='xl'
                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >


                <DialogContent style={{ height: '90vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', marginTop: "20px", height: "22px", marginBottom: "7.5px", border: "none", alignItems: 'center' }}>
                        <Tabs value={value}
                            textColor="primary"
                            indicatorColor="secondary"
                            onChange={handleChange} aria-label="basic tabs example"
                        >
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Company Info" {...a11yProps(0)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Pitch & Deal" {...a11yProps(1)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Team" {...a11yProps(2)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Image & videos" {...a11yProps(3)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Documents" {...a11yProps(5)} />
                        </Tabs>
                    </Box>
                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={0}>

                        <div className='pitchForm'>
                            <div className='pitchformFields'>
                                <div><label>Pitch title*</label></div>
                                <div><input
                                    type="text"
                                    name="title"
                                    value={form?.title}
                                    onChange={handleChanges}
                                    placeholder="Enter title for pitch"
                                /></div>
                            </div>

                            <div>
                                <div><label>Website</label></div>
                                <div><input
                                    type="text"
                                    name="website"
                                    value={form?.website}
                                    onChange={handleChanges}
                                    placeholder="Enter your website with https:// or http://"
                                /></div>
                            </div>

                            <div>
                                <div><label>Where is management located ?</label></div>
                                <div>
                                    <select name="country" value={form?.country}
                                        onChange={handleChanges}>
                                        <option value="india">India</option>
                                        <option value="pakisthan">Pakisthan</option>
                                        <option value="canada">Canada</option>
                                        <option value="peru">Peru</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>Industry 1</label></div>
                                <div>
                                    <select name="industry1" value={form?.industry1}
                                        onChange={handleChanges}>
                                        <option value="tea">Tea</option>
                                        <option value="charcoal">Charcoal</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>Stage</label></div>
                                <div>
                                    <select name="stage" value={form?.stage}
                                        onChange={handleChanges}>
                                        <option value="pre/startup">Pre/Startup</option>
                                        <option value="medium">Medium</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>Ideal Investor Role</label></div>
                                <div>
                                    <select name="idealInvestor" value={form?.idealInvestor}
                                        onChange={handleChanges}>
                                        <option value="investor">Investor Role</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label> How much did you raise in previous?</label></div>
                                <div><input
                                    type="text"
                                    name="previousRoundRaise"
                                    value={form?.previousRoundRaise}
                                    onChange={handleChanges}
                                    placeholder="Enter tags for pitch *"
                                /></div>
                            </div>

                            <div>
                                <div><label>How much are you raising in total?</label></div>
                                <div><input
                                    type="text"
                                    name="raising"
                                    value={form?.raising}
                                    onChange={handleChanges}
                                    placeholder="Enter tags for pitch *"
                                /></div>
                            </div>

                            <div>
                                <div><label>How much of this total you have raised?</label></div>
                                <div><input
                                    type="text"
                                    name="raised"
                                    value={form?.raised}
                                    onChange={handleChanges}
                                    placeholder="Enter tags for pitch *"
                                /></div>
                            </div>

                            <div>
                                <div><label>What is the minimum investment per investor?</label></div>
                                <div><input
                                    type="text"
                                    name="minimumInvestment"
                                    value={form?.minimumInvestment}
                                    onChange={handleChanges}
                                    placeholder="Enter tags for pitch *"
                                /></div>
                            </div>

                            <div>
                                <div><label>Tags seperated with commas(ex: cost, fee,)*</label></div>
                                <div><input
                                    type="text"
                                    name="tags"
                                    value={form?.tags}
                                    onChange={handleChanges}
                                    placeholder="Enter tags for pitch *"
                                /></div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Pitch Docs*</label>{form?.pitch?.secure_url !== undefined && form?.pitch?.secure_url !== '' &&
                                    <a href={form?.pitch.secure_url} style={{ display: 'inline-block' }}>previous docs</a>}</div>
                                <div>
                                    <input
                                        type="file"
                                        name="name"
                                        onChange={handleImage}
                                    /></div>
                            </div>


                        </div>

                    </TabPanel>
                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={1}>

                        <div className='pitchForm'>
                            <div className='pitchformFields'>
                                <div><label>Short Summary</label></div>
                                <div><textarea
                                    type="text"
                                    name="shortSummary"
                                    value={form?.shortSummary}
                                    onChange={handleChanges}
                                   rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>The Business</label></div>
                                <div><textarea
                                    type="text"
                                    name="business"
                                    value={form?.business}
                                    onChange={handleChanges}
                                    rows={10} cols={80}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>The Market</label></div>
                                <div><textarea
                                    type="text"
                                    name="market"
                                    value={form?.market}
                                    onChange={handleChanges}
                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Progress</label></div>
                                <div><textarea
                                    type="text"
                                    name="progress"
                                    value={form?.progress}
                                    onChange={handleChanges}
                                    rows={10} cols={80}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Objectives/Future</label></div>
                                <div><textarea
                                    type="text"
                                    name="objectives"
                                    value={form?.objectives}
                                    onChange={handleChanges}
                                    rows={10} cols={80}
                                ></textarea></div>
                            </div>
                        </div>

                    </TabPanel>
                    {value == 4 ? <div className='pitchSubmit'>
                        <button type="submit" onClick={addconversation}>
                            Send request
                        </button>
                    </div> : <div className='pitchSubmit'>
                            <button type="submit" onClick={() => {
                                if (value < 4) {
                                    setValue(prev=>prev+1)
                                }
                        }}>
                            Next
                        </button>
                    </div>}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SearchBox