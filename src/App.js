import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './Navbar';
import Footer from './Footer';
import ApplyForBursary from './ApplyForBursary';
import AboutUs from './AboutUs';
import Achievements from './Achievements';
import HomePage from './HomePage';
import Login from './Login';
import Profile from './Profile';
import Registration from './Registration';
import ApplicantDashboard from "./ApplicantDashboard";
import AdminDashboard from './Admin/AdminDashboard';
import AdminAchievements from "./Admin/AdminAchievements";

// New AuthContext (create this in a separate file)
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container-fluid">
          <CustomNavbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/Registration" element={<Registration />} />

            {/* Protected Routes */}
            <Route 
              path="/apply-for-bursary" 
              element={
                <PrivateRoute>
                  <ApplyForBursary />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/ApplicantDashboard" 
              element={
                <PrivateRoute>
                  <ApplicantDashboard />
                </PrivateRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/AdminDashboard" 
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/achievements" 
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminAchievements />
                </PrivateRoute>
              } 
            />
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;