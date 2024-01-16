import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'
import { useDispatch } from 'react-redux'
import { setToast } from '../../redux/AuthReducers/AuthReducer'
import { ToastColors } from '../Toast/ToastColors'
import CloseIcon from "@mui/icons-material/Close";
import '../Conversation/Users/searchBox.css'
import './LivePitches.css'
import SinglePitchetails from './SinglePitchDetails'
const LivePitches = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [filters, setFilters] = useState({
        tags: []
    })
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
                    visibile: "yes",
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
        if (Object.keys(filters).length > 0) {
            Object.keys(filters).map((ob) => {
                if (filters[ob].length > 0) {
                    if (ob !== 'tags') {
                        filteredData = filteredData.filter(f => filters[ob].includes(f[ob]))
                    } else if (ob === 'tags') {
                        filteredData = filteredData.filter(item => {
                            const tags = item.tags.map(t=>t.toLowerCase()) || [];
                            return filters[ob].some(tag => tags.includes(tag.toLowerCase()));
                        });
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
                      <div>Tags</div>
                      {filters.tags.length > 0 && (
                          <div className="listedTeam">
                              {filters.tags.map((t, i) => (
                                  <div className="singleMember">
                                     
                                      <div>{t}</div>
                                      <div
                                          onClick={(e) => {
                                              setFilters(
                                                  prev=>({...prev, tags: [...filters.tags.filter((f,j)=> i!==j)]})
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
                              <input type='text' value={tag} onChange={(e)=>settag(e.target.value)} />
                          </div>
                          <div onClick={() => {
                              setFilters(prev => ({ ...prev, tags: [...filters.tags, tag]}))
                              settag('')
                          }}>
                              <i className='fas fa-plus'></i>
                          </div>
                      </div>
                  </div>
              </div>
              <div className='pitchcontainer'>
                  {filteredData?.map((d) => (
                      <SinglePitchetails d={d} />
                  ))}
              </div>
          </div>
     </div>
  )
}

export default LivePitches