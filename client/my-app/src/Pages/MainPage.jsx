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

  // return (
  //   <div>
  //     <h1>Welcome, {userInfo.info.nombre}</h1>
  //     {userInfo.tipoUsuario === 'maestro' ? (
  //       <div>
  //         <h2>Maestro Details</h2>
  //         <pre>{JSON.stringify(userInfo, null, 2)}</pre>
  //       </div>
  //     ) : (
  //       <div>
  //         <h2>Alumno Details</h2>
  //         <pre>{JSON.stringify(userInfo, null, 2)}</pre>
  //       </div>
  //     )}
  //     <div>
  //     <h2>Classes</h2>
  //     {userClases.map((clase, index) => (
  //       <div key={index}>
  //         <h3>{clase.nombreclase}</h3>
  //       </div>
  //     ))}
  //   </div>
  //   </div>
  // );
  
  return (
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
  );
};

export default MainPage;
