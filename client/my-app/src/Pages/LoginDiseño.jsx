import React from 'react';
import './LoginDiseño.css';

const LoginDiseño = () => {
return(
    <div className='backgroundContainer'>
            <div className='LoginContainer'>
                <div className='FormsContainer'>
                    <h2 style={{margin: 0}}>¡Bienvenido!</h2>
                    <h5 style={{margin: 0}}>Ingresa tus credenciales para ingresar</h5>
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Correo electrónico</h3>
                        <i className="fa-solid fa-envelope" style={{marginBottom: 6}}></i>
                    </div>
                        <input className='ovalInput'/>
                    <div className='titleIconContainer'>
                        <h3 style={{marginBottom: 0, marginTop: 30, marginRight: 10}}>Contraseña</h3>
                        <i className="fa-solid fa-lock" style={{marginBottom: 6}}></i>
                    </div>
                        <input className='ovalInput'/>
                    

                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Recuerdame
                            </label>
                            </div>
                            <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>Olvidé mi contraseña</label>
                        </div>

                        <div className='LoginButtonContainer'>
                            <button type="button" className="btn btn-dark" style={{width: '90%', height: '60px', borderRadius: '15px'}}>Log In</button>
                        </div>
                        <div className='LoginLinesContainer'>
                            <div className='LoginLines'/>
                            <p style={{margin: 0, paddingLeft: 8, paddingRight: 8, fontWeight: 500}}>o continuar con</p>
                            <div className='LoginLines'/>
                        </div>
                        <div className='LoginGoogleButtonContainer'>
                            <button type="button" className="btn btn-secondary" style={{width: '30%', background: 'transparent', color: 'black', border: '1px solid black', borderRadius: '15px'}}>
                                <i className="fab fa-google" style={{paddingRight: '10px', color: 'black'}}></i>
                                Google
                            </button>
                        </div>
                        <div className='LoginRegistrateContainer'>
                            <label>¿No tienes cuenta?</label>
                            <label style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginLeft: 5}}> Regístrate</label>
                        </div>
                </div>
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