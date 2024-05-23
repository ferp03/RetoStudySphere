
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import MainPage from './Pages/MainPage';
import LoginDiseño from './Pages/LoginDiseño';
import SignUpDiseño from './Pages/SignUpDiseño';
import './Pages/MainPage.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);

  };

  const AuthRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return(
      <Routes>
      {isAuthenticated ? (
        <>
          {/* Rutas para usuario autenticado */}
          <Route path="/mainpage" element={<MainPage />} />
          {/* Añadir otras rutas autenticadas aquí */}
        </>
      ) : (
        <>
          {/* Rutas para usuario no autenticado */}
          <Route path="/" element={<LoginDiseño />} />
          <Route path="/signup" element={<SignUpDiseño />} />
          <Route path="/auth/google/mainpage" element={<MainPage />} />
        </>
      )}
    </Routes>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
