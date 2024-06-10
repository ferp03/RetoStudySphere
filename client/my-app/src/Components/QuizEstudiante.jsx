import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import QuestionSlider from "./QuestionSlider";

import "./QuizEstudiante.css";

const ScoreBoard = ({ nombreUsuario }) => {
  return (
    <div className="score-board">
      <div className="teacher-img"><img src={"/student1.svg"} alt="foto de perfil" className="avatar" /> </div>
      <div className="user-info-quiz">
        <p className="user-name">{nombreUsuario}</p>
        <p className="user-score">Score: 1250 pts</p>
      </div>
    </div>
  );
};

const Podium = () => {
  return (
    <div className="podium">
      <h3>Podium</h3>
      <p>Ernesto S. ............... 1250</p>
      <p>Josefina G. .............. 1150</p>
      <p>Charles G. ............... 1050</p>
      <p>Eugenio M. ............... 900</p>
    </div>
  );
};

const QuizEstudiante = ({ quizId, claseId }) => {
  const { quizArr, nombreUsuario } = useContext(AuthContext);
  const interval = 11000;
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(interval / 1000);
  const [answerArray, setAnswerArray] = useState([]);
  const [confidenceLvl, setConfidenceLvl] = useState([]);
  const [hasClicked, setHasClicked] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [results, setResults] = useState(null);

  const numericQuizId = Number(quizId);
  const searchQuiz = quizArr.find((quiz) => quiz.quizid === numericQuizId);
  const questionCount = Object.keys(searchQuiz.preguntas).length;
  const totalQ = questionCount;

  /* {"quizid":2,
  "nombre":"quiz sql prueba",
  "preguntas":{
    "que hace el metodo select?":
      {"answers":["selecciona informacion","borra informacion"],
        "correct":"selecciona informacion"},
    "como borras una tabla?":
      {"answers":["Delete","Truncate","Drop"],
        "correct":"Drop"}},
  "fechaentrega":"2024-05-30T23:18:00+00:00"} */

  const calcularPerformance = useCallback((totalGrade, confidence) => {
    const FR = totalGrade / totalQ;
    const FC = confidence;

    let FRLevel = "Average";
    let FCLevel = "Average";

    if (FR >= 0.7) FRLevel = "High";
    else if (FR <= 0.3) FRLevel = "Low";

    if (FC >= 0.7) FCLevel = "High";
    else if (FC <= 0.3) FCLevel = "Low";

    if (FRLevel === "Average" && FCLevel === "Average") return "Average";
    if (FRLevel === "High" && FCLevel === "High") return "High";
    if (FRLevel === "Low" && FCLevel === "Low") return "Low";
    if (FRLevel === "High" && FCLevel === "Low") return "Average";
    if (FRLevel === "Low" && FCLevel === "High") return "Low";
    if (FRLevel === "Low" && FCLevel === "Average") return "Low";
    if (FRLevel === "Average" && FCLevel === "Low") return "Low";
    if (FRLevel === "Average" && FCLevel === "High") return "Average";
    if (FRLevel === "High" && FCLevel === "Average") return "Average";

    return "Average";
  }, [totalQ]);


  useEffect(() => {
    if (isQuizFinished) {
      const correctAnswers = [];
      const incorrectAnswers = [];
      const correctAnswersArray = Object.values(searchQuiz.preguntas).map(pregunta => pregunta.correct);
      for (let i = 0; i < correctAnswersArray.length; i++) {
        if (answerArray[i] === correctAnswersArray[i]) {
          correctAnswers.push(answerArray[i]);
        } else {
          incorrectAnswers.push(answerArray[i]);
        }
      }
      const totalConfidence = confidenceLvl.reduce((a, b) => a + b, 0) / confidenceLvl.length;

      const performance = calcularPerformance(correctAnswers.length, totalConfidence);
      console.log("Performance Level:", performance);

      // Establecer resultados
      setResults({
        correctAnswers: correctAnswers.length,
        incorrectAnswers: incorrectAnswers.length,
        performance,
        totalConfidence
      });
    }
  }, [isQuizFinished, answerArray, confidenceLvl, searchQuiz.preguntas, calcularPerformance, totalQ]);

  const handleClick = useCallback((questionSelected) => {
    if (!hasClicked) {
      setAnswerArray((prevAnswerArray) => [...prevAnswerArray, questionSelected]);
      const confidence = parseFloat((timeLeft / (interval / 1000)).toFixed(2));
      console.log(questionSelected, confidence);
      setHasClicked(true);
      setConfidenceLvl((prevConfidenceLvl) => [...prevConfidenceLvl, confidence]);
    }
  }, [hasClicked, timeLeft, interval]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return parseFloat((prev - 0.1).toFixed(1));
        } else {
          return 0;
        }
      });
    }, 100);

    if (isQuizFinished) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [interval, isQuizFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !isQuizFinished) {
      if (index < totalQ) {
        if (!hasClicked) {
          setAnswerArray((prevAnswerArray) => [...prevAnswerArray, "no answer"]);
          setConfidenceLvl((prevConfidenceLvl) => [...prevConfidenceLvl, 0]);
        }
        if (index + 1 < totalQ) {
          setIndex((prevIndex) => prevIndex + 1);
          setTimeLeft(interval / 1000);
          setHasClicked(false);
        } else {
            setIsQuizFinished(true); //al ser true, se corre el useEffect para la calificacion
        }
      }
    }
  }, [timeLeft, index, totalQ, interval, hasClicked, answerArray, isQuizFinished]);

  const colorcl = (index) => {
    const colors = ["blue", "red", "green", "yellow"];
    return colors[index % colors.length];
  };

  const AnswerOpt = ({ answers }) => {
    return (
      <div className="answer-section">
          <div className="answers">
            {answers.map((answer, idx) => (
              <button onClick={() => handleClick(answer)} key={idx} className={`answer ${colorcl(idx)}`}>
                {answer}
              </button>
            ))}
          </div>
      </div>
    );
  };

  const Results = ({ results }) => {
    return (
      <div className="results-section">
        <h2>Quiz Results</h2>
        <p>Correct Answers: {results.correctAnswers}</p>
        <p>Incorrect Answers: {results.incorrectAnswers}</p>
        <p>Performance Level: {results.performance}</p>
        <p>Average Confidence Level: {(results.totalConfidence * 100).toFixed(2)}%</p>
      </div>
    );
  };
  

  

return (
  <div>
    <div className="quiz-page">
      <div className="quiz-left">
        <ScoreBoard nombreUsuario={nombreUsuario} />
      </div>
      <div className="quiz-center">
        <div className="question-container">
          {searchQuiz && (
            <QuestionSlider
              searchQuiz={searchQuiz}
              interval={interval}
              questionCount={questionCount}
            />
          )}
        </div>
        {searchQuiz && !isQuizFinished && (
          <AnswerOpt
            answers={Object.values(searchQuiz.preguntas)[index].answers}
          />
        )}
        {isQuizFinished && results &&(
          <Results results={results}/>
        )}
      </div>
      <div className="quiz-right">
        <Podium />
      </div>
    </div>
  </div>
);
};

export default QuizEstudiante;
