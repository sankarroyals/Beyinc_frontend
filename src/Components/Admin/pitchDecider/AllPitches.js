import { useEffect, useState } from 'react';
import { AdminServices } from '../../../Services/AdminServices';
import '../UserRequests/UserRequest.css'
import { ApiServices } from '../../../Services/ApiServices';
import MultipleSelectCheckmarks from '../UserRequests/FIlterExample';
import PitchCard from './PitchCard';

export default function AllPitches() {
    const [roles, setRoles] = useState([])
    const [emails, setEmails] = useState([])
    useEffect(() => {
        ApiServices.getAllRoles().then((res) => {
            const roles = []
            res.data?.map(r => {
                roles.push(r.role)
            })
            setRoles(roles)
        })
    }, [])
    const [filters, setFilters] = useState({
        role: [],
        status: ['pending'],
        email: []

    })
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const getAllPitches = async () => {
        await AdminServices.getAllPitches().then((res) => {
            setData(res.data);
            const emails = []
            res.data?.map(r => {
                emails.push(r.email)
            })
            setEmails(emails)
        })
    }
    useEffect(() => {
        getAllPitches()
    }, [])
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
                        <MultipleSelectCheckmarks names={roles} filterName='role' setFilters={setFilters} filters={filters} />
                    </div>
                    <div>
                        <MultipleSelectCheckmarks names={['pending', 'approved', 'rejected']} filterName='status' filters={filters} setFilters={setFilters} />
                    </div>
                    <div>
                        <MultipleSelectCheckmarks names={emails} filterName='email' setFilters={setFilters} filters={filters} />
                    </div>
                    <button style={{ width: '50px', height: '50px', marginTop: '8px' }} onClick={filterUsers}>
                        <i className='fas fa-search'></i>
                    </button>
                </div>
              
                <div className='filteredUsers'>
                    {filteredData?.length > 0 ?
                        filteredData?.map((d) => (
                            <PitchCard d={d} />
                        ))
                        : <div className="pitch-container">
                        <img className="no-requests" src='/no-requests.png'/>
                         <div style={{marginLeft : '30px'}}>No Requests Found !</div>
                         </div>}
                </div>
            </div>
        </>
    );
}