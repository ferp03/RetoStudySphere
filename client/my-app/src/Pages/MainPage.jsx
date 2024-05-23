import React from 'react';
import NavBar from '../Components/NavBar';
import Header from '../Components/Header';
import ClassBox from '../Components/ClassBox';
import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './MainPage.css';

const MainPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.post("/getUserInfo");
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
  } 

  return (
    <div>
      {userClases ? (
        <div className="main-container">
          <NavBar />
          <div className="content">
            <Header userInfo={userInfo}/>
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
      ) : (
        <NoClases />
      )}
    </div>
  )
};

export default MainPage;
