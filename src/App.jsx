import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

// Connect to backend server - use your laptop's IP address
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const socket = io(API_URL)

function App() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Fetch initial counter 1 value from database
    fetch(`${API_URL}/api/counter/1`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCount1(data.count)
        }
      })
      .catch(err => console.error('Error fetching counter 1:', err))

    // Fetch initial counter 2 value from database
    fetch(`${API_URL}/api/counter/2`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCount2(data.count)
        }
      })
      .catch(err => console.error('Error fetching counter 2:', err))

    // Listen for Socket.IO connection
    socket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })

    // Listen for counter updates from other clients
    socket.on('counterUpdate1', (data) => {
      console.log('Counter 1 updated:', data.count)
      setCount1(data.count)
    })

    socket.on('counterUpdate2', (data) => {
      console.log('Counter 2 updated:', data.count)
      setCount2(data.count)
    })

    // Cleanup on unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('counterUpdate1')
      socket.off('counterUpdate2')
    }
  }, [])

  const handleIncrement1 = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/1/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setCount1(data.count)
        console.log('Counter 1 incremented to:', data.count)
      }
    } catch (err) {
      console.error('Error incrementing counter 1:', err)
    }
  }

  const handleReset1 = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/1/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setCount1(0)
        console.log('Counter 1 reset')
      }
    } catch (err) {
      console.error('Error resetting counter 1:', err)
    }
  }

  const handleIncrement2 = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/2/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setCount2(data.count)
        console.log('Counter 2 incremented to:', data.count)
      }
    } catch (err) {
      console.error('Error incrementing counter 2:', err)
    }
  }

  const handleReset2 = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/2/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        setCount2(0)
        console.log('Counter 2 reset')
      }
    } catch (err) {
      console.error('Error resetting counter 2:', err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to StudyBuddi</h1>
        <p>Shared Counter Demo</p>

        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: connected ? '#4CAF50' : '#f44336',
          borderRadius: '5px',
          color: 'white'
        }}>
          {connected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>

        <div style={{
          marginBottom: '20px',
          padding: '5px',
          fontSize: '12px',
          color: '#888'
        }}>
          Server: {API_URL}
        </div>

        <div className="card">
          <h3>Player 1</h3>
          <h2 style={{ fontSize: '48px', margin: '20px 0' }}>
            {count1}
          </h2>
          <button onClick={handleIncrement1} style={{ fontSize: '18px', padding: '15px 30px' }}>
            Increment Counter 1
          </button>
          <button
            onClick={handleReset1}
            style={{
              fontSize: '14px',
              padding: '10px 20px',
              marginLeft: '10px',
              backgroundColor: '#f44336'
            }}
          >
            Reset Player 1
          </button>
        </div>

        <div className="card">
          <h3>Player 2</h3>
          <h2 style={{ fontSize: '48px', margin: '20px 0' }}>
            {count2}
          </h2>
          <button onClick={handleIncrement2} style={{ fontSize: '18px', padding: '15px 30px' }}>
            Increment Counter 2
          </button>
          <button
            onClick={handleReset2}
            style={{
              fontSize: '14px',
              padding: '10px 20px',
              marginLeft: '10px',
              backgroundColor: '#f44336'
            }}
          >
            Reset Player 2
          </button>
        </div>

        <p style={{ marginTop: '20px' }}>
          Click the buttons to increment each counter.<br/>
          Open this on another computer to see real-time sync!
        </p>
      </header>
    </div>
  )
}

export default App
