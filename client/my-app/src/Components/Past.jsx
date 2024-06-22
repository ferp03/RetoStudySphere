import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import axiosInstance from "../axiosInstance";
import "./Past.css";

const QuizDetails = ({ quiz, title }) => {
  return (
    <div className="quiz-details">
      <h2 className="quiz-title">Answers from {title}</h2>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Incorrect Answers</th>
            <th>Correct Answers</th>
            <th>Grade</th>
            <th>Confidence</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(quiz).map(([nombreAlumno, detalles], index) => (
            <tr key={index}>
              <td className="quiz-student">{nombreAlumno}</td>
              <td className="quiz-incorrects">{detalles?.incorrectas?.join(", ")}</td>
              <td className="quiz-corrects">{detalles?.correctas?.join(", ")}</td>
              <td className="quiz-score">{detalles?.calificacion}</td>
              <td className="quiz-confidence">{detalles?.confidence?.join(", ")}</td>
              <td className="quiz-performance">{detalles?.performance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Past = ({ claseId }) => {
  const { quizArr } = useContext(AuthContext);
  const [quizzesInfo, setQuizzesInfo] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [qTitle, setTitle] = useState('');

  useEffect(() => {
    const fetchQuizzesInfo = async () => {
      try {
        const response = await axiosInstance.get(`getAlumnoClaseQuiz/${claseId}`);
        setQuizzesInfo(response.data || {}); // Asegurarse de que sea un objeto
      } catch (error) {
        console.error("Error fetching quizzes info:", error);
        setQuizzesInfo({}); // Asegurarse de que sea un objeto
      }
    };

    fetchQuizzesInfo();
  }, [claseId]);

  const quizzesToRender = Object.values(quizzesInfo || {}).reduce((acc, quiz) => {
    if (!acc[quiz.quizid]) {
      acc[quiz.quizid] = {
        quizid: quiz.quizid,
        total_score: 0,
        num_students: 0,
        nombre: quizArr.find((q) => q.quizid === quiz.quizid)?.nombre || quiz.quizid,
      };
    }
    acc[quiz.quizid].total_score += quiz.calificacion;
    acc[quiz.quizid].num_students += 1;
    return acc;
  }, {});


  const quizzesArray = Object.values(quizzesToRender).map((quiz) => ({
    quizid: quiz.quizid,
    average_score: quiz.total_score / quiz.num_students,
    nombre: quiz.nombre,
  }));

  const handleQuizClick = (quizid, _title) => {
    const quiz = Object.entries(quizzesInfo || {}).reduce((acc, [nombre, detalles]) => {
      if (detalles.quizid === quizid) {
        acc[nombre] = detalles;
      }
      return acc;
    }, {});
    setSelectedQuiz(quiz);
    setTitle(_title);
  };

  return (
    <div className="pastcontainer">
      {!selectedQuiz ? (
        <div className="quizzes-grid">
          {quizzesArray.map((quiz, index) => {
            const correspondingQuiz = quizArr.find((q) => q.quizid === quiz.quizid);
            return (
              <div
                key={index}
                className="quiz-box"
                onClick={() => handleQuizClick(quiz.quizid, correspondingQuiz ? correspondingQuiz.nombre : quiz.quizid)}
              >
                <div className="quiz-title">{`${correspondingQuiz ? correspondingQuiz.nombre : quiz.quizid}`}</div>
                <div className="quiz-percentage">{`${quiz.average_score}%`}</div>
                <div className="quiz-score">{`${quiz.average_score}/100 Average`}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="quiz-details-container">
          <QuizDetails quiz={selectedQuiz} title={qTitle} />
        </div>
      )}
    </div>
  );
};

export default Past;
