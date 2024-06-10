import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import NavBar from "../Components/NavBar";
import QuizMaestro from "../Components/QuizMaestro";
import QuizEstudiante from "../Components/QuizEstudiante";
import "./QuizPage.css";


const QuizPage = () => {
    const {claseId, quizId} = useParams();
    const { userType } = useContext(AuthContext);


    const Quiz = () => {
        if(userType === 'maestro'){
            return(
                <>
                <QuizMaestro quizId={quizId} claseId={claseId}/>
                </>
            )
        }else{
            return(
                <>
                <QuizEstudiante quizId={quizId} claseId={claseId}/>
                </>
            )
        }
    };

    return (
        <div className="main-container">
            <NavBar />
            <div className="content">
                {/*<div className="header"> <Logo /> </div>*/}
                <Quiz />
            </div>
        </div>
    )
}

export default QuizPage;