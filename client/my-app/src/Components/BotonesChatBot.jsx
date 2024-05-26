import React from 'react';
import './BotonesChatBot.css';

const Botones = ({ onButtonClick }) => {
  return (
    <div className="buttons-container">
      <div className="button" onClick={onButtonClick}>
        <img src="/path/to/icon1.png" alt="" />
        <p>How many points did I get in the exam?</p>
      </div>
      <div className="button" onClick={onButtonClick}>
        <img src="/path/to/icon2.png" alt="" />
        <p>When do I have exam?</p>
      </div>
      <div className="button" onClick={onButtonClick}>
        <img src="/path/to/icon3.png" alt="" />
        <p>What is my Final Grade?</p>
      </div>
    </div>
  );
};

export default Botones;
