import React, { useEffect, useState, useRef } from 'react'


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ApiServices } from '../../../Services/ApiServices';
import { useNavigate } from 'react-router';
import PitchDetailsReadOnly from '../../Common/PitchDetailsReadOnly';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close'

import { io } from "socket.io-client";
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { AdminServices } from '../../../Services/AdminServices';
import { socket_io } from '../../../Utils';
import { Box, Dialog, DialogContent } from '@mui/material';
import { gridCSS } from '../../CommonStyles';
export default function PitchCard({ d }) {
    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);
    const { email } = useSelector(state => state.auth.loginDetails)
    const navigate = useNavigate()
    const [pitchDetails, setPitchdetails] = useState(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)
    const dispatch = useDispatch()
    const [reasonPop, setReasonPop] = useState(false)
    const [reason, setReason] = useState('')
    // React.useEffect(() => {
    //     ApiServices.getProfile({ email: d.email }).then(res => {
    //         setImage(res.data.image.url)
    //     })
    // }, [d])

    const update = async (e, status) => {
        e.target.disabled = true
        if (status == 'approved' || (status == 'rejected' && reason !== '')) {
            await AdminServices.updatePitch({ pitchId: d._id, status: status, reason: reason }).then((res) => {

                dispatch(
                    setToast({
                        message: `Pitch Status Updated`,
                        bgColor: ToastColors.success,
                        visible: "yes",
                    })
                );
                socket.current.emit("sendNotification", {
                    senderId: email,
                    receiverId: d.email,
                });
                setOpen(false)
                d.status = status
                setPitchdetails(prev => ({ ...prev, status: status }))
                e.target.disabled = false
                setReasonPop(false)


            }).catch(err => {
                setToast({
                    message: 'Error occured when updating Pitch',
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            })
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
    }

    useEffect(() => {
        setPitchdetails(d)
    }, [d])
    return (
        <><Card sx={{ maxWidth: 340, minWidth: 250, boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', fontSize: '24px', flexWrap: 'wrap', gap: '5px' }}>
                <img className='userCardImage'
                    src={d.profile_pic !== undefined && d.profile_pic !== "" ? d.profile_pic : "/profile.jpeg"}
                    title={d.email} />
                <div style={{ fontWeight: '600', marginTop: '40px', marginLeft: '30px' }}>{d.role}
                    <div title={d.status}>
                        <span style={{
                            fontSize: '14px', marginLeft: '5px', color: d.status == 'approved' ? 'green' : (d.status == 'pending' ? 'orange' : 'red'),
                            border: `1px dotted ${d.status == 'approved' ? 'green' : (d.status == 'pending' ? 'orange' : 'red')}`,
                            padding: '3px'
                        }}>{d.status}</span>
                    </div>
                </div>

            </div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {d.userName}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" id='view-request' onClick={() => setOpen(true)}>View Pitch Request</Button>
                {/* <Button size="small">Learn More</Button> */}
                {open &&
                    <PitchDetailsReadOnly approve='Make Live' reject='Reject' open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />}
            </CardActions>
        </Card>
            <Dialog
            open={reasonPop}
            onClose={() => setReasonPop(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth='xl'
            sx={gridCSS.tabContainer}
        >


                <DialogContent style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <Box><b>Enter Reason for rejection</b></Box>
                    <Box sx={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={() => setReasonPop(false)}><CloseIcon /></Box>
                    <Box>
                        <input type="text" name="" value={reason} id="" onChange={(e) => setReason(e.target.value)} />
                    </Box>
                    <button type="submit" disabled={reason == ''} onClick={(e) => {
                        update(e, 'rejected');
                    } }>
                        Ok
                    </button>

                </DialogContent>
            </Dialog></>
    );
}