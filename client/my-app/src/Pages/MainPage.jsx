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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return <div> {userInfo} </div>;
  }
  
  return (
    <div>
      <h1>Welcome, {userInfo.info.nombre}</h1>
      {userInfo.tipoUsuario === 'maestro' ? (
        <div>
          <h2>Maestro Details</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <h2>Alumno Details</h2>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  // const classes = [
  //   {
  //     subject: 'Math',
  //     tasks: ['Math Quiz', 'Homework', 'Study']
  //   },
  //   {
  //     subject: 'Chemistry',
  //     tasks: ['Chemistry Quiz', 'Homework', 'Study']
  //   },
  //   {
  //     subject: 'History',
  //     tasks: ['History Quiz', 'Homework', 'Exam']
  //   },
  //   {
  //     subject: 'English',
  //     tasks: ['English Quiz', 'Homework', 'Study']
  //   },
  //   {
  //     subject: 'Biology',
  //     tasks: ['Biology Quiz', 'Homework', 'Study']
  //   },
  //   {
  //     subject: 'Geography',
  //     tasks: ['Geography Quiz', 'Homework', 'Study']
  //   },
  // ];

  // return (
  //   <div className="main-container">
  //     <NavBar />
  //     <div className="content">
  //       <Header />
  //       <div className="class-boxes-container">
  //         {classes.map((classData, index) => (
  //           <ClassBox
  //             key={index}
  //             subject={classData.subject}
  //             tasks={classData.tasks}
  //           />
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default MainPage;
