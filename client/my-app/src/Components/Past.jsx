import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import axiosInstance from "../axiosInstance";
import "./Past.css";

const QuizDetails = ({ quiz, title }) => {
  return (
    <div className="quiz-details">
      <h2 className="quiz-title">Resultados de {title}</h2>
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Nombre del Alumno</th>
            <th>Respuestas Incorrectas</th>
            <th>Respuestas Correctas</th>
            <th>Calificación</th>
            <th>Confianza</th>
            <th>Desempeño</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(quiz).map(([nombreAlumno, detalles], index) => (
            <tr key={index}>
              <td className="quiz-student">{nombreAlumno}</td>
              <td className="quiz-incorrects">{detalles.incorrectas.join(", ")}</td>
              <td className="quiz-corrects">{detalles.correctas.join(", ")}</td>
              <td className="quiz-score">{detalles.calificacion}</td>
              <td className="quiz-confidence">{detalles.confidence.join(", ")}</td>
              <td className="quiz-performance">{detalles.performance}</td>
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
        setQuizzesInfo(response.data);
      } catch (error) {
        console.error("Error fetching quizzes info:", error);
      }
    };

    fetchQuizzesInfo();
  }, [claseId]);

  // Convert quizzesInfo to an array of values
  const quizzesToRender = Object.values(quizzesInfo).filter((quiz) =>
    quizArr.some((q) => q.quizid === quiz.quizid)
  );

  const handleQuizClick = (quizid, _title) => {
    const quiz = Object.entries(quizzesInfo).reduce((acc, [nombre, detalles]) => {
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
          {quizzesToRender.map((quiz, index) => {
            const correspondingQuiz = quizArr.find((q) => q.quizid === quiz.quizid);
            return (
              <div
                key={index}
                className="quiz-box"
                onClick={() => handleQuizClick(quiz.quizid, correspondingQuiz ? correspondingQuiz.nombre : quiz.quizid)}
              >
                <div className="quiz-title">{`${correspondingQuiz ? correspondingQuiz.nombre : quiz.quizid}`}</div>
                <div className="quiz-percentage">{`${quiz.calificacion}%`}</div>
                <div className="quiz-score">{quiz.calificacion}/100 Average</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="quiz-details-container">
          <QuizDetails quiz={selectedQuiz} title={qTitle}/>
        </div>
      )}
    </div>
  );
};

export default Past;
