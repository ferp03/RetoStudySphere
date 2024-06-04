import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import NavBar from "../Components/NavBar";
import "./QuizPage.css";


const QuizPage = () => {
    const {claseId, quizId} = useParams();
    const { userType } = useContext(AuthContext);


    const Render = () => {
        if(userType === 'maestro'){
            return(
                <></>
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
                <h3>Vista de {userType}</h3>
            </div>
        </div>
    )
}

export default QuizPage;