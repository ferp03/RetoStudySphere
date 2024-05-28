import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import NavBar from '../Components/NavBar';
import Logo from '../Components/Logo';
import './User.css';

const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/getUserInfo', { withCredentials: true });
        const data = response.data;
        if (response.status === 200) {
          setUserInfo(data.userInfo);
        } else {
          console.error('Failed to fetch user info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/changePassword', {
        currentPassword,
        newPassword,
      }, { withCredentials: true });

      if (response.status === 200) {
        setMessage('Password changed successfully');
      } else {
        setMessage('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(`An error occurred while changing password: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <div>Error fetching user information</div>;
  }

  return (
    <>
      <NavBar />
      <div className="user-container">
        <header>
          <Logo />
          <h1>User Information</h1>
        </header>
        <div className="user-info">
          <p><strong>Name:</strong> {userInfo.info.nombre}</p>
          <p><strong>Type:</strong> {userInfo.info.tipousuario}</p>
          <p><strong>Email:</strong> {userInfo.info.correo}</p>
        </div>
        <div className="change-password">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div>
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit">Change Password</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
};

export default User;
