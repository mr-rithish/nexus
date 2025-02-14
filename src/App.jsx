import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/Auth/Login.jsx'
import ChooseRole from './components/Dashboard/ChooseRole.jsx'
import FounderForm from './components/Dashboard/FounderForm.jsx'
import FounderDashboard from './components/Dashboard/FounderDashboard.jsx'
import JobSeekerDashboard from './components/Dashboard/JobSeekerDashboard.jsx'
import UserProfile from './components/Profile/UserProfile.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/founder-form" element={<FounderForm />} />
        <Route path="/founder-dashboard" element={<FounderDashboard />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  )
}
