import React from "react";
import { useNavigate } from "react-router-dom";
import "./Ongoing.css";

const Ongoing = () => {
  const quizzes = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const navigate = useNavigate();

  const handleAnswerClick = (quizId) => {
    navigate(`/alumno/quiz/${quizId}`);
  };

  return (
    <div className="ongoing-container">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-box">
          <div className="quiz-title">{`Quiz ${quiz.id}`}</div>
          <button
            className="quiz-answer"
            onClick={() => handleAnswerClick(quiz.id)}
          >
            Answer
          </button>
        </div>
      ))}
    </div>
  );
};

export default Ongoing;
