import React from 'react';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="nav-icon"><i className="fa fa-user"></i></div>  
      <div className="nav-icon"><i className="fa fa-home"></i></div>
      <div className="nav-icon"><i className="fa fa-calendar"></i></div>
      <div className="nav-icon"><i className="fa fa-tasks"></i></div>
      <div className="nav-icon logout"><i className="fa fa-sign"></i></div>
    </div>
  );
};

export default NavBar;
