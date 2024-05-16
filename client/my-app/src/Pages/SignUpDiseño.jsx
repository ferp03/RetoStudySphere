import React, { useState } from 'react';
import './LoginDiseño.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpDiseño = ({ onAuthentication }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            'http://localhost:8000/signup',
            { name, email, password, isTeacher },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(response.data);
          if (response.data.authenticated) {
            onAuthentication();
            handleSignUpClick();
          }
        } catch (error) {
          console.error('Error al registrarse:', error);
        }
      };
    
      const handleLoginClick = () =>{
        navigate('/disenoL');
      };
    
      const handleGoogleSignUp = () => {
        window.location.href = 'http://localhost:8000/auth/google';
      };
      
      const handleSignUpClick = () => {
        navigate('/');
      };
    

return (
    <div className='backgroundContainer'>
            <div className='LogoContainer'>
                <div className='AlignLogo'>
                    <img src='/logo.png' alt='Logo' style={{width: '50%'}} />
                    <img src='logoTitle.png' alt='Nombre' style={{width: '80%'}}/>
                </div>
            </div>

            <div className='LoginContainer'>
                <form className='FormsContainer' onSubmit={handleSubmit}>
                    <h2 style={{margin: 0}}>¡Bienvenido a StudySphere!</h2>
                    <h5 style={{margin: 0}}>Ingresa tus datos para registrarte en la mejor plataforma de quizzes</h5>
                {/* Forms e inputs */}
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Nombre</h3>
                        <i className="fa-solid fa-user" style={{marginBottom: 7}}></i>
                    </div>
                        <input className='ovalInput'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>

                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Correo electrónico</h3>
                        <i className="fa-solid fa-envelope" style={{marginBottom: 7}}></i>
                    </div>
                        <input className='ovalInput'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/
                        >
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Contraseña</h3>
                        <i className="fa-solid fa-lock" style={{marginBottom: 7}}></i>
                    </div>
                        <input className='ovalInput'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    
                {/* Soy Maestro y terminos  */}
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    <input className="form-check-input" type="checkbox"
                                    checked={isTeacher}
                                    onChange={(e) => setIsTeacher(e.target.checked)}/>
                                    Soy Maestro
                                </label>
                            </div>

                            <div className="form-check">
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                Acepto <t style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>términos y condiciones</t>
                            </label>
                            </div>
                        </div>
                {/* Botón de Sign Up */}
                        <div className='LoginButtonContainer'>
                            <button type="submit" className="btn btn-dark" style={{width: '90%', height: '60px', borderRadius: '15px'}}>Sign Up</button>
                        </div>
                        <div className='LoginLinesContainer'>
                            <div className='LoginLines'/>
                            <p style={{margin: 0, paddingLeft: 8, paddingRight: 8, fontWeight: 500}}>o continuar con</p>
                            <div className='LoginLines'/>
                        </div>
                {/* Botón de Google  */}
                        <div className='LoginGoogleButtonContainer'>
                            <button type="button" onClick={handleGoogleSignUp} className="btn btn-secondary" style={{width: '30%', background: 'transparent', color: 'black', border: '1px solid black', borderRadius: '15px'}}>
                                <i className="fab fa-google" style={{paddingRight: '10px', color: 'black'}}></i>
                                Google
                            </button>
                        </div>
                {/* Redirect a Login */}
                        <div className='LoginRegistrateContainer'>
                            <label>¿Ya tienes una cuenta?</label>
                            <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginLeft: 5}}
                            onClick={handleLoginClick}> Inicia sesión</label>
                        </div>
                </form>
            </div> 
    </div>
    );
};

export default SignUpDiseño;