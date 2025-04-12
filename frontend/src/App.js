import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Callback from './components/Callback';
import Profile from './components/Profile';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #fafafa;
`;

function App() {
  const [loginUrl, setLoginUrl] = useState('');
  
  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await axios.get('/api/auth/instagram/url');
        setLoginUrl(response.data.url);
      } catch (error) {
        console.error('Failed to fetch Instagram auth URL:', error);
      }
    };
    
    fetchAuthUrl();
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage loginUrl={loginUrl} />} />
            <Route path="/auth/success" element={<Callback />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Logout component
const Logout = () => {
  const { logout } = React.useContext(AuthContext);
  
  useEffect(() => {
    logout();
  }, [logout]);
  
  return <Navigate to="/" />;
};

export default App;