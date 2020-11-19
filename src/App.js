import './App.css'
import { useEffect, useState } from 'react'
import Block from './components/Block'

const socket = new WebSocket('wss://jsdemo.envdev.io/ws')

socket.onopen = (e) => {
  console.log('Connection established')
}

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
  const [data, setData] = useState([])

  useEffect(() => {
    socket.onmessage = (e) => {
      let newData = JSON.parse(e.data)

      setData((prevData) => {
        if (prevData === []) {
          return newData.sort(compare)
        }

        let updatedData = [...prevData]

        newData.forEach((obj) => {
          let index = updatedData.findIndex(
            (prevObj) => prevObj._id === obj._id
          )
          if (index === -1) {
            updatedData.push(obj)
          } else {
            if (obj.measurements.length > 0) {
              updatedData[index].measurements = obj.measurements
            }
          }
        })

        return updatedData.sort(compare)
      })
    }

    return () => {
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
