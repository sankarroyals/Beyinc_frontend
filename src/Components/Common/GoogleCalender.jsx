import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { gridCSS } from "../CommonStyles";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import './GoogleCalender.css'
export const GoogleCalenderEvent = ({ gmeetLinkOpen, setGmeetLinkOpen, receiver }) => {
    const gapi = window.gapi;
    const google = window.google;
    const [startDate, setStartDate] = useState('')
    const [EndDate, setEndDate] = useState('')
    const dispatch = useDispatch()
    const {email} = useSelector(state=>state.auth.loginDetails)

    const CLIENT_ID = process.env.REACT_APP_CALENDER_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_CALENDER_API_KEY;
    const DISCOVERY_DOC =
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    const [accessToken, setAccessToken] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);

    useEffect(() => {
        // console.log(localStorage.getItem("access_token"));
        setAccessToken(localStorage.getItem("access_token"))
        setExpiresIn(localStorage.getItem("expires_in"));
    }, [])

    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);
  

    useEffect(() => {
        //const expiryTime = new Date().getTime() + expiresIn * 1000;
        
        gapiLoaded();
        gisLoaded();
    }, [accessToken]);

    function gapiLoaded() {
        gapi.load("client", initializeGapiClient);
    }

    async function initializeGapiClient() {
        // console.log(accessToken);
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true)
        // gapiInited = true;

        if (accessToken && expiresIn) {
            gapi.client.setToken({
                access_token: accessToken,
                expires_in: expiresIn,
            });
            listUpcomingEvents();
        }
    }

    function gisLoaded() {
        console.log(google?.accounts?.oauth2?.initTokenClient({
            client_id:
                CLIENT_ID,
            scope: SCOPES,
            callback: "", // defined later
        }));
        setTokenClient(google?.accounts?.oauth2?.initTokenClient({
            client_id:
                CLIENT_ID,
            scope: SCOPES,
            callback: "", // defined later
        }));

        setGapiInited(true)
    }

    //Enables user interaction after all libraries are loaded.

    function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error) {
                throw resp;
            }
            await listUpcomingEvents();
            const { access_token, expires_in } = gapi.client.getToken();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("expires_in", expires_in);
            setAccessToken(access_token)
            setExpiresIn(expires_in);
        };

        if (!(accessToken && expiresIn)) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            console.log(tokenClient);
            tokenClient?.requestAccessToken({ prompt: "consent" });
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient?.requestAccessToken({ prompt: "" });
        }
    }

    //Sign out the user upon button click.

    function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken("");
            localStorage.clear();
        }
    }

    async function listUpcomingEvents() {
        let response;
        try {
            const request = {
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
            };
            response = await gapi.client.calendar.events.list(request);
        } catch (err) {
            // document.getElementById("content").innerText = err.message;
            return;
        }

        const events = response.result.items;
        if (!events || events.length === 0) {
            // document.getElementById("content").innerText = "No events found.";
            return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) =>
                `${str}${event.summary} (${event.start.dateTime || event.start.date
                })\n`,
            "Events:\n"
        );
        // document.getElementById("content").innerText = output;
    }

    function addManualEvent(e) {
        e.target.disabled=true
        const event = {
            kind: "calendar#event",
            summary: `Meeting with ${email}`,
            location: "",
            description: "Pitch discussion",
            start: {
                dateTime: new Date(startDate).toISOString(),
                timeZone: "Asia/Kolkata", // Update to your specific time zone
            },
            end: {
                dateTime: new Date(EndDate).toISOString(),
                timeZone: "Asia/Kolkata", // Update to your specific time zone
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
            attendees: [
                { email: receiver, responseStatus: "needsAction" },
            ],
            reminders: {
                useDefault: true,
            },
            conferenceData: {
                createRequest: {
                    requestId: "sample123",
                    conferenceSolutionKey: {
                        type: "hangoutsMeet"
                    },
                }
            },
            guestsCanSeeOtherGuests: false,
        };

        const request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
        });
        request.execute(
            (event) => {
                console.log(event);
                console.log(`https://meet.google.com/${event.conferenceData.conferenceId}`);
                e.target.disabled = false
                setGmeetLinkOpen(false)
                dispatch(setToast({
                    visible: 'yes', message: 'Meeting created', bgColor: ToastColors.success
                }))
                setStartDate('')
                setEndDate('')
            },
            (error) => {
                console.error(error);
                e.target.disabled = false
            }
        );
        
    }
    return (
        <div>
            {/* <button
                id="authorize_button"
                hidden={accessToken && expiresIn}
                onClick={handleAuthClick}
            >
                Authorize
            </button>
            <button
                id="add_manual_event"
                hidden={!accessToken && !expiresIn}
                onClick={addManualEvent}
            >
                Add Event
            </button>
            <pre id="content" style={{ whiteSpace: "pre-wrap", display: 'none' }}></pre> */}

            <Dialog
                open={gmeetLinkOpen}
                onClose={() => setGmeetLinkOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='xl'
                sx={gridCSS.tabContainer}
            // sx={ gridCSS.tabContainer }
            >
                <DialogContent style={{ height: '90vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <button
                        id="authorize_button"
                        hidden={accessToken && expiresIn}
                        onClick={handleAuthClick}
                    >
                        Authorize
                    </button>
                    {/* <button
                        id="add_manual_event"
                        hidden={!accessToken && !expiresIn}
                        onClick={handleSignoutClick}
                    >
                        Signout
                    </button> */}
                    {(accessToken && expiresIn) &&
                        <>
                        <h2>Schedule the meeting</h2>  
                        <input type="datetime-local" name="" value={startDate} id="" onChange={(e) => {
                            setStartDate(e.target.value)
                            setEndDate('')
                        }} />
                        <input type="datetime-local" min={startDate} value={EndDate} name="" id="" onChange={(e) => setEndDate(e.target.value)} />
                        <button className="schedulerbtnn"
                            id="add_manual_event"
                            hidden={!accessToken && !expiresIn}
                            onClick={addManualEvent}
                            disabled={startDate==''||EndDate==''}
                        >
                            Add Event
                        </button></>}
                   
                    <pre id="content" style={{ whiteSpace: "pre-wrap", display: 'none' }}></pre>
                </DialogContent>
            </Dialog>
        </div>
    );
};
