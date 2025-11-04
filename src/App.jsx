import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import CounterPage from './pages/CounterPage'
import MatchPage from './pages/MatchPage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/counter" element={
          <ProtectedRoute>
            <CounterPage />
          </ProtectedRoute>
        } />
        <Route path="/match" element={
          <ProtectedRoute>
            <MatchPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
