import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import NavBar from "../Components/NavBar";
import QuizMaestro from "../Components/QuizMaestro";
import "./QuizPage.css";


const QuizPage = () => {
    const {claseId, quizId} = useParams();
    const { userType } = useContext(AuthContext);


    const Quiz = () => {
        if(userType === 'maestro'){
            return(
                <>
                <QuizMaestro quizId={quizId}/>
                </>
            )
        }else{
            return(
                <></>
            )
        }
    };

    return (
        <div className="main-container">
            <NavBar />
            <div className="content">
                <Quiz />
            </div>
        </div>
    )
}

export default QuizPage;