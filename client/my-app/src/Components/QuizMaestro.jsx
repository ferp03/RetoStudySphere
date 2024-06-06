import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { AuthContext } from "../AuthContext";
import "../Pages/QuizPage.css";
import { useSearchParams } from "react-router-dom";

const QuestionSlider = ({ searchQuiz }) => {
    const interval = 10000;
    const [ timeLeft, setTimeLeft ] = useState(interval / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (1 ? prev - 1 : interval/1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if(timeLeft === -1){
            setTimeLeft(interval/1000);
        }
    }, [timeLeft]);

    return (
        <Carousel interval={interval} controls={false} variant="dark" className="question-bg">
            {searchQuiz && Object.entries(searchQuiz.preguntas).map(([question, details], index) => (
                <Carousel.Item key={index} >
                    <img src={"/slidebg.png"} className="d-block w-100 custom-rounded"/>
                    <Carousel.Caption className="center-caption">
                        <h3>{question}</h3>
                        <p>Tiempo restante: {timeLeft}s</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};


const QuizMaestro = ({quizId}) => {
    const { quizArr } = useContext(AuthContext);

    console.log('quiz id:', quizId, 'quiz:', quizArr);
    const numericQuizId = Number(quizId);
    const searchQuiz = quizArr.find(quiz => quiz.quizid === numericQuizId);
    console.log(searchQuiz);
    
    {/* <ul>
        {details.answers.map((answer, idx) => (
            <li key={idx}>{answer}</li>
        ))}
    </ul> */}


    return (
        <div className="body-container">
            <div className="upper-half">
                <div className="teacher-container">
                    <div className="teacher-img"></div>
                    <div className="teacher-name">
                        Profesor Fernando
                    </div>
                </div>
                <div className="question-container">
                    {searchQuiz && <QuestionSlider searchQuiz={searchQuiz} /> }
                </div>
                <div className="podium-container">
                    <div className="podium-bg">

                    </div>
                </div>
            </div>

            <div className="lower-half">
                <div className="student-container">
                    <div className="student-img"></div>
                </div>
                <div className="student-container">
                    <div className="student-img"></div>
                </div>
                <div className="student-container">
                    <div className="student-img"></div>
                </div>
            </div>
        </div>
    )
};


export default QuizMaestro;