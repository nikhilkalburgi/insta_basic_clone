/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaUser, FaSpinner } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Feed from './Feed';

const ProfileContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  margin-bottom: 44px;
  
  @media (max-width: 735px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImageContainer = styled.div`
  margin-right: 30px;
  width: 150px;
  height: 150px;
  
  @media (max-width: 735px) {
    margin: 0 auto 20px;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #dbdbdb;
`;

const ProfilePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #fafafa;
  border: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8e8e8e;
  font-size: 50px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileUsername = styled.h1`
  font-size: 28px;
  font-weight: 300;
  line-height: 32px;
  margin-bottom: 12px;
`;

const ProfileStats = styled.ul`
  display: flex;
  list-style: none;
  margin-bottom: 20px;
  
  @media (max-width: 735px) {
    justify-content: center;
  }
`;

const ProfileStat = styled.li`
  margin-right: 40px;
  font-size: 16px;
  
  span {
    font-weight: 600;
  }
`;

const ProfileName = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  font-size: 2rem;
  color: #e1306c;
  margin: 50px auto;
  display: block;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ed4956;
  text-align: center;
  margin: 50px 0;
  font-size: 16px;
`;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProfile(response.data.profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImageContainer>
          {profile?.profilePicture ? (
            <ProfileImage src={profile.profilePicture} alt={profile.username} />
          ) : (
            <ProfilePlaceholder>
              <FaUser />
            </ProfilePlaceholder>
          )}
        </ProfileImageContainer>
        
        <ProfileInfo>
          <ProfileUsername>{profile?.username}</ProfileUsername>
          <ProfileStats>
            <ProfileStat>
              <span>{profile?.mediaCount || 0}</span> posts
            </ProfileStat>
            {/* Instagram API doesn't provide follower/following counts in Basic Display API */}
            <ProfileStat>
              <span>--</span> followers
            </ProfileStat>
            <ProfileStat>
              <span>--</span> following
            </ProfileStat>
          </ProfileStats>
          <ProfileName>{profile?.fullName}</ProfileName>
        </ProfileInfo>
      </ProfileHeader>

      <Feed />
    </ProfileContainer>
  );
};

export default Profile;