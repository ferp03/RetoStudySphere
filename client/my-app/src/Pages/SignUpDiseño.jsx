import React, { useState, useContext } from 'react';
import './LoginDiseño.css';
import axiosInstance from '../axiosInstance';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthContext';

const SignUpDiseño = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axiosInstance.post('/signup',
            { name, email, password, isTeacher },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(response.data);
          if (response.data.authenticated) {
            setIsAuthenticated(true);
            handleSignUpClick();

          }
        } catch (error) {
          console.error('Error al registrarse:', error);
        }
      };
    
      const handleLoginClick = () =>{
        navigate('/');
      };
    
      const handleGoogleSignUp = () => {
        window.location.href = axiosInstance.post('/auth/google');
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
                    <h2 style={{margin: 0}}>¡Welcome to StudySphere!</h2>
                    <h5 style={{margin: 0}}>Type in your information to get started in the best quizzes platform!</h5>
                {/* Forms e inputs */}
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Name</h3>
                        <i className="fas fa-solid fa-user" style={{marginBottom: 7}}></i>
                    </div>
                        <input className='ovalInput'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>

                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Email</h3>
                        <i className="fas fa-solid fa-envelope" style={{marginBottom: 7}}></i>
                    </div>
                        <input className='ovalInput'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/
                        >
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Password</h3>
                        <i className="fas fa-solid fa-lock" style={{marginBottom: 7}}></i>
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
                                    I'm a Teacher
                                </label>
                            </div>

                            <div className="form-check">
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                I accept <t style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>terms and conditions</t>
                            </label>
                            </div>
                        </div>
                {/* Botón de Sign Up */}
                        <div className='LoginButtonContainer'>
                            <button type="submit" className="btn btn-dark" style={{width: '90%', height: '60px', borderRadius: '15px'}}>Sign Up</button>
                        </div>
                        <div className='LoginLinesContainer'>
                            <div className='LoginLines'/>
                            <div className='LoginLines'/>
                            <div className='LoginLines'/>
                        </div>
                {/* Botón de Google  */}

                {/* Redirect a Login */}
                        <div className='LoginRegistrateContainer'>
                            <label>Already have an account?</label>
                            <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginLeft: 5}}
                            onClick={handleLoginClick}> Log in </label>
                        </div>
                </form>
            </div> 
    </div>
    );
};

export default SignUpDiseño;