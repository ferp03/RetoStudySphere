import React from 'react';
import NavBar from '../Components/NavBar';
import Header from '../Components/Header';
import ClassBox from '../Components/ClassBox';
import './MainPage.css';

const MainPage = () => {
  
  const classes = [
    {
      subject: 'Math',
      tasks: ['Math Quiz', 'Homework', 'Study']
    },
    {
      subject: 'Chemistry',
      tasks: ['Chemistry Quiz', 'Homework', 'Study']
    },
    {
      subject: 'History',
      tasks: ['History Quiz', 'Homework', 'Exam']
    },
    {
      subject: 'English',
      tasks: ['English Quiz', 'Homework', 'Study']
    },
    {
      subject: 'Biology',
      tasks: ['Biology Quiz', 'Homework', 'Study']
    },
    {
      subject: 'Geography',
      tasks: ['Geography Quiz', 'Homework', 'Study']
    },
  ];

  return (
    <div className="main-container">
      <NavBar />
      <div className="content">
        <Header />
        <div className="class-boxes-container">
          {classes.map((classData, index) => (
            <ClassBox
              key={index}
              subject={classData.subject}
              tasks={classData.tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
