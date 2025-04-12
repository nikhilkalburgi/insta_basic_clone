/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styled from 'styled-components';
import { FaInstagram } from 'react-icons/fa';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #262626;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #8e8e8e;
  max-width: 600px;
`;

const LoginButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;


const HomePage = ({ loginUrl }) => {
  
  return (
    <HomeContainer>
      <Title>Connect with your Instagram</Title>
      <Subtitle>
        View your profile, posts, and interact with your Instagram content all in one place.
      </Subtitle>
      <LoginButton href={loginUrl}>
        <FaInstagram size={20} /> Login with Instagram
      </LoginButton>
    </HomeContainer>
  );
};

export default HomePage;