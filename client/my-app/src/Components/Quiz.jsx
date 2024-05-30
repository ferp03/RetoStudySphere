import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";


const Quiz = ({claseId}) => {
    const [quizzes, setQuizzes ] = useState([]);
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
            <h1>Quizzes for Class {claseId}</h1>
            {quizzes ? (
            <ul>
                {quizzes.map((quiz, index) => (
                <li key={index}>
                    <h2>{quiz.nombre}</h2>
                    <p>{JSON.stringify(quiz.preguntas)}</p>
                    <p>Due Date: {quiz.fechaentrega}</p>
                </li>
                ))}
            </ul>
            ) : (
            <p>No quizzes found for this class.</p>
            )}
        </div>
    )
}

export default Quiz;