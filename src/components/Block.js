import React from 'react'

function toDegreesMinutesAndSeconds(coordinate) {
  var absolute = Math.abs(coordinate)
  var degrees = Math.floor(absolute)
  var minutesNotTruncated = (absolute - degrees) * 60
  var minutes = Math.floor(minutesNotTruncated)
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60)

  return `${degrees}° ${minutes}' ${seconds}"`
}

function convertDMS(lat, lng) {
  var latitude = toDegreesMinutesAndSeconds(lat)
  var latitudeCardinal = lat >= 0 ? 'N' : 'S'

  var longitude = toDegreesMinutesAndSeconds(lng)
  var longitudeCardinal = lng >= 0 ? 'E' : 'W'

  return (
    <>
      {latitude} <span>{latitudeCardinal}</span>
      <br />
      {longitude} <span>{longitudeCardinal}</span>
    </>
  )
}

const Block = ({ name, unit, measurements }) => {
  const value =
    measurements.length > 0 && measurements[measurements.length - 1][1]
  let recentValue =
    typeof value === 'number'
      ? Number(value).toFixed(2)
      : typeof value === 'string'
      ? Number(value)
      : Array.isArray(value)
      ? convertDMS(value[0], value[1])
      : 'No Data'

  return (
    <div className='block-container'>
      <h1>{name}</h1>
      <div className='value'>
        {recentValue && recentValue}
        {unit && recentValue !== 'No Data' && <span> {unit}</span>}
      </div>
      <div className='measurements'>
        {measurements.length > 0
          ? measurements.map(([timestamp, value]) => {
              let time = new Date(timestamp * 1000).toLocaleTimeString()
              return <p key={timestamp}>{`${time} : ${value}`}</p>
            })
          : 'No Data'}
      </div>
    </div>
  )
}

export default Block
