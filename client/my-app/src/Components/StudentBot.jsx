import React, { useEffect, useState } from "react";
import "../Pages/QuizPage.css";

const StudentBot = ({ dificultad, interval, questionCount }) => {
    const [stats, setStats] = useState({
        answers: 0,
        correct: 0,
        incorrect: 0,
        confidence: 0,
        totalGrade: 0
    });

    const obtenerProbabilidad = (dificultad) => {
        switch (dificultad) {
            case 'facil':
                return 0.3;
            case 'mediano':
                return 0.6;
            case 'dificil':
                return 0.9;
            default:
                return 0;
        }
    };

    const generarRespuesta = (stats) => {
        const probabilidadAcierto = obtenerProbabilidad(dificultad);
        const acierto = Math.random() < probabilidadAcierto;
        const nuevaConfianza = Math.random() * 100;

        return {
            answers: stats.answers + 1,
            correct: stats.correct + (acierto ? 1 : 0),
            incorrect: stats.incorrect + (acierto ? 0 : 1),
            confidence: nuevaConfianza.toFixed(2),
            totalGrade: stats.totalGrade + (acierto ? 1 : 0),
        };
    };

    useEffect(() => {
        if (stats.answers < questionCount) {
            const timer = setInterval(() => {
                setStats(prevStats => {
                    if (prevStats.answers < questionCount) {
                        return generarRespuesta(prevStats);
                    } else {
                        clearInterval(timer);
                        return prevStats;
                    }
                });
            }, interval);
            return () => clearInterval(timer);
        }
    }, [stats.answers, interval, questionCount]);

    return (
        <div className="student-info">
            <div className="student-typeVal">
                <p>Answers:</p>
                <p>Correct:</p>
                <p>Incorrect:</p>
                <p>Confidence:</p>
                <p>Total Grade:</p>
            </div>
            <div className="student-value">
                <p>{stats.answers}</p>
                <p>{stats.correct}</p>
                <p>{stats.incorrect}</p>
                <p>{stats.confidence}%</p>
                <p>{stats.totalGrade}</p>
            </div>
        </div>
    );
};

export default StudentBot;
