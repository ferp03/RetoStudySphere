import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import LoginDiseño from './Pages/LoginDiseño';
import SignUpDiseño from './Pages/SignUpDiseño';



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
          {/* rutas reales usuario autentificado */}
          <Route path="/mainpage" element={<MainPage />} />
        </>
        ) : (
          <>
          {/* rutas de prueba */}

          {/* rutas de reales usuario no autentificado */}
            <Route path="/" element={<LoginDiseño onAuthentication={handleAuthentication}/> } />
            <Route path="/signup" element={<SignUpDiseño onAuthentication={handleAuthentication} />} />
            <Route path="/auth/google/mainpage" element={<MainPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
