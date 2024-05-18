import React from 'react';
import './ClassBox.css';

const ClassBox = ({ subject, tasks}) => {
  return (
    <div className="class-box">
      <div className="class-header">
        <div className="class-icon">
          <img src="" />
        </div>
        <h3 className="class-subject">{subject}</h3>
      </div>
      <div className="task-list-container">
        <h4 className="task-list-title">To do:</h4>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className="task-item">{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassBox;