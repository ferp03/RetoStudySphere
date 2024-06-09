import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import QuestionSlider from "./QuestionSlider";
import StudentBot from "./StudentBot";
import "../Pages/QuizPage.css";

const QuizMaestro = ({quizId}) => {
    const { quizArr, nombreUsuario } = useContext(AuthContext);
    const numericQuizId = Number(quizId);
    const searchQuiz = quizArr.find(quiz => quiz.quizid === numericQuizId);
    const questionCount = Object.keys(searchQuiz.preguntas).length;
    const interval = 11000; //contador para respuestas y preguntas

    return (
        <div className="body-container">
            <div className="upper-half">
                <div className="teacher-container">
                    <div className="teacher-img"> <img src={"/teacherImg.svg"} alt="" className="d-block h-100"/></div>
                    <div className="teacher-name">
                        Profesor {nombreUsuario}
                    </div>
                </div>
                <div className="question-container">
                    {searchQuiz && <QuestionSlider searchQuiz={searchQuiz} interval={interval} questionCount={questionCount}/> }
                </div>
                <div className="podium-container">
                    <div className="podium-bg">

                    </div>
                </div>
            </div>

            <div className="lower-half">
                <div className="student-container">
                    <div className="student-img"> <img src={"/student1.svg"} alt="" className="d-block h-100"/></div>
                    <div className="student-content">
                        <div className="student-name">David Mireles </div>
                        <StudentBot dificultad={'facil'} interval={interval} questionCount={questionCount}/>
                    </div>
                </div>
                <div className="student-container">
                    <div className="student-img"> <img src={"/student2.svg"} alt="" className="d-block h-100"/></div>
                    <div className="student-content">
                        <div className="student-name">Alejandro Charles</div>
                        <StudentBot dificultad={'mediano'} interval={interval} questionCount={questionCount}/>
                    </div>
                </div>
                <div className="student-container">
                    <div className="student-img"> <img src={"/student3.svg"} alt="" className="d-block h-100"/></div>
                    <div className="student-content">
                        <div className="student-name">Antonio Bento</div>
                        <StudentBot dificultad={'dificil'} interval={interval} questionCount={questionCount}/>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default QuizMaestro;