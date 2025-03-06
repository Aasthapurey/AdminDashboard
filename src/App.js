import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import AdminDashboard from './components/AdminDashboard';
import AppointmentDashboard from './components/AppointmentDashboard';
import AppointmentForm from './components/AppointmentForm';
import ImageSection from './components/ImageSection';
import CampusProgram from './components/CampusProgram';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute>
            <AppointmentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/book-appointment" element={
          <ProtectedRoute>
            <AppointmentForm />
          </ProtectedRoute>
        } />
        <Route path="/imagesection" element={
          <ProtectedRoute>
            <ImageSection />
          </ProtectedRoute>
        } />
        <Route path="/campusprogram" element={
          <ProtectedRoute>
            <CampusProgram />
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;