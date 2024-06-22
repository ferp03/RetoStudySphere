import React, { useContext, useState } from 'react';
import './LoginDiseño.css';
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../AuthContext';

const LoginDiseño = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/login", {
                email,
                password,
            });
            console.log(response.data);
            if (response.data.authenticated) {
                setIsAuthenticated(true);
                handleLoginClick();
            } else {
                setErrorMessage("Incorrect credentials. Please, try it again.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Error logging in. Please, verify your credentials.");
        }
    };
    

      const handleSignUpClick = () => {
        navigate('/signup');
      };

      const handleLoginClick = () =>{
        navigate('/');
      };

      const handleGoogleLogin = () => {
        window.location.href = axiosInstance.post("/auth/google");

      };
    
      return (
        <div className='backgroundContainer'>
            <div className='LoginContainer'>
                <form className='FormsContainer' onSubmit={handleSubmit}>
                    <h2 style={{margin: 0}}>Welcome Back!</h2>
                    <h5 style={{margin: 0}}>Type in your credentials to keep going!</h5>
                    {/* Mostrar mensaje de error */}
                    {errorMessage && (
                        <div className="error-message" style={{ color: 'red', marginTop: 10 }}>
                            {errorMessage}
                        </div>
                    )}
                    {/* Forms e inputs */}
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Email</h3>
                        <i className="fa-solid fa-envelope" style={{marginBottom: 6}}></i>
                    </div>
                    <input className='ovalInput' 
                        type='email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Password</h3>
                        <i className="fa-solid fa-lock" style={{marginBottom: 6}}></i>
                    </div>
                    <input className='ovalInput' 
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Recuerdame y olvidé mi contraseña */}
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Remember me
                            </label>
                        </div>
                        <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>Forgot your password?</label>
                    </div>
                    {/* Botón de Log In */}
                    <div className='LoginButtonContainer'>
                        <button type="submit" className="btn btn-dark" style={{width: '90%', height: '60px', borderRadius: '15px'}}>Log In</button>
                    </div>
                    <div className='LoginLinesContainer'>
                        <div className='LoginLines'/>
                        <p style={{margin: 0, paddingLeft: 8, paddingRight: 8, fontWeight: 500}}>or continue with</p>
                        <div className='LoginLines'/>
                    </div>
                    {/* Botón de Google  */}
                    <div className='LoginGoogleButtonContainer'>
                        <button type="button" onClick={handleGoogleLogin} className="btn btn-secondary" style={{width: '30%', background: 'transparent', color: 'black', border: '1px solid black', borderRadius: '15px'}}>
                            <i className="fab fa-google" style={{paddingRight: '10px', color: 'black'}}></i>
                            Google
                        </button>
                    </div>
                    {/* Redirect a sign up */}
                    <div className='LoginRegistrateContainer'>
                        <label>Don't have an account?</label>
                        <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginLeft: 5}}
                            onClick={handleSignUpClick}> 
                            Register
                        </label>
                    </div>
                </form>
            </div> 
    
            <div className='LogoContainer'>
                <div className='AlignLogo'>
                    <img src='/logo.png' alt='Logo' style={{width: '50%'}} />
                    <img src='logoTitle.png' alt='Nombre' style={{width: '80%'}}/>
                </div>
            </div>
        </div>
    );
}    

export default LoginDiseño;
