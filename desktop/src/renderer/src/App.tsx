import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import AutoUpdateScreen from './pages/AutoUpdateScreen' // Assuming this is your component
import HomeScreen from './pages/HomeScreen'
import LoginScreen from './pages/LoginScreen'
import AdminPanel from './pages/adminPanel/home'
import AdminPanelList from './pages/adminPanel/list'
import { AuthProvider } from './lib/authContext'
import AdminPanelLayout from './layouts/adminPanel/layout'
import AdminPanelAddQuestion from './pages/adminPanel/addQuestion'

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AutoUpdateScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<AdminPanelLayout />}>
            <Route path="/admin/panel/home" element={<AdminPanel />} />
            <Route path="/admin/panel/list/:type" element={<AdminPanelList />} />
            <Route path="/admin/panel/add/question" element={<AdminPanelAddQuestion />} />
          </Route>
          {/* <Route path="/admin/panel/home" element={<AdminPanel />} />
          <Route path="/admin/panel/list/:type" element={<AdminPanel />} />
          <Route path="/admin/panel/stats" element={<AdminPanel />} />
          <Route path="/admin/panel/add/:type" element={<AdminPanel />} />
          <Route path="/admin/panel/profile/:user" element={<AdminPanel />} /> */}
          <Route path="*">404 - Not Found</Route> // This is a catch-all route, it will be displayed
          when no other route matches the current URL
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
