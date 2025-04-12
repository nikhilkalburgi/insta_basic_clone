import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const CallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  font-size: 2rem;
  color: #e1306c;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #262626;
`;

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  
  useEffect(() => {
    const processAuth = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('auth_token', token);
          
          // Fetch user data
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to verify token');
          }
          
          const data = await response.json();
          console.log(data);
          setUser(data.user);
          setIsAuthenticated(true);
          
          // Redirect to profile page
          navigate('/profile');
        } else {
          setError('No authentication token received');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };
    
    processAuth();
  }, [location, navigate, setIsAuthenticated, setUser]);
  
  return (
    <CallbackContainer>
      {error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <LoadingSpinner />
          <Message>Completing authentication, please wait...</Message>
        </>
      )}
    </CallbackContainer>
  );
};

export default Callback;