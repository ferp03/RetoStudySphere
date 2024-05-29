import React from 'react';
import NavBar from '../Components/NavBar';
import Header from '../Components/Header';
import ClassBox from '../Components/ClassBox';
import Modal from '../Components/Modal';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './MainPage.css';

const MainPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/getUserInfo", {withCredentials: true});
        const data = response.data;
        if (response.status === 200) {
          setUserInfo(data.userInfo);
        } else {
          console.error("Failed to fetch user info:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);
  // No borrar
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <div> {userInfo} </div>;
  }
  

  // Tomar el json completo y asignar el apartado de clases a userClases
  let userClases  = userInfo.clases;
  let userType =  userInfo.info.tipousuario;

  const NoClases = () => {
    return(
      <div className='main-container'>
        <NavBar />
        <div className='content'>
          <Header userInfo={userInfo} />
          <div>
            <p>No tienes clases registradas, habla con tu maestro para que te enrole en la clase que buscas</p>
          </div>
        </div>
      </div>
    );
  } ;

  const AddClasses = ({isMaestro}) => {
    const [showModal, setShowModal] = useState(false);
  
    const handleShow = () => {
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
    };
    let flag = isMaestro === 'maestro';
    if(flag){
      return(  
          <div className="add-class-btn">
            <button className="custom-button" type="button" onClick={() => handleShow('Agrega tu clase aqui')}>
              <span className="custom-button__text">Add Class</span>
              <span className="custom-button__icon">
                <svg className="custom-svg" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </span>
            </button>
            <Modal show={showModal} handleClose={handleClose} />
          </div>
      
      );

    }else{
      return(
        <div>
        </div>
      );
    }
  };

  return (
    <div>
      {userClases ? (
        <div className="main-container">
          <NavBar />
          <div className="content">
            <Header userInfo={userInfo}/>
            <div className='body-container'>
              <AddClasses isMaestro={userType} />
              <div className="class-boxes-container">
                {userClases.map((clase, index) => (
                  <ClassBox
                  key={index}
                  subject={clase.nombreclase}
                  tasks={[]} // Ver manera de poder editar el apartado de tasks
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoClases />
      )}
    </div>
  )
};

export default MainPage;
