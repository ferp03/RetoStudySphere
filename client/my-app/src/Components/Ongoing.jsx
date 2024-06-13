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
          // Ensure data.quizzes.p_quizzes is always an array
          const fetchedQuizzes = data.quizzes.p_quizzes || [];
          // Update only if the data is different
          if (JSON.stringify(fetchedQuizzes) !== JSON.stringify(quizArr)) {
            setQuizArr(fetchedQuizzes);
          }
          setQuizzes(fetchedQuizzes);
        } else {
          console.error("Failed to fetch quizzes:", data.error);
          setQuizzes([]); // Set to empty array in case of error
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]); // Set to empty array in case of error
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
                  See students
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
