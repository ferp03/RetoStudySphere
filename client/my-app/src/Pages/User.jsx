import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import NavBar from '../Components/NavBar';
import Logo from '../Components/Logo';
import './User.css';

const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isSuccess: false });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/getUserInfo', { withCredentials: true });
        const result = await axiosInstance.get('/getUserLastUpdate', { withCredentials: true });
        const data = response.data;
        if (response.status === 200) {
          setUserInfo(data.userInfo);
          setLastUpdate(result.data.lastUpdate);
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
        setMessage({ text: 'Password changed successfully', isSuccess: true });
      } else {
        setMessage({ text: 'Failed to change password', isSuccess: false });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ text: `An error occurred while changing password: ${error.message}`, isSuccess: false });
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
          <table>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{userInfo.info.nombre}</td>
              </tr>
              <tr>
                <td><strong>Type:</strong></td>
                <td>{userInfo.info.tipousuario}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{userInfo.info.correo}</td>
              </tr>
              <tr>
                <td><strong>Last Update:</strong></td>
                <td>{lastUpdate ? new Date(lastUpdate).toLocaleString() : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
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
          {message.text && (
            <p style={{ color: message.isSuccess ? 'green' : 'red' }}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default User;
