import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import MainPage from './MainPage';
import LoginDiseño from './LoginDiseño';
import Clase from './Components/Clase';


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
          <Route path="/" element={<MainPage />} />
        </>
        ) : (
          <>
          {/* rutas de prueba */}
          <Route path="/diseno" element={<LoginDiseño/>} />
          <Route path="/clases" element={<Clase name='Mate'/>} />

          {/* rutas de reales usuario no autentificado */}
            <Route path="/" element={<Login onAuthentication={handleAuthentication}/> } />
            <Route path="/signup" element={<SignUp onAuthentication={handleAuthentication} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
