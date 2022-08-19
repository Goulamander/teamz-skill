import React from 'react'

const HalfStarRating = (props) => {
  let activePer = (props.rating%1).toFixed(1)*100
  
  return (
    <div className="dv-custom-half-star" style={{position: 'relative'}}>
      <i style={{fontStyle: 'normal', color:'rgb(255, 130, 78)', position:'absolute', width: `${activePer}%`, overflow:'hidden'}}>★</i>
      <i style={{fontStyle: 'normal'}}>★</i>
    </div>
  )
}

export default HalfStarRating