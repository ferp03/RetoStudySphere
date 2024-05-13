import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import MainPage from './MainPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const togglePage = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Router>
      <Routes>
        {isAuthenticated ? ( //usuario ya autentificado
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        ) : (
          <>
            <Route path="/" element={isSignUp ? <SignUp onAuthentication={handleAuthentication} togglePage={togglePage} /> : <Login onAuthentication={handleAuthentication} togglePage={togglePage} />} />
            <Route path="/signup" element={<SignUp onAuthentication={handleAuthentication} togglePage={togglePage} />} />
            <Route path="/login" element={<Login onAuthentication={handleAuthentication} togglePage={togglePage} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
