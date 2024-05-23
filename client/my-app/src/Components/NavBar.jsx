import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const { logout } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="nav-icon"><i className="fa fa-user"></i></div>  
      <div className="nav-icon"><i className="fa fa-home"></i></div>
      <div className="nav-icon"><i className="fa fa-calendar"></i></div>
      <div className="nav-icon"><i className="fa fa-tasks"></i></div>
      <div className="nav-icon logout" onClick={handleLogout}><i className="fa fa-sign"></i></div>
    </div>
  );
};

export default NavBar;
