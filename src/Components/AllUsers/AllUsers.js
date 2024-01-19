import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import '../LivePitches/LivePitches.css'
import { useSelector } from 'react-redux'
import CloseIcon from "@mui/icons-material/Close";
import { domainPitch, itPositions, techPitch } from '../../Utils';
import axios from 'axios';
import { Country, State } from 'country-state-city'
import CachedIcon from "@mui/icons-material/Cached";
import SingleUserDetails from './SingleUserDetails';
import './users.css'


const AllUsers = () => {
    const [data, setData] = useState([])
    const [tag, settag] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const { email } = useSelector(state => state.auth.loginDetails)
    const [filters, setFilters] = useState({
        email: [],
        state: [],
        country: [],
        userColleges: [],
        verification: false,
        userName: [],
    })
    const [universities, setUniversities] = useState([])
    useEffect(() => {
        axios.get('http://universities.hipolabs.com/search').then(res => {
            setUniversities(res.data)
        })
    }, [])
    useEffect(() => {
        ApiServices.getAllUsers({ type: '' }).then(res => {
            console.log(res.data);
            setData(res.data)
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
                if (filters[ob].length > 0 || ob == 'verification') {
                    if (ob !== 'tags' && ob !== 'verification' && ob !== 'email' && ob !== 'userName' && ob !== 'industry2' && ob !== 'userColleges' && ob !== 'country' && ob !== 'state') {
                        filteredData = filteredData.filter(f => filters[ob].includes(f[ob]))
                    } else if (ob === 'tags' ) {
                        filteredData = filteredData.filter(item => {
                            const itemdata = item[ob].map(t => t.toLowerCase()) || [];
                            return filters[ob].some(tag => itemdata.includes(tag.toLowerCase()));
                        });
                    } else if (ob == 'userColleges') {
                        filteredData = filteredData.filter(item => {
                            const itemdata = item['educationDetails']?.map(t => t.college) || [];
                            return filters[ob].some(tag => itemdata.includes(tag));
                        });
                    }
                    else if (ob == 'verification') {
                        if (filters[ob]) {
                            filteredData = filteredData.filter(item => {
                               
                                return item.verification == 'approved'
                            });
                        }
                    } else if (ob == 'userName' || ob == 'industry2' || ob == 'country' || ob == 'state' || ob == 'email') {
                        filteredData = filteredData.filter(f => {
                            return filters[ob].some(fs => fs === f[ob])
                        })
                    }
                }
            })
        }
        console.log(filteredData);
        setFilteredData(filteredData);
    }


    const [isSpinning, setSpinning] = useState(false);
    const handleReloadClick = () => {
        setSpinning(true);
        setFilters({
            email: [],
            state: [],
            country: [],
            userColleges: [],
            verification: false,
            userName: [],
        })


    };
    return (
        <div className='usersContainer'>
            <div className='usersWrapper'>
                <div className='filterContainer'>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className='filterHeader'>Filter By:</div>
                        <div title="Reset filters">
                            <CachedIcon
                                style={{ cursor: "pointer" }}
                                className={isSpinning ? "spin" : ""}
                                onClick={() => {
                                    handleReloadClick();
                                }}
                            />
                        </div>
                    </div>
                    {/* Position */}
                    <div className='tagFilter'>
                        <div>Email:</div>
                        {filters.email?.length > 0 && (
                            <div className="listedTeam">
                                {filters.email.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, email: [...filters.email.filter((f, j) => i !== j)] })
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
                                name="email"
                                // value={form?.email}
                                onChange={(e) => {
                                    if (!filters.email.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, email: [...filters.email, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {data.map(h => (
                                    <option value={h.email}>{h.email}</option>
                                ))}

                            </select>

                        </div>
                    </div>

                    {/* Domain */}
                    <div className='tagFilter'>
                        <div>User Names:</div>
                        {filters.userName?.length > 0 && (
                            <div className="listedTeam">
                                {filters.userName.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, userName: [...filters.userName.filter((f, j) => i !== j)] })
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
                                    if (!filters.userName.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, userName: [...filters.userName, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {data.map(h => (
                                    <option value={h.userName}>{h.userName}</option>
                                ))}

                            </select>

                        </div>
                    </div>


                    {/* userColleges */}
                    <div className='tagFilter'>
                        <div>Colleges:</div>
                        {filters.userColleges?.length > 0 && (
                            <div className="listedTeam">
                                {filters.userColleges.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, userColleges: [...filters.userColleges.filter((f, j) => i !== j)] })
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
                                    if (!filters.userColleges.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, userColleges: [...filters.userColleges, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {universities?.map(h => (
                                    <option value={h.name}>{h.name}</option>
                                ))}

                            </select>

                        </div>
                    </div>

                    {/* country */}
                    <div className='tagFilter'>
                        <div>Country:</div>
                        {filters.country?.length > 0 && (
                            <div className="listedTeam">
                                {filters.country.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, country: [...filters.country.filter((f, j) => i !== j)] })
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
                                    if (!filters.country.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, country: [...filters.country, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {Country?.getAllCountries().map(h => (
                                    <option value={`${h.name}-${h.isoCode}`}>{h.name}</option>
                                ))}

                            </select>

                        </div>
                    </div>


                    {/* state */}
                    <div className='tagFilter'>
                        <div>State:</div>
                        {filters.state?.length > 0 && (
                            <div className="listedTeam">
                                {filters.state.map((t, i) => (
                                    <div className="singleMember">

                                        <div>{t}</div>
                                        <div
                                            onClick={(e) => {
                                                setFilters(
                                                    prev => ({ ...prev, state: [...filters.state.filter((f, j) => i !== j)] })
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
                                    if (!filters.state.includes(e.target.value)) {
                                        setFilters(prev => ({ ...filters, state: [...filters.state, e.target.value] }))
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                {State?.getAllStates().map(h => (
                                    <option value={`${h.name}-${h.isoCode}`}>{h.name}</option>
                                ))}

                            </select>

                        </div>
                    </div>

                    

                    {/* verification */}
                    <div className='verificationFilter'>
                        <input type='checkbox' style={{ width: '20px' }} checked={filters.verification} onChange={() => { setFilters(prev => ({ ...prev, verification: !filters.verification })) }} />
                        Verified
                    </div>
                </div>
                <div className='userscontainer'>
                    {filteredData.length > 0 ? filteredData?.map((d) => (
                      <SingleUserDetails d={d} />
                  )) : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                      No Users Available
                  </div>}
                </div>
            </div>
        </div>
    )
}

export default AllUsers