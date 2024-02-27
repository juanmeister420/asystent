import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import AutoUpdateScreen from './pages/AutoUpdateScreen' // Assuming this is your component
import HomeScreen from './pages/HomeScreen'
import LoginScreen from './pages/LoginScreen'
import AdminPanel from './pages/AdminPanel'
import { AuthProvider } from './lib/authContext'

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AutoUpdateScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          {/* Define other routes here */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
