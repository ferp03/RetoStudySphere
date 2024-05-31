import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ongoing.css";


const Ongoing = ({claseId}) => {
    const [quizzes, setQuizzes ] = useState([]);

    const handleAnswerClick = (quizId) => {
      navigate(`/alumno/quiz/${quizId}`);
    };
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchQuizzes = async () => {
          try {
            const response = await axiosInstance.get(`/getQuizzes/${claseId}`);
            const data = response.data;
            console.log("quizzes:", data.quizzes.p_quizzes);
            setQuizzes(data.quizzes.p_quizzes);
          } catch (error) {
            console.error('Error fetching quizzes:', error);
          }
        };
    
        fetchQuizzes();
      }, [claseId]);

    return(
        <div>
            {quizzes ? (
                  <div className="ongoing-container">
                  {quizzes.map((quiz) => (
                    <div key={quiz.quizid} className="quiz-box">
                      <div className="quiz-title">{`${quiz.nombre}`}</div>
                      <button
                        className="quiz-answer"
                        onClick={() => handleAnswerClick(quiz.quizid)}
                      >
                        Answer
                      </button>
                    </div>
                  ))}
                </div>
            ) : (
            <p>No quizzes found for this class.</p>
            )}
        </div>
    )
}

export default Ongoing;