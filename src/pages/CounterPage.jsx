import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import '../App.css'

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function CounterPage() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    // Create socket connection inside the component so listeners are attached first
    const socket = io(API_URL)
    socketRef.current = socket

    // Listen for Socket.IO connection - this will fire when socket connects
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

    // Listen for new messages from other clients
    socket.on('newMessage', (message) => {
      console.log('New message received:', message)
      setMessages(prev => [...prev, message])
    })

    // Fetch initial messages from database
    fetch(`${API_URL}/api/chat`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages)
        }
      })
      .catch(err => console.error('Error fetching messages:', err))

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

    // Cleanup on unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('counterUpdate1')
      socket.off('counterUpdate2')
      socket.off('newMessage')
      socket.disconnect()
    }
  }, [])

  const handleIncrement1 = async () => {
    try {
      const response = await fetch(`${API_URL}/api/counter/1/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!messageInput.trim()) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: user.id,
          username: user.username,
          content: messageInput
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessageInput('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1>Welcome to StudyBuddi</h1>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Logout ({user.username})
          </button>
        </div>
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

        {/* Chat Section */}
        <div style={{
          marginTop: '30px',
          marginLeft: '1in',
          marginRight: '1in',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          padding: '15px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 2in)'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>💬 Chat</h3>

          {/* Messages Display */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            flex: 1,
            overflowY: 'auto',
            marginBottom: '10px'
          }}>
            {messages.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', margin: '50px 0' }}>
                No messages yet. Start chatting!
              </p>
            ) : (
              messages.map((msg) => {
                const isOwnMessage = msg.username === user.username
                return (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: '6px',
                      display: 'flex',
                      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '60%',
                        padding: '6px 10px',
                        backgroundColor: isOwnMessage ? '#2196F3' : '#e0e0e0',
                        color: isOwnMessage ? 'white' : '#333',
                        borderRadius: '12px',
                        fontSize: '13px',
                        wordWrap: 'break-word'
                      }}
                    >
                      {!isOwnMessage && (
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', opacity: 0.8 }}>
                          {msg.username}
                        </div>
                      )}
                      <div>{msg.content}</div>
                      <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.7 }}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                width: '80px',
                padding: '10px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </form>
        </div>
      </header>
    </div>
  )
}
