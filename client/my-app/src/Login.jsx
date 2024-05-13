import React, { useState } from "react";
import axios from "axios";
import './LoginForm.css';
import '@fortawesome/fontawesome-free/css/all.css';


const Login = ({ onAuthentication, togglePage }) => { // Pasamos togglePage como prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      console.log(response.data);
      if (response.data.authenticated) {
        onAuthentication();
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="login-form">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      <div className="social-buttons">
        <button className="google-button">
          <i className="fab fa-google"></i> {/* Icono de Google */}
          Continuar con Google
        </button>
      </div>
      <p>
        ¿No tienes una cuenta?{' '}
        <span onClick={togglePage} style={{ cursor: 'pointer', color: 'blue' }}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
