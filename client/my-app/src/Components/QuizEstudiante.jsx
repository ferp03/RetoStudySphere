import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import QuestionSlider from "./QuestionSlider";
import axiosInstance from "../axiosInstance";
import "./QuizEstudiante.css";

const ScoreBoard = ({ nombreUsuario, ansCount }) => (
  <div className="score-board">
    <div className="teacher-img">
      <img src={"/student1.svg"} alt="foto de perfil" className="avatar" />
    </div>
    <div className="user-info-quiz">
      <p className="user-name">{nombreUsuario}</p>
      <p className="user-score">Score: {ansCount} pts</p>
    </div>
  </div>
);

const bots = [
  { name: "Alejandro Charles", dificultad: "facil" },
  { name: "David Mireles", dificultad: "mediano" },
  { name: "Antonio Bento", dificultad: "dificil" }
];

const Podium = ({ botStats, correctAnswersCount, nombreUsuario }) => {
  const combinedResults = [
    ...botStats,
    { name: nombreUsuario, correctAnswers: correctAnswersCount }
  ];
  const sortedResults = combinedResults.sort((a, b) => b.correctAnswers - a.correctAnswers);

  return (
    <div className="podium">
      <h3>Podium</h3>
      {sortedResults.map((result, index) => (
        <p key={index}>
          {result.name} ............... {result.correctAnswers}
        </p>
      ))}
    </div>
  );
};

const QuizEstudiante = ({ quizId, claseId }) => {
  const { quizArr, nombreUsuario, id } = useContext(AuthContext);
  const interval = 11000;
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(interval / 1000);
  const [answerArray, setAnswerArray] = useState([]);
  const [confidenceLvl, setConfidenceLvl] = useState([]);
  const [hasClicked, setHasClicked] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  const [botStats, setBotStats] = useState(
    bots.map((bot) => ({
      name: bot.name,
      correctAnswers: 0,
      incorrectAnswers: 0
    }))
  );

  const numericQuizId = Number(quizId);
  const searchQuiz = quizArr.find((quiz) => quiz.quizid === numericQuizId);
  const questionCount = Object.keys(searchQuiz.preguntas).length;
  const totalQ = questionCount;

  const obtenerProbabilidad = (dificultad) => {
    switch (dificultad) {
      case 'facil':
        return 0.3;
      case 'mediano':
        return 0.6;
      case 'dificil':
        return 0.9;
      default:
        return 0;
    }
  };

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



  // Proceso al finalizar quiz
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
        name: nombreUsuario,
        correctAnswers: correctAnswersCount,
        incorrectAnswers: incorrectAnswersCount,
        performance,
        totalConfidence
      });
  
      // Datos a enviar a la base de datos
      const data = {
        alumnoId: id, 
        claseId,
        quizId: numericQuizId,
        incorrectas: JSON.stringify(incorrectAnswers),
        correctas: JSON.stringify(correctAnswers),
        calificacion: (correctAnswers.length / totalQ)*100,
        confidence: JSON.stringify(confidenceLvl),
        performance
      };
  
      // Función para enviar los resultados
      const submitResults = async () => {
        try {
          const response = await axiosInstance.post("/submitQuizResults", data);
          if (response.status === 200) {
            console.log('Resultados subidos correctamente');
          } else {
            console.log('Error al subir resultados');
          }
        } catch (error) {
          console.error('There was an error!', error);
        }
      };
  
      // Llamada a la función para enviar los resultados
      submitResults();
    }
  }, [isQuizFinished, answerArray, confidenceLvl, searchQuiz.preguntas, calcularPerformance, totalQ, correctAnswersCount, incorrectAnswersCount, nombreUsuario, id]);
  

  // Handler para la seleccion de respuesta
  const handleClick = useCallback((questionSelected) => {
    if (!hasClicked) {
      setAnswerArray((prevAnswerArray) => [...prevAnswerArray, questionSelected]);

      // Procesamiento para ver si la respuesta es correcta
      const correctAnswersArray = Object.values(searchQuiz.preguntas).map(
        (pregunta) => pregunta.correct
      );
      if (questionSelected === correctAnswersArray[index]) {
        setCorrectAnswersCount((prevCount) => prevCount + 1);
      } else {
        setIncorrectAnswersCount((prevCount) => prevCount + 1);
      }

      const confidence = parseFloat((timeLeft / (interval / 1000)).toFixed(2));
      console.log(questionSelected, confidence);
      setHasClicked(true);
      setConfidenceLvl((prevConfidenceLvl) => [...prevConfidenceLvl, confidence]);
    }
  }, [hasClicked, timeLeft, interval, searchQuiz.preguntas, index]);

  // Timer
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

  // Siguiente pregunta
  useEffect(() => {
    if (timeLeft === 0 && !isQuizFinished) {
      if (index < totalQ) {
        if (!hasClicked) {
          setAnswerArray((prevAnswerArray) => [...prevAnswerArray, "no answer"]);
          setConfidenceLvl((prevConfidenceLvl) => [...prevConfidenceLvl, 0]);
          setIncorrectAnswersCount((prevCount) => prevCount + 1); // No responder una pregunta cuenta como incorrecta
        }
        if (index + 1 < totalQ) {
          setIndex((prevIndex) => prevIndex + 1);
          setTimeLeft(interval / 1000);
          setHasClicked(false);
          // Actualizar estadísticas de los bots con cada nueva pregunta
          setBotStats((prevBotStats) =>
            prevBotStats.map((botStat, botIndex) => {
              const probabilidadAcierto = obtenerProbabilidad(bots[botIndex].dificultad);
              const acierto = Math.random() < probabilidadAcierto;
              return {
                ...botStat,
                correctAnswers: botStat.correctAnswers + (acierto ? 1 : 0),
                incorrectAnswers: botStat.incorrectAnswers + (acierto ? 0 : 1),
              };
            })
          );
        } else {
          setIsQuizFinished(true); // Al ser true, se corre el useEffect para la calificacion
        }
      }
    }
  }, [timeLeft, index, totalQ, interval, hasClicked, answerArray, isQuizFinished]);

  const colorcl = (index) => {
    const colors = ["blue", "red", "green", "yellow"];
    return colors[index % colors.length];
  };

  const AnswerOpt = ({ answers }) => (
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

  const Results = ({ results }) => (
    <div className="results-section">
      <h2>Quiz Results</h2>
      <p>Correct Answers: {results.correctAnswers}</p>
      <p>Incorrect Answers: {results.incorrectAnswers}</p>
      <p>Performance Level: {results.performance}</p>
      <p>Average Confidence Level: {(results.totalConfidence * 100).toFixed(2)}%</p>
    </div>
  );

  return (
    <div>
      <div className="quiz-page">
        <div className="quiz-left">
          <ScoreBoard nombreUsuario={nombreUsuario} ansCount={correctAnswersCount} />
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
            <AnswerOpt answers={Object.values(searchQuiz.preguntas)[index].answers} />
          )}
          {isQuizFinished && results && (
            <Results results={results} />
          )}
        </div>
        <div className="quiz-right">
          <Podium correctAnswersCount={correctAnswersCount} botStats={botStats} nombreUsuario={nombreUsuario} />
        </div>
      </div>
    </div>
  );
};

export default QuizEstudiante;
