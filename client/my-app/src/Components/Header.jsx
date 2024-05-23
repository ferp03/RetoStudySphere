import React from 'react';
import './Header.css';

const Header = ({ userInfo }) => {
  return (
    <div className="header">
      <h1>Welcome back! <p>{userInfo.info.nombre}</p> </h1>
      <img src="/logo.png" alt="Logo" className="logo"/>
    </div>
  );
};

export default Header;
