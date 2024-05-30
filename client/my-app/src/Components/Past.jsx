import React from "react";
import "./Past.css";

const Past = () => {
  const quizzes = [
    { id: 1, percentage: "60", score: "6" },
    { id: 2, percentage: "90", score: "9" },
    { id: 3, percentage: "80", score: "8" },
    { id: 4, percentage: "80", score: "8" },
    { id: 5, percentage: "80", score: "8" },
  ];

  return (
    <div className="pastcontainer">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-box">
          <div className="quiz-title">{`Quiz ${quiz.id}`}</div>
          <div className="quiz-percentage">{`${quiz.percentage}%`}</div>
          <div className="quiz-score">{quiz.score}/10 Average</div>
        </div>
      ))}
    </div>
  );
};

export default Past;
