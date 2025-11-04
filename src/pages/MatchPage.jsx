import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import '../App.css'

// Get API URL from environment or auto-detect based on current protocol
const API_URL = import.meta.env.VITE_API_URL || (() => {
  if (typeof window !== 'undefined') {
    // Auto-detect protocol based on current page
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http'
    const host = window.location.hostname
    return `${protocol}://${host}:5000`
  }
  return 'http://localhost:5000'
})()

export default function MatchPage() {
  const navigate = useNavigate()
  const socketRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const [matchInfo, setMatchInfo] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  }

  useEffect(() => {
    console.log('MatchPage mounted')

    // Get match info from localStorage
    const stored = localStorage.getItem('matchInfo')
    if (!stored) {
      console.log('No match info found, redirecting to counter')
      navigate('/counter')
      return
    }

    try {
      const info = JSON.parse(stored)
      console.log('Match info:', info)
      setMatchInfo(info)

      // Create socket connection
      const socket = io(API_URL)
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id)
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
        setError('Socket error: ' + error)
      })

      // Setup WebRTC signaling handlers
      socket.on('receiveOffer', (data) => handleReceiveOffer(data))
      socket.on('receiveAnswer', (data) => handleReceiveAnswer(data))
      socket.on('receiveIceCandidate', (data) => handleReceiveIceCandidate(data))

      // Get media stream and setup peer connection
      setupMedia(info, socket)

      return () => {
        socket.off('receiveOffer')
        socket.off('receiveAnswer')
        socket.off('receiveIceCandidate')
        socket.disconnect()

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop())
        }

        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
        }
      }
    } catch (err) {
      console.error('Error in MatchPage setup:', err)
      setError('Error: ' + err.message)
    }
  }, [navigate])

  const setupMedia = async (info, socket) => {
    let localStream = null;

    try {
      console.log('Requesting media devices...')
      console.log('Current URL:', window.location.href)

      // Try to get media stream, but allow continuing without it
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          })

          console.log('Media stream obtained')
          localStreamRef.current = localStream

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream
          }
        } catch (mediaErr) {
          console.warn('Could not access camera/microphone:', mediaErr.message)
          console.warn('Proceeding with WebRTC connection without video...')
          setError(`Camera access: ${mediaErr.message}. WebRTC connection may still work without video.`)
          // Continue without media stream - can still establish peer connection for data
        }
      } else {
        console.warn('MediaDevices not available')
        setError('MediaDevices not available. Using HTTP IP? Try http://localhost:3000 instead.')
      }

      // Setup peer connection even if media stream failed
      setupPeerConnection(info, localStream, socket)

    } catch (err) {
      console.error('Error in setupMedia:', err)
      setError('Setup error: ' + err.message)
      setConnectionStatus('error')
    }
  }

  const setupPeerConnection = (info, localStream, socket) => {
    try {
      console.log('Creating RTCPeerConnection')
      const peerConnection = new RTCPeerConnection(ICE_SERVERS)
      peerConnectionRef.current = peerConnection

      // Add local tracks (if available)
      if (localStream) {
        localStream.getTracks().forEach(track => {
          console.log('Adding track:', track.kind)
          peerConnection.addTrack(track, localStream)
        })
      } else {
        console.log('No local stream available (camera access blocked?)')
      }

      // Handle remote tracks
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind)
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
          setConnectionStatus('connected')
        }
      }

      // Handle connection state
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState)
        switch (peerConnection.connectionState) {
          case 'connected':
            setConnectionStatus('connected')
            break
          case 'failed':
          case 'disconnected':
          case 'closed':
            handleEndConnection()
            break
          default:
            setConnectionStatus('connecting')
        }
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate')
          socket.emit('sendIceCandidate', {
            peerId: info.peerId,
            candidate: event.candidate
          })
        }
      }

      // Determine if this user initiates offer
      const shouldInitiate = info.socketId < info.peerId
      console.log('Should initiate:', shouldInitiate, 'socketId:', info.socketId, 'peerId:', info.peerId)

      if (shouldInitiate) {
        createAndSendOffer(peerConnection, info, socket)
      } else {
        console.log('Waiting for offer from peer')
      }
    } catch (err) {
      console.error('Error setting up peer connection:', err)
      setError('Peer connection error: ' + err.message)
      setConnectionStatus('error')
    }
  }

  const createAndSendOffer = async (peerConnection, info, socket) => {
    try {
      console.log('Creating offer')
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      console.log('Sending offer to peer')
      socket.emit('sendOffer', {
        peerId: info.peerId,
        offer: peerConnection.localDescription
      })
    } catch (err) {
      console.error('Error creating offer:', err)
      setError('Offer error: ' + err.message)
      setConnectionStatus('error')
    }
  }

  const handleReceiveOffer = async (data) => {
    try {
      console.log('Received offer')
      const peerConnection = peerConnectionRef.current
      if (!peerConnection) {
        console.error('Peer connection not initialized')
        return
      }

      await peerConnection.setRemoteDescription(data.offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      console.log('Sending answer')
      socketRef.current.emit('sendAnswer', {
        peerId: data.fromId,
        answer: peerConnection.localDescription
      })
    } catch (err) {
      console.error('Error handling offer:', err)
      setError('Answer error: ' + err.message)
    }
  }

  const handleReceiveAnswer = async (data) => {
    try {
      console.log('Received answer')
      const peerConnection = peerConnectionRef.current
      if (!peerConnection) {
        console.error('Peer connection not initialized')
        return
      }

      await peerConnection.setRemoteDescription(data.answer)
    } catch (err) {
      console.error('Error handling answer:', err)
      setError('Answer handling error: ' + err.message)
    }
  }

  const handleReceiveIceCandidate = async (data) => {
    try {
      const peerConnection = peerConnectionRef.current
      if (!peerConnection || !data.candidate) return

      await peerConnection.addIceCandidate(data.candidate)
    } catch (err) {
      console.error('Error adding ICE candidate:', err)
    }
  }

  const handleEndConnection = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    localStorage.removeItem('matchInfo')
    navigate('/counter')
  }

  if (!matchInfo) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading match info...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Match</h1>
        <p>Connected with {matchInfo.peerUsername}</p>

        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor:
              connectionStatus === 'connected'
                ? '#4CAF50'
                : connectionStatus === 'error'
                  ? '#f44336'
                  : '#ff9800',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {connectionStatus === 'connected'
            ? '🟢 Connected'
            : connectionStatus === 'connecting'
              ? '🟡 Connecting...'
              : '🔴 Connection Error'}
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f44336', color: 'white', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
            marginLeft: '1in',
            marginRight: '1in'
          }}
        >
          <div
            style={{
              border: '2px solid #2196F3',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              You ({user.username})
            </div>
          </div>

          <div
            style={{
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {matchInfo.peerUsername}
            </div>
          </div>
        </div>

        <button
          onClick={handleEndConnection}
          style={{
            fontSize: '16px',
            padding: '12px 30px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          End Connection
        </button>
      </header>
    </div>
  )
}
