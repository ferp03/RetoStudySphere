import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import axiosInstance from "../axiosInstance";
import "./Past.css";

const Past = ({claseId}) => {
  const {quizArr} = useContext(AuthContext);
  const [quizzesInfo, setQuizzesInfo] = useState([]);


  //iba a hacer una llamada al backend a una funcion -> SELECT obtener_alumno_clase_quiz(8);
  // esta funcion regresa toda la info que tenga x clase id
  // en base a eso iba a hacer una comparacion con quizArr para renderizar los quizzesId que coinciden entre ambos jsons
  // renderizas los quizzes que si tienen informacion y la muestras

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

  const quizzesToRender = quizzesInfo.filter((quiz) =>
    quizArr.some((q) => q.quizid === quiz.quizid)
  );

  console.log(quizzesToRender);

  return (
    <div className="pastcontainer">
      {quizzesToRender.map((quiz) => (
        <div key={quiz.quizid} className="quiz-box">
          <div className="quiz-title">{`Quiz ${quiz.quizid}`}</div>
          <div className="quiz-percentage">{`${quiz.calificacion * 10}%`}</div>
          <div className="quiz-score">{quiz.calificacion}/10 Average</div>
        </div>
      ))}
    </div>
  );
};

export default Past;
