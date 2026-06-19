/**
 * CAMResearcher Frontend
 * Main React Application
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';

// Components
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import LanguageSwitcher from './components/Common/LanguageSwitcher';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import EmailVerification from './components/Auth/EmailVerification';

// Profile Components
import ProfileDashboard from './components/Profile/ProfileDashboard';
import BasicInfo from './components/Profile/BasicInfo';
import Publications from './components/Profile/Publications';
import Awards from './components/Profile/Awards';
import TeachingExperience from './components/Profile/TeachingExperience';

// Dashboard Components
import ResearcherDashboard from './components/Dashboard/ResearcherDashboard';
import GrantOpportunities from './components/Dashboard/GrantOpportunities';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import VerificationDashboard from './components/Admin/VerificationDashboard';

// Context
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Protected Route Component
const ProtectedRoute = ({ element, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

function App() {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with backend
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    } catch (error) {
      console.error('Token validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading CAMResearcher...</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className={`app ${theme}`}>
            <Navbar onThemeToggle={toggleTheme} />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<ResearcherDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email/:token" element={<EmailVerification />} />

                {/* Researcher Routes */}
                <Route 
                  path="/dashboard" 
                  element={<ProtectedRoute element={<ResearcherDashboard />} />} 
                />
                <Route 
                  path="/profile" 
                  element={<ProtectedRoute element={<ProfileDashboard />} />} 
                />
                <Route 
                  path="/profile/basic-info" 
                  element={<ProtectedRoute element={<BasicInfo />} />} 
                />
                <Route 
                  path="/profile/publications" 
                  element={<ProtectedRoute element={<Publications />} />} 
                />
                <Route 
                  path="/profile/awards" 
                  element={<ProtectedRoute element={<Awards />} />} 
                />
                <Route 
                  path="/profile/teaching" 
                  element={<ProtectedRoute element={<TeachingExperience />} />} 
                />
                <Route 
                  path="/grants" 
                  element={<ProtectedRoute element={<GrantOpportunities />} />} 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute 
                      element={<AdminDashboard />} 
                      requiredRole="admin" 
                    />
                  } 
                />
                <Route 
                  path="/admin/verification" 
                  element={
                    <ProtectedRoute 
                      element={<VerificationDashboard />} 
                      requiredRole="admin" 
                    />
                  } 
                />

                {/* 404 Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <LanguageSwitcher />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
