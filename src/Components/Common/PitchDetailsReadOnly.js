import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

import { Box, Dialog, DialogContent, Tab, Tabs, Typography } from '@mui/material'
import { gridCSS } from '../CommonStyles';
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
const PitchDetailsReadOnly = ({ open, setOpen, value, setValue, pitchDetails, update }) => {
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
                  <Box>Pitch Status: {pitchDetails?.status}</Box>
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
                                  <select disabled name="country" value={pitchDetails?.country}
                                  >
                                      <option value="">Select</option>
                                      <option value="india">India</option>
                                      <option value="pakisthan">Pakisthan</option>
                                      <option value="canada">Canada</option>
                                      <option value="peru">Peru</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <div><label>Industry 1</label></div>
                              <div>
                                  <select disabled name="industry1" value={pitchDetails?.industry1}
                                  >
                                      <option value="">Select</option>
                                      <option value="tea">Tea</option>
                                      <option value="charcoal">Charcoal</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <div><label>Stage</label></div>
                              <div>
                                  <select disabled name="stage" value={pitchDetails?.stage}
                                  >
                                      <option value="">Select</option>

                                      <option value="pre/startup">Pre/Startup</option>
                                      <option value="medium">Medium</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <div><label>Ideal Investor Role</label></div>
                              <div>
                                  <select disabled name="idealInvestor" value={pitchDetails?.idealInvestor}
                                  >
                                      <option value="">Select</option>

                                      <option value="investor">Investor Role</option>
                                      <option value="mentor">mentor Role</option>

                                  </select>
                              </div>
                          </div>

                          <div>
                              <div><label> How much did you raise in previous?</label></div>
                              <div><input disabled
                                  type="text"
                                  name="previousRoundRaise"
                                  value={pitchDetails?.previousRoundRaise}


                              /></div>
                          </div>

                          <div>
                              <div><label>How much are you raising in total?</label></div>
                              <div><input disabled
                                  type="text"
                                  name="raising"
                                  value={pitchDetails?.raising}


                              /></div>
                          </div>

                          <div>
                              <div><label>How much of this total you have raised?</label></div>
                              <div><input disabled
                                  type="text"
                                  name="raised"
                                  value={pitchDetails?.raised}


                              /></div>
                          </div>

                          <div>
                              <div><label>What is the minimum investment per investor?</label></div>
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
                              <div><label>Short Summary</label></div>
                              <div><textarea disabled
                                  type="text"
                                  name="shortSummary"
                                  value={pitchDetails?.shortSummary}

                                  rows={10} cols={50}
                              ></textarea></div>
                          </div>
                          <div className='pitchformFields'>
                              <div><label>The Business</label></div>
                              <div><textarea disabled
                                  type="text"
                                  name="business"
                                  value={pitchDetails?.business}

                                  rows={10} cols={80}
                              ></textarea></div>
                          </div>
                          <div className='pitchformFields'>
                              <div><label>The Market</label></div>
                              <div><textarea disabled
                                  type="text"
                                  name="market"
                                  value={pitchDetails?.market}

                                  rows={10} cols={50}
                              ></textarea></div>
                          </div>
                          <div className='pitchformFields'>
                              <div><label>Progress</label></div>
                              <div><textarea disabled
                                  type="text"
                                  name="progress"
                                  value={pitchDetails?.progress}

                                  rows={10} cols={80}
                              ></textarea></div>
                          </div>
                          <div className='pitchformFields'>
                              <div><label>Objectives/Future</label></div>
                              <div><textarea disabled
                                  type="text"
                                  name="objectives"
                                  value={pitchDetails?.objectives}

                                  rows={10} cols={80}
                              ></textarea></div>
                          </div>
                          <div>
                              <div><label>Tags seperated with commas(ex: cost, fee,)*</label></div>
                              <div><input disabled
                                  type="text"
                                  name="tags"
                                  value={pitchDetails?.tags}


                              /></div>
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
                                  <a target='_blank' href={pitchDetails?.logo.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>preview</a>}</div>

                          </div>

                          <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Banner Image</label>{pitchDetails?.banner?.secure_url !== undefined && pitchDetails?.banner?.secure_url !== '' &&
                                  <a target='_blank' href={pitchDetails?.banner.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>preview</a>}</div>

                          </div>

                      </div>

                  </TabPanel>


                  <TabPanel style={{ padding: 0 }} className="forecast-container" value={value} index={4}>

                      <div className='pitchForm'>
                          <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Pitch Docs/Business Plan*</label>{pitchDetails?.pitch?.secure_url !== undefined && pitchDetails?.pitch?.secure_url !== '' &&
                                  <a target='_blank' href={pitchDetails?.pitch.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>preview</a>}</div>

                          </div>

                          <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><label>Financials*</label>{pitchDetails?.financials?.secure_url !== undefined && pitchDetails?.financials?.secure_url !== '' &&
                                  <a target='_blank' href={pitchDetails?.financials.secure_url} style={{ display: 'inline-block' }} rel="noreferrer"><i class='fas fa-eye'></i>preview</a>}</div>

                          </div>

                      </div>

                  </TabPanel>



                  {value == 4 ? <div className='pitchSubmit' style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                      <button type="submit" onClick={() => update('approved')}>
                          Approve
                      </button>
                      <button type="submit" style={{ background: 'red' }} onClick={() => update('rejected')}>
                          Reject
                      </button>
                  </div> : <div className='pitchSubmit'>
                      <button type="submit" onClick={() => {
                          if (value < 4) {
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