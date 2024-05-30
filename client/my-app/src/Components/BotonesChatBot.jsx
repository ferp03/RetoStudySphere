import React from 'react';
import './BotonesChatBot.css';

const Botones = ({ onButtonClick }) => {
  const buttons = [
    { icon: "fas fa-question", text: "How many points did I get in the exam?" },
    { icon: "fas fa-calendar", text: "When do I have exam?" },
    { icon: "fas fa-user", text: "What is my Final Grade?" }
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
