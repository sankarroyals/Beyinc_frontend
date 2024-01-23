import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../../Services/ApiServices'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../../Toast/ToastColors'
import { format } from 'timeago.js'
import '../Users/searchBox.css'
import CloseIcon from '@mui/icons-material/Close'

import PitchDetailsReadOnly from '../../Common/PitchDetailsReadOnly'
import { Box, Dialog, DialogContent } from '@mui/material'
import { gridCSS } from '../../CommonStyles'


const MessageRequest = ({ m, setMessageRequest }) => {
    const { email,userName } = useSelector(state => state.auth.loginDetails)
    const [pitchDetails, setPitchdetails] = useState(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)
    const [reasonPop, setReasonPop] = useState(false)
    const [reason, setReason] = useState('')



    const dispatch = useDispatch()

    const update = async (e, status) => {
        e.target.disabled = true
        if (status == 'approved' || (status == 'rejected' && reason !== '')) {
            await ApiServices.updateUserMessageRequest({ conversationId: m._id, status: status, rejectReason: reason }).then((res) => {

                dispatch(
                    setToast({
                        message: `Message request ${status}`,
                        bgColor: ToastColors.success,
                        visible: "yes",
                    })
                );
                setMessageRequest(prev => [...prev.filter((f) => f._id !== m._id)])
                e.target.disabled = false
                setReasonPop(false)

            }).catch(err => {
                setToast({
                    message: 'Error occured when updating request',
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
                e.target.disabled = false

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
        ApiServices.fetchSinglePitch({ pitchId: m.pitchId }).then(res => {
            setPitchdetails(res.data)
        })
    }, [m])

    return (
        <div className='individualrequest'>
            <div className='individualrequestWrapper'>
                <div><b>{m.members?.filter((f) => f.userName !== userName)[0].userName}</b> sent you a message request</div>
                <div className='updateActions'>
                    <div style={{fontSize: '12px'}}><b><i className='fas fa-clock' style={{fontSize: '16px'}}></i>
{format(m.createdAt)}</b></div>
                    <attr title='Preview Pitch Details'>
                        <div className='extraDetails'
                            onClick={() => {
                                setOpen(true)
                            }}
                        ><i class="fas fa-eye"></i></div>
                    </attr>
                </div>
                {open &&
                    <PitchDetailsReadOnly approve='Approve Chat Request' reject='Reject' open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />
                }

                <Dialog
                    open={reasonPop}
                    onClose={()=> setReasonPop(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth='xl'
                    sx={gridCSS.tabContainer}
                // sx={ gridCSS.tabContainer }
                >


                    <DialogContent style={{  position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <Box><b>Enter Reason for rejection</b></Box>
                        <Box sx={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={() => setReasonPop(false)}><CloseIcon /></Box>
                        <Box>
                            <input type="text" name="" value={reason} id="" onChange={(e)=> setReason(e.target.value)} />
                        </Box>
                        <button type="submit" disabled={reason==''} onClick={(e) => {
                               update(e, 'rejected')
                            }}>
                                Ok
                            </button>
                        
                    </DialogContent>
                </Dialog>
            </div>

        </div>
    )
}

export default MessageRequest