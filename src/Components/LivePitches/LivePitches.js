import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import CloseIcon from "@mui/icons-material/Close";
import '../Conversation/Users/searchBox.css'
import './LivePitches.css'
import SinglePitchetails from './SinglePitchDetails'
import { useSelector } from 'react-redux'

import { CheckBox } from '@mui/icons-material'
import { itPositions } from '../../Utils'
const LivePitches = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [filters, setFilters] = useState({
        hiringPositions: [],
        tags: [],
        intrested: false,
    })
    const { email } = useSelector(state => state.auth.loginDetails)

    const [tag, settag] = useState('')
    const dispatch = useDispatch()
    useEffect(() => {
        ApiServices.livePitches().then(res => {
            console.log(res.data);
            setData(res.data)
        }).catch(err => {
            dispatch(
                setToast({
                    message: "Error Occured",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
        })
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            filterUsers()
        }
    }, [data, filters])

    const filterUsers = () => {

        let filteredData = [...data]
        console.log(filters);
        if (Object.keys(filters).length > 0) {
            Object.keys(filters).map((ob) => {
                if (filters[ob].length > 0 || ob == 'intrested') {
                    if (ob !== 'tags' && ob !== 'intrested' && ob !== 'hiringPositions' ) {
                        filteredData = filteredData.filter(f => filters[ob].includes(f[ob]))
                    } else if (ob === 'tags' || ob == 'hiringPositions') {
                        filteredData = filteredData.filter(item => {
                            const itemdata = item[ob].map(t => t.toLowerCase()) || [];
                            return filters[ob].some(tag => itemdata.includes(tag.toLowerCase()));
                        });
                    } else if (ob == 'intrested') {
                        if (filters[ob]) {
                            filteredData = filteredData.filter(item => {
                                const intrest = item.intrest || [];
                                return intrest?.filter(f => f.email == email).length>0 ? true : false
                            });
                        }
                    }
                }
            })
        }
        console.log(filteredData);
        setFilteredData(filteredData);
    }
    return (
        <div className='livePitchesContainer'>
            <div className='livePitchesWrapper'>
                <div className='filterContainer'>
                    <div className='filterHeader'>Filter By:</div>
                    <div className='tagFilter'>
                        <div>People required:</div>
                        {filters.hiringPositions?.length > 0 && (
                            <div className="listedTeam">
                                {filters.hiringPositions.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, hiringPositions: [...filters.hiringPositions.filter((f, j) => i !== j)] })
                                                );
                                            }}
                                        >
                                            <CloseIcon className="deleteMember" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='inputTag'>
                            <select 
                                name="hiringPositions"
                                // value={form?.hiringPositions}
                                onChange={(e) => {
                                    if (!filters.hiringPositions.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, hiringPositions: [...filters.hiringPositions, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {itPositions.map(h => (
                                    <option value={h}>{h}</option>
                                ))}

                            </select>
                            
                        </div>
                    </div>
                    <div className='tagFilter'>
                        <div>Tags</div>
                        {filters.tags?.length > 0 && (
                            <div className="listedTeam">
                                {filters.tags.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, tags: [...filters.tags.filter((f, j) => i !== j)] })
                                                );
                                            }}
                                        >
                                            <CloseIcon className="deleteMember" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='inputTag'>
                            <div>
                                <input type='text' value={tag} onChange={(e) => settag(e.target.value)} />
                            </div>
                            <div onClick={() => {
                                if (tag !== '' && !filters.tags.includes(tag)) {
                                    setFilters(prev => ({ ...prev, tags: [...filters.tags, tag] }))
                                    settag('')
                                }
                            }}>
                                <i className='fas fa-plus'></i>
                            </div>
                        </div>
                    </div>
                    <div className='intrestedFilter'>
                        <input type='checkbox' style={{width: '20px'}} checked={filters.intrested} onChange={() => { setFilters(prev => ({ ...prev, intrested: !filters.intrested })) }} />
                        Intrested
                    </div>
                </div>
                <div className='pitchcontainer'>
                    {filteredData.length>0 ? filteredData?.map((d) => (
                        <SinglePitchetails d={d} />
                    )) : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                            No Pitches Available
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default LivePitches