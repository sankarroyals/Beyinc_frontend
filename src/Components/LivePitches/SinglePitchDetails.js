import React from 'react'
import { useNavigate } from 'react-router'
import {  useSelector } from 'react-redux'

const SinglePitchDetails = ({ d }) => {
  const { email } = useSelector(state => state.auth.loginDetails)

  const navigate= useNavigate()
  return (
    <div className='singlePitchWrapper'>
      <div className='singlePitch' onClick={() => { navigate(`${d._id}`) }}>
        <div className='headingIntrested'>
          <b>{d.heading}</b>
          <div title='This Pitch present in your intrested list' className={`${(d?.intrest?.length > 0 && d?.intrest.filter(p => p.email === email).length > 0) && 'intrestButton addIntrest'}`}>
            {(d?.intrest?.length > 0 && d?.intrest.filter(p => p.email === email).length > 0) && <span>Intrested</span> }

          </div>
        </div>
        <div className='desc'>{d.description}</div>
        <div className='tags'>Tags: {d.tags?.map(t => (
          <span style={{ fontSize: '14px' }} className='hp'>{t}</span>
        ))}</div>
        {d?.hiringPositions?.length > 0 && <div className='tags'>
          People Needed:
          {d?.hiringPositions?.map(h => (
            <span className='hp'>{h}</span>
          ))}
        </div>}
      </div>
    </div>
      
  )
}

export default SinglePitchDetails