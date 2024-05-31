import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { useState } from "react";
import AddQuizForm from "../Components/AddQuizForm";
import Past from "../Components/Past";
import Ongoing from "../Components/Ongoing";
import "./ClassPage.css";


const ClassPage = () => {
    const { claseId, userType, subject } = useParams();
    const [ current, setCurrent ] = useState(1);

    const Headers = () => {
        if(userType  === 'maestro'){
            return(
                <div className="subject-quizzes-container">
                    <div className="top-bar">{subject}</div>
                    <div className="quizzes-container">
                        <div className="quizzes-box">
                            <h3 
                            style={{cursor: "pointer", textDecoration: current===1 ? "underline" : ""}}
                            onClick={() => setCurrent(1)} >Ongoing Quizzes</h3>
                        </div>
                        <div className="quizzes-box">
                            <h3 style={{cursor: "pointer", textDecoration: current===2 ? "underline" : ""}}
                            onClick={() => setCurrent(2)}
                            >Past Quizzes</h3>
                        </div>
                        <div className="quizzes-box">
                        <h3 style={{cursor: "pointer", textDecoration: current===3 ? "underline" : ""}}
                            onClick={() => setCurrent(3)}
                            >Add Quiz</h3>
                        </div>
                    </div>
                </div>
            )
        }else{   
            return (
                <div className="subject-quizzes-container">
                    <div className="top-bar">{subject}</div>
                    <div className="quizzes-container">
                        <div className="quizzes-box">
                            <h3 
                            style={{cursor: "pointer", textDecoration: current ? "underline" : ""}}
                            onClick={() => setCurrent(true)} >Ongoing Quizzes</h3>
                        </div>
                        <div className="quizzes-box">
                            <h3 style={{cursor: "pointer", textDecoration: current ? "" : "underline"}}
                            onClick={() => setCurrent(false)}
                            >Past Quizzes</h3>
                        </div>
                    </div>
                </div>
            )
        }
    };

    const ClassContent = () => {
        if(current===1){
            return(
                <div >
                    <Ongoing claseId={claseId}/>
                </div>
            )
        }
        if(current===2){
            return <Past />
        }
        if(current===3){
            return(
                <div className="add-quiz-container">
                    <div className="add-quiz-title">Add new quiz</div>
                    <div className="add-quiz-table">
                        <AddQuizForm claseId={claseId} />
                    </div>
                </div>
            )
        }
    }

    return(
        <div className="main-container">
            <NavBar />
            <div className="content">
                <Headers />
                <ClassContent />
            </div>
        </div>
    )
};

export default ClassPage;