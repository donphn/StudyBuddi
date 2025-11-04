import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function MatchPage() {
  const navigate = useNavigate()
  const socketRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const [matchInfo, setMatchInfo] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [isInitiator, setIsInitiator] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // ICE servers configuration (Safari compatible)
  const iceServers = {
    iceServers: [
      { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  }

  useEffect(() => {
    // Get match info from localStorage
    const stored = localStorage.getItem('matchInfo')
    if (!stored) {
      navigate('/counter')
      return
    }

    const info = JSON.parse(stored)
    setMatchInfo(info)

    // Determine if this user is the initiator (first to join, lower socket ID)
    setIsInitiator(info.socketId < info.peerId)

    // Initialize socket and get video stream
    const socket = io(API_URL)
    socketRef.current = socket

    // Get local video stream (Safari compatible constraints)
    console.log('Requesting media devices...')
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      })
      .then(stream => {
        console.log('Media stream obtained:', stream)
        localStreamRef.current = stream
        if (localVideoRef.current) {
          console.log('Setting local video srcObject')
          localVideoRef.current.srcObject = stream
          // Safari requires explicit playback handling
          localVideoRef.current.play().catch(err => console.warn('Autoplay issue:', err))
        }

        // Create peer connection
        console.log('Creating peer connection...')
        createPeerConnection(stream, info, socket)
      })
      .catch(err => {
        console.error('Error accessing media devices:', err)
        console.error('Error details:', err.name, err.message)
        alert('Camera/microphone access denied. Please allow access in browser settings.\n\nError: ' + err.message)
        setConnectionStatus('error')
      })

    // Socket event listeners for WebRTC signaling
    // Note: These handlers are defined below but referenced here
    const onReceiveOffer = (data) => {
      console.log('Received offer from:', data.fromId)
      const peerConnection = peerConnectionRef.current
      if (!peerConnection) return
      peerConnection
        .setRemoteDescription(data.offer)
        .then(() => {
          console.log('Creating answer')
          return peerConnection.createAnswer()
        })
        .then(answer => {
          return peerConnection.setLocalDescription(answer)
        })
        .then(() => {
          socket.emit('sendAnswer', {
            peerId: data.fromId,
            answer: peerConnection.localDescription
          })
        })
        .catch(err => {
          console.error('Error handling offer:', err)
          setConnectionStatus('error')
        })
    }

    const onReceiveAnswer = (data) => {
      console.log('Received answer from:', data.fromId)
      const peerConnection = peerConnectionRef.current
      if (!peerConnection) return
      peerConnection
        .setRemoteDescription(data.answer)
        .catch(err => {
          console.error('Error handling answer:', err)
          setConnectionStatus('error')
        })
    }

    const onReceiveIceCandidate = (data) => {
      console.log('Received ICE candidate from:', data.fromId)
      const peerConnection = peerConnectionRef.current
      if (!peerConnection) return
      if (data.candidate) {
        peerConnection
          .addIceCandidate(data.candidate)
          .catch(err => {
            console.error('Error adding ICE candidate:', err)
          })
      }
    }

    socket.on('receiveOffer', onReceiveOffer)
    socket.on('receiveAnswer', onReceiveAnswer)
    socket.on('receiveIceCandidate', onReceiveIceCandidate)

    // Cleanup on unmount
    return () => {
      socket.off('receiveOffer', onReceiveOffer)
      socket.off('receiveAnswer', onReceiveAnswer)
      socket.off('receiveIceCandidate', onReceiveIceCandidate)
      socket.disconnect()

      // Stop all tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [navigate])

  const createPeerConnection = (localStream, info, socket) => {
    try {
      console.log('createPeerConnection called with info:', info)
      console.log('ICE Servers config:', iceServers)

      const peerConnection = new RTCPeerConnection(iceServers)
      console.log('RTCPeerConnection created')

      peerConnectionRef.current = peerConnection

      // Add local tracks to peer connection
      console.log('Adding local tracks...')
      localStream.getTracks().forEach(track => {
        console.log('Adding track:', track.kind)
        peerConnection.addTrack(track, localStream)
      })

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind)
        if (remoteVideoRef.current && event.streams[0]) {
          console.log('Setting remote video srcObject')
          remoteVideoRef.current.srcObject = event.streams[0]
          remoteStreamRef.current = event.streams[0]
          setConnectionStatus('connected')
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state changed:', peerConnection.connectionState)
        switch (peerConnection.connectionState) {
          case 'connected':
            console.log('Connection established!')
            setConnectionStatus('connected')
            break
          case 'disconnected':
          case 'failed':
          case 'closed':
            console.log('Connection closed/failed')
            handleEndConnection()
            break
          default:
            setConnectionStatus('connecting')
        }
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate)
          socket.emit('sendIceCandidate', {
            peerId: info.peerId,
            candidate: event.candidate
          })
        }
      }

      // If this user is initiator, create and send offer
      if (info.socketId < info.peerId) {
        console.log('This user is initiator, creating offer')
        peerConnection
          .createOffer()
          .then(offer => {
            console.log('Offer created, setting local description')
            return peerConnection.setLocalDescription(offer)
          })
          .then(() => {
            console.log('Local description set, sending offer to peer')
            socket.emit('sendOffer', {
              peerId: info.peerId,
              offer: peerConnection.localDescription
            })
          })
          .catch(err => {
            console.error('Error creating offer:', err)
            setConnectionStatus('error')
          })
      } else {
        console.log('This user is NOT initiator, waiting for offer')
      }
    } catch (err) {
      console.error('Error creating peer connection:', err)
      console.error('Stack:', err.stack)
      setConnectionStatus('error')
    }
  }

  const handleEndConnection = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    // Clear match info and redirect
    localStorage.removeItem('matchInfo')
    navigate('/counter')
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Match</h1>
        <p>Connected with {matchInfo?.peerUsername}</p>

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

        {/* Video Container */}
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
          {/* Local Video */}
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

          {/* Remote Video */}
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
              {matchInfo?.peerUsername || 'Connecting...'}
            </div>
          </div>
        </div>

        {/* End Connection Button */}
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
