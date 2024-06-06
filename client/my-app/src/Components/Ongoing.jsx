import axiosInstance from "../axiosInstance";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Ongoing.css";

const Ongoing = ({ claseId, subject }) => {
  const [quizzes, setQuizzes] = useState([]);
  const { userType, quizArr, setQuizArr } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClickEvent = (quizId) => {
    navigate(`quiz/${quizId}`);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axiosInstance.get(`/getQuizzes/${claseId}`);
        const data = response.data;
        if (response.status === 200) {
          // Actualizar solo si los datos son diferentes
          if (JSON.stringify(data.quizzes.p_quizzes) !== JSON.stringify(quizArr)) {
            setQuizArr(data.quizzes.p_quizzes);
          }
          setQuizzes(data.quizzes.p_quizzes);
          console.log("quizzes:", data.quizzes.p_quizzes);
          console.log("quizzes Arr:", quizArr);
        } else {
          console.error("Failed to fetch quizzes:", data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };

    if (loading) {
      fetchQuizzes();
    }
  }, [claseId, loading, quizArr, setQuizArr]);

  if (userType === 'maestro') {
    return (
      <div>
        {quizzes.length > 0 ? (
          <div className="ongoing-container">
            {quizzes.map((quiz) => (
              <div key={quiz.quizid} className="quiz-box">
                <div className="quiz-title">{`${quiz.nombre}`}</div>
                <button
                  className="quiz-answer"
                  onClick={() => handleClickEvent(quiz.quizid)}
                >
                  View results
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No quizzes scheduled right now.</p>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {quizzes.length > 0 ? (
          <div className="ongoing-container">
            {quizzes.map((quiz) => (
              <div key={quiz.quizid} className="quiz-box">
                <div className="quiz-title">{`${quiz.nombre}`}</div>
                <button
                  className="quiz-answer"
                  onClick={() => handleClickEvent(quiz.quizid)}
                >
                  Answer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No quizzes to solve right now.</p>
        )}
      </div>
    );
  }
};

export default Ongoing;
