import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import MainPage from './MainPage';
import LoginDiseño from './LoginDiseño';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {isAuthenticated ? ( //usuario ya autentificado
        <>
          <Route path="/" element={<MainPage />} />
        </>
        ) : (
          <>
          <Route path="/Diseno" element={<LoginDiseño/>} />
            <Route path="/" element={<Login onAuthentication={handleAuthentication}/> } />
            <Route path="/signup" element={<SignUp onAuthentication={handleAuthentication} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
