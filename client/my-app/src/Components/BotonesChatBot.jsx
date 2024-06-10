import React from 'react';
import './BotonesChatBot.css';

const Botones = ({ onButtonClick }) => {
  const buttons = [
    { icon: "fas fa-question", text: "¿En qué Clases estoy inscrito?" },
    { icon: "fas fa-calendar", text: "Cuales son los ids de mis Clases a las que estoy inscrito?" },
    { icon: "fas fa-user", text: "De que se tratan mis clases?" }
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
