import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./searchBox.css";
import { ApiServices } from "../../../Services/ApiServices";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { getAllHistoricalConversations } from "../../../redux/Conversationreducer/ConversationReducer";
import { setLoading, setToast } from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";

import CachedIcon from "@mui/icons-material/Cached";
import { io } from "socket.io-client";
import { socket_io } from "../../../Utils";
import AddPitch from "../../Common/AddPitch";


const SearchBox = () => {


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
  const [Teampic, setTeampic] = useState('')
  const [Logo, SetLogo] = useState('');
  const [Banner, SetBanner] = useState('');
  const [Business, SetBusiness] = useState('');
  const [Financial, SetFinancial] = useState('');

  const [isSpinning, setSpinning] = useState(false);
  const handleReloadClick = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  const [search, setSearch] = useState("");
  const allUsers = useSelector((state) => state.conv.allUsers);
  const { email } = useSelector((state) => state.auth.loginDetails);
  const [filteredusers, setFilteredUsers] = useState([]);
  const userDetailsRef = useRef(null);

  const [receiverMail, setReceivermail] = useState("");
  const [receiverRole, setreceiverRole] = useState("");


  const dispatch = useDispatch();
  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    setFilteredUsers(allUsers.filter((a) => a.userName.toLowerCase().includes(search.toLowerCase())));
  }, [search]);



  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) && event.target.id !== 'newchat' && event.target.id !== 'Profile-img'
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="newChatContainer">
        <div id='newchat'
          className="newChat"
          onClick={() => {
            document
              .getElementsByClassName("newConversation")[0]
              .classList.toggle("show");
          }}
        >
          <div id='newchat'>
            <MapsUgcIcon style={{ fontSize: "24px" }} />{" "}
          </div>
          <div id='newchat'>New Chat</div>
        </div>

        <div title="Reload for latest request updates">
          <CachedIcon
            style={{ cursor: "pointer" }}
            className={isSpinning ? "spin" : "spinText"}
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
                    setreceiverRole(a.role)
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

      <AddPitch receiverMail={receiverMail} setReceivermail={setReceivermail} receiverRole={receiverRole} />
    </div>
  );
};

export default SearchBox;
