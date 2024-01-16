import React, { useEffect, useState } from 'react'
import { ApiServices } from '../../Services/ApiServices'

const IndividualPitchComment = ({ c }) => {

  return (
      <div>
          <div>
              <img src={c?.profile_pic || '/profile.jpeg'} alt="" />
          </div>
          
    </div>
  )
}

export default IndividualPitchComment