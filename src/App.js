import './App.css'
import { useEffect, useState } from 'react'
import Block from './components/Block'

// Creating socket connection
const socket = new WebSocket('wss://jsdemo.envdev.io/ws')

// Monitoring socket
socket.onopen = (e) => {
  console.log('Connection established')
}

// Custom sort fuction
function compare(a, b) {
  if (a._id < b._id) {
    return -1
  }
  if (a._id > b._id) {
    return 1
  }
  return 0
}

function App() {
  // State setup
  const [data, setData] = useState([])

  useEffect(() => {
    // Getting data from server
    socket.onmessage = (e) => {
      let newData = JSON.parse(e.data)

      // Update state with received data
      setData((prevData) => {
        // If state is empty, fill it with received data
        if (prevData === []) {
          return newData.sort(compare)
        }

        // If state is not empty, create a copy
        let updatedData = [...prevData]

        // Iterate through new data
        newData.forEach((obj) => {
          // Find if state has object with same id
          let index = updatedData.findIndex(
            (prevObj) => prevObj._id === obj._id
          )
          if (index === -1) {
            // If it hasn't, add a new object
            updatedData.push(obj)
          } else {
            // If it has, update current object with new data
            if (obj.measurements.length > 0) {
              updatedData[index].measurements = obj.measurements
            }
          }
        })
        // Update state
        return updatedData.sort(compare)
      })
    }

    return () => {
      // Close the socket on component unmount
      socket.close()
      socket.onclose = (e) => {
        if (e.wasClean) {
          console.log(
            `Connection closed cleanly, code=${e.code} reason=${e.reason}`
          )
        } else {
          console.log('Connection died')
        }
      }
    }
  }, [])

  return (
    <>
      <h1>Measurements Dashboard</h1>
      <div className='container'>
        {data.length > 0 &&
          data.map((block) => (
            <Block
              key={block._id}
              name={block.name}
              unit={block.unit}
              measurements={block.measurements}
            />
          ))}
      </div>
    </>
  )
}

export default App
