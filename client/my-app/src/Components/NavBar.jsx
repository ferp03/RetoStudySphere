import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="navbar">
      <button className="nav-button" onClick={() => navigate('/user')}><i className="fa fa-user"></i> </button>
      <button className="nav-button" onClick={() => navigate('/')}><i className="fa fa-home"></i> </button>
      <button className="nav-button" onClick={() => navigate('/game')}><i className="fa fa-gamepad"></i> </button>
      <button className="nav-button" onClick={() => navigate('/chatbot')}><i className="fa fa-robot"></i> </button>
      <button className="nav-button logout" onClick={handleLogout}><i className="fa fa-arrow-left"></i> </button>
    </div>
  );
}

export default NavBar;
