import React, { useState } from 'react';
import SignUp from './SignUp';
import Login from './Login';
import MainPage from './MainPage';
import './styles.css';

function App() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const togglePage = () => {
    setIsSignUp(!isSignUp);
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handlePageToggle = () => {
    setIsSignUp(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <MainPage />
      ) : isSignUp ? (
        <SignUp
          onAuthentication={handleAuthentication}
          togglePage={togglePage}
          handlePageToggle={handlePageToggle}
        />
      ) : (
        <Login
          onAuthentication={handleAuthentication}
          togglePage={togglePage} // Pasamos togglePage para cambiar a la página de registro
        />
      )}
      {!isSignUp && (
        <p>
          ¿No tienes una cuenta?{' '}
          <span onClick={togglePage} style={{ cursor: 'pointer', color: 'blue' }}>
            Sign Up
          </span>
        </p>
      )}
    </div>
  );
}

export default App;
