import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiServices } from '../../Services/ApiServices'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import MultipleSelectCheckmarks from '../Admin/UserRequests/FIlterExample'
import PitchCard from '../Admin/pitchDecider/PitchCard'
import LoggedInPitchCard from './LoggedPitchCard'
const LoggedInPitches = () => {
    const { email } = useSelector(state => state.auth.loginDetails)
    const dispatch = useDispatch()
    const [filteredData, setFilteredData] = useState([])
    const [data, setdata] = useState([])
    useEffect(() => {
        ApiServices.getuserPitches({ email: email }).then(res => {
            setdata(res.data)
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
    const [filters, setFilters] = useState({
        status: [],
        pitchRequiredStatus: []
    })
    useEffect(() => {
        if (data.length > 0) {
            filterUsers()
        }
    }, [data])


    const filterUsers = () => {

        let filteredData = [...data]
        if (Object.keys(filters).length > 0) {
            Object.keys(filters).map((ob) => {
                if (filters[ob].length > 0) {
                    filteredData = filteredData.filter(f => filters[ob].includes(f[ob]))
                }
            })
        }
        setFilteredData(filteredData);
    }
    return (
        <>
            <div className='usersFilterContainer'>
                Filters:
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <div>
                        <MultipleSelectCheckmarks names={['pending', 'approved', 'rejected']} filterName='status' filters={filters} setFilters={setFilters} />
                    </div>
                    <div>
                        <MultipleSelectCheckmarks names={['hide', 'show']} filterName='pitchRequiredStatus' filters={filters} setFilters={setFilters} />
                    </div>
                    <button style={{ width: '50px', height: '50px', marginTop: '8px' }} onClick={filterUsers}>
                        <i className='fas fa-search'></i>
                    </button>
                </div>

                <div className='filteredUsers'>
                    {filteredData?.length > 0 ?
                        filteredData?.map((d) => (
                            <LoggedInPitchCard d={d} />
                        ))
                        : <>No Requests</>}
                </div>
            </div>
        </>
    )
}

export default LoggedInPitches 