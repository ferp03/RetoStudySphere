
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import MainPage from './Pages/MainPage';
import LoginDiseño from './Pages/LoginDiseño';
import SignUpDiseño from './Pages/SignUpDiseño';
import ChatBot from './Pages/ChatBot';
import User from './Pages/User';
import './Pages/MainPage.css';

function App() {
  const AuthRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return(
      <Routes>
      {isAuthenticated ? (
        <>
          {/* Rutas para usuario autenticado */}
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/user" element={<User />} />
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
