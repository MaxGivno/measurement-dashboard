import React from 'react'

const Block = ({ name, unit, measurements }) => {
  let recentValue =
    measurements.length > 0 &&
    typeof measurements[measurements.length - 1][1] === 'number' &&
    measurements[measurements.length - 1][1]
  return (
    <div className='block-container'>
      <h1>{name}</h1>
      <div className='value'>
        {recentValue && Number(recentValue).toFixed(2)}
        {unit && <span> {unit}</span>}
      </div>
      <div className='measurements'>
        {measurements &&
          measurements.map(([timestamp, value]) => {
            let time = new Date(timestamp * 1000).toLocaleTimeString()
            return <p key={timestamp}>{`${time} : ${value}`}</p>
          })}
      </div>
      {/* <h4>{unit}</h4> */}
    </div>
  )
}

export default Block
