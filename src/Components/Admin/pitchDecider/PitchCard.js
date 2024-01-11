import React, { useEffect, useState } from 'react'


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ApiServices } from '../../../Services/ApiServices';
import { useNavigate } from 'react-router';
import PitchDetailsReadOnly from '../../Common/PitchDetailsReadOnly';
import { useDispatch } from 'react-redux';
import { setToast } from '../../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../../Toast/ToastColors';
import { AdminServices } from '../../../Services/AdminServices';

export default function PitchCard({ d }) {
    const navigate = useNavigate()
    const [pitchDetails, setPitchdetails] = useState(null)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)
    const [image, setImage] = React.useState('')
    const dispatch = useDispatch()
    React.useEffect(() => {
        ApiServices.getProfile({ email: d.email }).then(res => {
            setImage(res.data.image.url)
        })
    }, [d])

    const update = async (status) => {
        await AdminServices.updatePitch({ pitchId: d._id, status: status }).then((res) => {
            dispatch(
                setToast({
                    message: `Pitch Status Updated`,
                    bgColor: ToastColors.success,
                    visibile: "yes",
                })
            );
            setOpen(false)
            d.status = status
            setPitchdetails(prev=>({...prev, status: status}))

        }).catch(err => {
            setToast({
                message: 'Error occured when updating Pitch',
                bgColor: ToastColors.failure,
                visibile: "yes",
            })
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

    useEffect(() => {
        ApiServices.fetchSinglePitch({ pitchId: d._id }).then(res => {
            setPitchdetails(res.data)
        })
    }, [d])
    return (
        <Card sx={{ maxWidth: 345 }}>
            <div style={{ display: 'flex', fontSize: '24px', flexWrap: 'wrap', gap: '5px' }}>
                <img className='userCardImage'
                    src={image !== undefined && image !== "" ? image : "/profile.jpeg"}
                    title={d.email}
                />
                <div>{d.role}
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
                <Typography gutterBottom variant="h5" component="div">
                    {d.userName}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={()=>setOpen(true)}>View Pitch Request</Button>
                {/* <Button size="small">Learn More</Button> */}
                {open &&
                    <PitchDetailsReadOnly open={open} setOpen={setOpen} update={update} value={value} setValue={setValue} pitchDetails={pitchDetails} />
                }
            </CardActions>
        </Card>
    );
}