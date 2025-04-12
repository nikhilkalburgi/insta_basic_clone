import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaInstagram, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: white;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log(isAuthenticated, window.location.pathname)
    if(isAuthenticated && window.location.pathname === '/') {
      window.location.replace(`/profile`);
    }
  }, [isAuthenticated])
  return (
    <NavContainer>
      <Logo>
        <FaInstagram /> InstaConnect
      </Logo>
      <NavLinks>
        {isAuthenticated ? (
          <>
            <NavLink to="/profile"><FaUser /> Profile</NavLink>
            <NavLink to="/logout"><FaSignOutAlt /> Logout</NavLink>
          </>
        ) : (
          <NavLink to="/login">Login with Instagram</NavLink>
        )}
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;