import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './searchBox.css'
import { ApiServices } from '../../../Services/ApiServices'
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
const SearchBox = () => {
    const [search, setSearch] = useState('')
    const allUsers = useSelector(state => state.conv.allUsers)
    const { email } = useSelector(state => state.auth.loginDetails)
    const [filteredusers, setFilteredUsers] = useState([])
    const userDetailsRef = useRef(null);

    const dispatch = useDispatch()
    useEffect(() => {
        setFilteredUsers(allUsers)
    }, [allUsers])

    useEffect(() => {
        setFilteredUsers(allUsers.filter((a)=> a.userName.includes(search)))
    }, [search])


    const addconversation = async (receiver) => {
        const conversation = {
            "senderId": email,
            "receiverId": receiver
        }
        await ApiServices.addConversation(conversation).then((res) => {
            dispatch(getAllHistoricalConversations(email))
            dispatch(
                setToast({
                    message: `Request sent to ${receiver}`,
                    bgColor: ToastColors.success,
                    visibile: "yes",
                })
            )
        }).catch((err) => {
            console.log(err);
            dispatch(
                setToast({
                    message: `Error while sending Request to ${receiver}`,
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
                        <div className='individuals' onClick={() => addconversation(a.email)}>
                            <div><img src={a.image === undefined ? 'Profile.jpeg' : a.image.url} alt="" srcset="" /></div>
                            <div>
                                <div className='userName'>{a.userName}</div>
                                <div className='role'>{a.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
       </div>
    )
}

export default SearchBox