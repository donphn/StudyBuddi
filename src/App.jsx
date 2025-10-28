import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

// Connect to backend server - use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const socket = io(API_URL)

function App() {
  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Fetch initial counter value from database
    fetch(`${API_URL}/api/counter`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCount(data.count)
        }
      })
      .catch(err => console.error('Error fetching counter:', err))

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
    socket.on('counterUpdate', (data) => {
      console.log('Counter updated:', data.count)
      setCount(data.count)
    })

    // Cleanup on unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('counterUpdate')
    }
  }, [])

  const handleIncrement = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        // Counter will be updated via Socket.IO event
        console.log('Counter incremented to:', data.count)
      }
    } catch (err) {
      console.error('Error incrementing counter:', err)
    }
  }

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.success) {
        console.log('Counter reset')
      }
    } catch (err) {
      console.error('Error resetting counter:', err)
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
          <h2 style={{ fontSize: '48px', margin: '20px 0' }}>
            {count}
          </h2>
          <button onClick={handleIncrement} style={{ fontSize: '18px', padding: '15px 30px' }}>
            Increment Counter
          </button>
          <button
            onClick={handleReset}
            style={{
              fontSize: '14px',
              padding: '10px 20px',
              marginLeft: '10px',
              backgroundColor: '#f44336'
            }}
          >
            Reset
          </button>
          <p style={{ marginTop: '20px' }}>
            Click the button to increment the counter.<br/>
            Open this on another computer to see real-time sync!
          </p>
        </div>
      </header>
    </div>
  )
}

export default App
