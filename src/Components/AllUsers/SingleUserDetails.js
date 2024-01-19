
import React from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const SingleUserDetails = ({ d }) => {
    const { email } = useSelector(state => state.auth.loginDetails)

    const navigate = useNavigate()
    return (
        <Card sx={{ maxWidth: 340, minWidth: 250, boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', fontSize: '24px', flexWrap: 'wrap', gap: '5px' }}>
                <img className='userCardImage'
                    src={d.image !== undefined && d.image.url !== "" ? d.image.url : "/profile.jpeg"}
                    title={d.email}
                />
                <div>
                    <div style={{ fontWeight: '600', marginTop: '40px', marginLeft: '10px' }}>{d.role}
                        {d.verification == 'approved' && <img src='/verify.png' alt="" style={{ width: "15px", height: "15px", marginLeft: "5px" }} />}
                    </div>
                    <Typography gutterBottom component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>
                        {d.userName}
                    </Typography>
                </div>


            </div>
            <CardContent>
                {/* <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {d.userName}
                </Typography> */}
            </CardContent>
            {/* <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {d.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent> */}
            <CardActions>
                <Button id='view-request' size="small" onClick={() => {
                    navigate(`/singleProfileRequest/${d.email}`)
                }}>View Request</Button>
                {/* <Button size="small">Learn More</Button> */}
            </CardActions>
        </Card>
        

    )
}

export default SingleUserDetails