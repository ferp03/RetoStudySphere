import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClassBox.css';


const icons = [
  'fa-book', 'fa-pencil', 'fa-flask', 'fa-atom', 'fa-music',
  'fa-brush', 'fa-laptop', 'fa-globe', 'fa-microscope'
];


const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * 7);
  return icons[randomIndex];
};


const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * 4);
  return `./subject${randomIndex}.jpg`;
};

const ClassBox = ({ subject, claseId, userType }) => {
  const navigate = useNavigate();
  const randomIcon = getRandomIcon();
  const randomImage = getRandomImage();

  const handleRedirect = () => {
    navigate(`/clases/${userType}/${claseId}/${subject}`);
  };

  return (
    <div className="class-box" onClick={handleRedirect}>
      <div className="class-header">
        <div className="class-icon">
          <i className={`fas ${randomIcon}`}></i>
        </div>
        <h3 className="class-subject">{subject}</h3>
      </div>
      <div className="image-container">
        <img src={randomImage} alt={subject} />
      </div>
    </div>
  );
};

export default ClassBox;
