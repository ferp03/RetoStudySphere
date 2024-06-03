import axiosInstance from "../axiosInstance";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Ongoing.css";


const Ongoing = ({claseId, subject}) => {
    const [quizzes, setQuizzes ] = useState([]);
    const { userType } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClickEvent = (quizId) => {
      navigate(`quiz/${quizId}`);
    };

  
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

    if(userType === 'maestro'){
      return(
        <div>
            {quizzes ? (
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
    )
    }else{
      return(
          <div>
              {quizzes ? (
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
      )
    }
}

export default Ongoing;