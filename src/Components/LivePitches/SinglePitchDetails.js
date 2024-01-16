import React from 'react'
import { useNavigate } from 'react-router'

const SinglePitchDetails = ({ d }) => {
  const navigate= useNavigate()
  return (
    <div className='singlePitchWrapper'>
      <div className='singlePitch' onClick={() => { navigate(`${d._id}`) }}>
        <b>{d.heading}</b>
        <div className='desc'>{d.description}</div>
        <div className='tags'>{d.tags?.map(t => (
          <span>{t}</span>
        ))}</div>
      </div>
    </div>
      
  )
}

export default SinglePitchDetails