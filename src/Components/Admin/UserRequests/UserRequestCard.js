import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ApiServices } from '../../../Services/ApiServices';
import { useNavigate } from 'react-router';

export default function UserRequestCard({ d }) {
    const navigate = useNavigate()
    // const [image, setImage] = React.useState('')
    // React.useEffect(() => {
    //     ApiServices.getProfile({ email: d.email }).then(res => {
    //         setImage(res.data.image.url)
    //     })
    // }, [d])
    return (
        <Card sx={{ maxWidth: 345 }}>
            <div style={{display: 'flex', fontSize: '24px', flexWrap: 'wrap', gap: '5px'}}>
                <img className='userCardImage'
                    src={d.image !== undefined && d.image !== "" ? d.image : "/profile.jpeg"}
                    title={d.email}
                />
                <div>{d.role}
                    <div title={d.verification}>
                        <span style={{
                            fontSize: '14px', marginLeft: '5px', color: d.verification == 'approved' ? 'green' : (d.verification == 'pending' ? 'orange' : 'red'),
                            border: `1px dotted ${d.verification == 'approved' ? 'green' : (d.verification == 'pending' ? 'orange' : 'red')}`,
                            padding: '3px'
                        }}>{d.verification}</span>
                </div>
                </div>
                
            </div>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {d.userName}
                </Typography>
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
                <Button size="small" onClick={() => {
                    navigate(`/singleProfileRequest/${d.email}`)
                }}>View Request</Button>
                {/* <Button size="small">Learn More</Button> */}
            </CardActions>
        </Card>
    );
}