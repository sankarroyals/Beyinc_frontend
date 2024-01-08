import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './searchBox.css'
import { ApiServices } from '../../../Services/ApiServices'
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
const SearchBox = () => {
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
        setFilteredUsers(allUsers.filter((a)=> a.userName.includes(search)))
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
            "form": {...form, pitchId: form?._id}
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
        
    } , [email])

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
            <div  onClick={() => {
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
                    {filteredusers.length > 0 && filteredusers.filter(f=>f.email!==email).map((a) => (
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
                style={{}}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    {"Form"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div>
                            <form>
                                <div>
                                    <label>Pitch title*</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form?.title}
                                        onChange={handleChanges}
                                        placeholder="Enter title for pitch"
                                    />
                                </div>
                                <div>
                                    <label>Tags seperated with commas(ex: cost, fee,)*</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={form?.tags}
                                        onChange={handleChanges}
                                        placeholder="Enter tags for pitch *"
                                    />
                                </div>
                                <div>
                                    <label>Pitch Docs*</label>
                                    {form?.pitch?.secure_url !== undefined && form?.pitch?.secure_url !== '' &&
                                        <a href={form?.pitch.secure_url}>previous docs</a>}
                                    <input
                                        type="file"
                                        name="name"
                                        onChange={handleImage}
                                    />
                                </div>
                                <button type="submit" onClick={addconversation}>
                                    Send request
                                </button>

                            </form>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
       </div>
    )
}

export default SearchBox