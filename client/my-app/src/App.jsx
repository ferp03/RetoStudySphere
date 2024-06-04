
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import MainPage from './Pages/MainPage';
import LoginDiseño from './Pages/LoginDiseño';
import SignUpDiseño from './Pages/SignUpDiseño';
import ChatBot from './Pages/ChatBot';
import User from './Pages/User';
import ClassPage from './Pages/ClassPage';
import Game from './Pages/Game';
import QuizPage from './Pages/QuizPage';
import './Pages/MainPage.css';

function App() {
  const AuthRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return(
      <Routes>
      {isAuthenticated ? (
        <>
          {/* Rutas para usuario autenticado */}
          <Route path="/" element={<MainPage />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/user" element={<User />} />
          <Route path="/game" element={<Game />} />
          {/* ejemplo de contexto aqui donde pueda accesar a el tipo de usuario y a la clase en la que se encuentra*/}
          <Route path="/clases/:claseId/:subject" element={<ClassPage />} />
          <Route path="clases/:claseId/:subject/quiz/*" element={<QuizPage />} />
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
