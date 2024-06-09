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

const QuizEstudiante = ({ quizId }) => {
  const { quizArr, nombreUsuario } = useContext(AuthContext);
  const interval = 2000;
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(interval / 1000);
  const [answerArray, setAnswerArray] = useState([]);
  const [hasClicked, setHasClicked] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const numericQuizId = Number(quizId);
  const searchQuiz = quizArr.find((quiz) => quiz.quizid === numericQuizId);
  const questionCount = Object.keys(searchQuiz.preguntas).length;
  const totalQ = questionCount;


  const sendQuiz = async () => {
    
  }

  const handleClick = useCallback((questionSelected) => {
    if (!hasClicked) {
      setAnswerArray((prevAnswerArray) => [...prevAnswerArray, questionSelected]);
      setHasClicked(true);
      console.log(questionSelected);
    }
  }, [hasClicked]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          return 0;
        }
      });
    }, 1000);

    if (isQuizFinished) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [interval, isQuizFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !isQuizFinished) {
      if (index < totalQ) {
        if (!hasClicked) {
          setAnswerArray((prevAnswerArray) => [...prevAnswerArray, undefined]);
        }
        if (index + 1 < totalQ) {
          setIndex((prevIndex) => prevIndex + 1);
          setTimeLeft(interval / 1000);
          setHasClicked(false);
        } else {
            console.log(answerArray);
            setIsQuizFinished(true);
            //llamada al api
            sendQuiz();
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
            <button onClick={() => handleClick(idx)} key={idx} className={`answer ${colorcl(idx)}`}>
              {answer}
            </button>
          ))}
        </div>
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
          {searchQuiz && (
            <AnswerOpt
              answers={Object.values(searchQuiz.preguntas)[index].answers}
            />
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
