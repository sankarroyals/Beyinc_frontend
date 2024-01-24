import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import '../Conversation/Users/searchBox.css'
import '../Conversation/Notification/Notification.css'
import { Box, Dialog, DialogContent, Tab, Tabs, Typography } from '@mui/material'
import { gridCSS } from '../CommonStyles';
import { useSelector } from 'react-redux'
import { Country, State, City } from 'country-state-city';
import { idealUserRole, stages } from '../../Utils'

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


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
const PitchDetailsReadOnly = ({ open, setOpen, value, setValue, pitchDetails, update, approve, reject, setStatus, status }) => {
    const { role } = useSelector(state => state.auth.loginDetails)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const totalRoles = useSelector(state => state.auth.totalRoles)
    console.log(pitchDetails);
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
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
                    <Box><b>Pitch Status:</b> {pitchDetails?.status} <span title={pitchDetails?.pitchRequiredStatus == 'show' ? 'visible to all users' : 'not visible to all users'}>
                        {pitchDetails?.pitchRequiredStatus == 'show' ? <i class="fas fa-eye"></i> : <i class="fas fa-eye-slash"></i>}
                    </span></Box>
                    <Box sx={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer' }} onClick={() => setOpen(false)}><CloseIcon /></Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', marginTop: "20px", height: "22px", marginBottom: "7.5px", border: "none", alignItems: 'center' }}>
                        <Tabs value={value} className='pitchTabs'
                            textColor="primary"
                            indicatorColor="secondary"
                            onChange={handleChange} aria-label="basic tabs example"
                        >
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Company Info" {...a11yProps(0)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Pitch & Deal" {...a11yProps(1)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Team" {...a11yProps(2)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Image & videos" {...a11yProps(3)} />
                            <Tab className='tabs' sx={{ width: '200px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label="Documents" {...a11yProps(5)} />
                            <Tab
                                className="tabs"
                                sx={{
                                    width: "200px",
                                    background: "none",
                                    textTransform: "capitalize",
                                    padding: "0px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                }}
                                label="Requirements"
                                {...a11yProps(6)}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={0}>

                        <div className='pitchForm'>
                            <div className='pitchformFields'>
                                <div><label>Pitch title*</label></div>
                                <div><input disabled
                                    type="text"
                                    name="title"
                                    value={pitchDetails?.title}


                                /></div>
                            </div>

                            <div>
                                <div><label>Website</label></div>
                                <div><input disabled
                                    type="text"
                                    name="website"
                                    value={pitchDetails?.website}


                                /></div>
                            </div>

                            <div>
                                <div><label>Where is management located ?</label></div>
                                <div>
                                    <select
                                        name="memberscountry"
                                        value={pitchDetails?.memberscountry}
                                        disabled
                                    >
                                        <option value="">Select</option>
                                        {Country?.getAllCountries().length > 0 && Country?.getAllCountries().map(c => (
                                            <option value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>Domain</label></div>
                                <div>
                                    <input disabled
                                        type="text"
                                        name="industry 1"
                                        value={pitchDetails?.industry1}


                                    />
                                    
                                </div>
                            </div>
                            <div>
                                <div><label>Sub domain</label></div>
                                <div>
                                    <input disabled
                                        type="text"
                                        name="industry 2"
                                        value={pitchDetails?.industry1}


                                    />
                                </div>
                            </div>

                            <div>
                                <div><label>Stage</label></div>
                                <div>
                                    <select disabled name="stage" value={pitchDetails?.stage}
                                    >
                                        <option value="">Select</option>

                                        {stages.map(d => (
                                            <option value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>User Type</label></div>
                                <div>
                                    <select disabled name="userType" value={pitchDetails?.userType}
                                    >
                                        <option value="">Select</option>

                                        {totalRoles.map(d => (
                                            <option value={d.role}>{d.role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>Ideal User Role</label></div>
                                <div>
                                    <select disabled name="idealInvestor" value={pitchDetails?.idealInvestor}
                                    >
                                        <option value="">Select</option>

                                        {idealUserRole.map(d => (
                                            <option value={d}>{d}</option>
                                        ))}

                                    </select>
                                </div>
                            </div>

                            <div>
                                <div><label>  How much in total have you raised till now?</label></div>
                                <div><input disabled
                                    type="text"
                                    name="previousRoundRaise"
                                    value={pitchDetails?.previousRoundRaise}


                                /></div>
                            </div>

                            <div>
                                <div><label style={{ width: '300px', whiteSpace: 'wrap' }}>How much total equity in % is diluted for raising above amount?</label></div>
                                <div><input disabled
                                    type="text"
                                    name="raising"
                                    value={pitchDetails?.raising}


                                /></div>
                            </div>

                            {/* <div>
                                <div><label>How much of this total you have raised?</label></div>
                                <div><input disabled
                                    type="text"
                                    name="raised"
                                    value={pitchDetails?.raised}


                                /></div>
                            </div> */}

                            <div>
                                <div><label style={{ width: '650px', whiteSpace: 'wrap' }}>What and estimated amount you are offering to User (Entrepreneur/Mentor/Investor) who
                                    accept this Pitch? Like: Equity , Cash etc.</label></div>
                                <div><input disabled
                                    type="text"
                                    name="minimumInvestment"
                                    value={pitchDetails?.minimumInvestment}


                                /></div>
                            </div>




                        </div>

                    </TabPanel>
                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={1}>

                        <div className='pitchForm'>
                            <div className='pitchformFields'>
                                <div><label>Overview of Startup</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="overViewOfStartup"
                                    value={pitchDetails?.overViewOfStartup}

                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Business Model</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="businessModel"
                                    value={pitchDetails?.businessModel}

                                    rows={10} cols={80}
                                ></textarea></div>
                            </div>

                            <div className='pitchformFields'>
                                <div><label>Revenue Model</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="revenueModel"
                                    value={pitchDetails?.revenueModel}

                                    rows={10} cols={80}
                                ></textarea></div>
                            </div>

                            <div className='pitchformFields'>
                                <div><label>Target Market</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="targetMarket"
                                    value={pitchDetails?.targetMarket}

                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Target Users</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="targetUsers"
                                    value={pitchDetails?.targetUsers}

                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>USP</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="usp"
                                    value={pitchDetails?.usp}

                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Competitor Analysis</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="usp"
                                    value={pitchDetails?.competitorAnalysis}

                                    rows={10} cols={50}
                                ></textarea></div>
                            </div>
                            

                        </div>

                    </TabPanel>

                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={2}>

                        <div className='pitchForm'>
                            <div className='pitchformFields'>
                                <div><label>Team Overview</label></div>
                                <div><textarea disabled
                                    type="text"
                                    name="teamOverview"
                                    value={pitchDetails?.teamOverview}

                                    rows={10} cols={90}
                                ></textarea></div>
                            </div>
                            <div className='pitchformFields'>
                                <div><label>Team Members</label></div>
                                {pitchDetails?.teamMembers?.length > 0 &&
                                    <div className='listedTeam'>
                                        {pitchDetails?.teamMembers?.map((t, i) => (
                                            <div className='singleMember notifySingleMember'>
                                                {t?.memberPic?.secure_url !== undefined && <div>
                                                    <img className='viewSingleMember' src={t.memberPic?.secure_url} alt="" />
                                                </div>}
                                                <div>{t.name}</div>
                                                <div>
                                                    {t?.socialLink !== '' &&
                                                        <a href={t.socialLink}>{t.socialLink}</a>
                                                    }
                                                </div>
                                                <div>Bio: {t?.bio}</div>

                                                <div>Position as {t.position}</div>


                                            </div>
                                        ))}
                                    </div>
                                }

                            </div>

                        </div>

                    </TabPanel>


                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={3}>

                        <div className='pitchForm'>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Logo*</label>{pitchDetails?.logo?.secure_url !== undefined && pitchDetails?.logo?.secure_url !== '' &&
                                    <a target='_blank' href={pitchDetails?.logo.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>Preview</a>}</div>

                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Banner Image</label>{pitchDetails?.banner?.secure_url !== undefined && pitchDetails?.banner?.secure_url !== '' &&
                                    <a target='_blank' href={pitchDetails?.banner.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>Preview</a>}</div>

                            </div>

                        </div>

                    </TabPanel>


                    <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={4}>

                        <div className='pitchForm'>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Pitch Docs/Business Plan*</label>{pitchDetails?.pitch?.secure_url !== undefined && pitchDetails?.pitch?.secure_url !== '' &&
                                    <a target='_blank' href={pitchDetails?.pitch.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>Preview</a>}</div>

                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Financials*</label>{pitchDetails?.financials?.secure_url !== undefined && pitchDetails?.financials?.secure_url !== '' &&
                                    <a target='_blank' href={pitchDetails?.financials.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>Preview</a>}</div>

                            </div>

                        </div>

                    </TabPanel>
                    <TabPanel
                        style={{ padding: 0 }}
                        className="forecast-container"
                        value={value}
                        index={5}
                    >
                        <div className="pitchForm">
                            <div className="pitchformFields">
                                <div>
                                    <label>Heading*</label>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="heading"
                                        value={pitchDetails?.heading}
                                        disabled
                                        placeholder="Enter heading to show pitch"
                                    />
                                </div>
                            </div>


                            <div>
                                <div>
                                    <label>People needed ?</label>
                                </div>
                                {pitchDetails?.hiringPositions?.length > 0 && (
                                    <div className="listedTeam">
                                        {pitchDetails?.hiringPositions?.map((t, i) => (
                                            <div className="singleMember">

                                                <div>{t}</div>
                                               
                                               
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="pitchformFields">
                                <div>
                                    <label>Description*</label>
                                </div>
                                <div>
                                    <textarea
                                        type="text"
                                        name="description"
                                        value={pitchDetails?.description}
                                        disabled
                                        rows={10}
                                        cols={80}
                                    ></textarea>
                                </div>
                            </div>
                            <div>
                                <div><label>Tags seperated with commas(ex: cost, fee,)*</label></div>
                                <div><input disabled
                                    type="text"
                                    name="tags"
                                    value={pitchDetails?.tags}


                                /></div>
                            </div>
                            
                                <div>
                                    <div>
                                        <label>Do you want pich hide/show after pitch go live?</label>
                                    </div>
                                    <div>
                                        <select
                                        name="pitchRequiredStatus" value={(status == '' || status==undefined) ? pitchDetails?.pitchRequiredStatus : status}
                                            disabled={role == 'Admin' || window.location.pathname !== '/userPitches' || (pitchDetails?.status !== 'approved')}
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="hide">Hide</option>
                                            <option value="show">Show</option>
                                        </select>
                                    </div>
                                </div>

                            

                        </div>
                    </TabPanel>



                    {value == 5 ? <div className='pitchSubmit' style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                        {approve && <button type="submit" onClick={(e) => update(e, 'approved')}>
                            {approve}
                        </button>}
                        {reject && <button type="submit" style={{ background: 'red' }} onClick={(e) => update(e, 'rejected')}>
                            {reject}
                        </button>}
                    </div> : <div className='pitchSubmit'>
                        <button type="submit" onClick={() => {
                            if (value < 5) {
                                setValue(prev => prev + 1)
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

export default PitchDetailsReadOnly