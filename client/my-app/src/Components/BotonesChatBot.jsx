import React from 'react';
import './BotonesChatBot.css';

const Botones = ({ onButtonClick }) => {
  const buttons = [
    { icon: "fas fa-question", text: "What classes am I enrolled in? " },
    { icon: "fas fa-calendar", text: "What are the ids of my Classes that I am registered for?" },
    { icon: "fas fa-user", text: "What are my classes about?" }
  ];

  return (
    <div className="buttons-container">
      {buttons.map((button, index) => (
        <div
          key={index}
          className="button"
          onClick={() => onButtonClick(button.text)}
        >
          <i className={button.icon}></i>
          <p>{button.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Botones;
