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

    const calcularPerformance = (totalGrade, confidence) => {
        const FR = totalGrade / questionCount;
        const FC = confidence / 100;

        let FRLevel = "Average";
        let FCLevel = "Average";

        if (FR >= 0.7) FRLevel = "High";
        else if (FR <= 0.3) FRLevel = "Low";

        if (FC >= 0.7) FCLevel = "High";
        else if (FC <= 0.3) FCLevel = "Low";

        if (FRLevel === "Average" && FCLevel === "Average") return "Average";
        if (FRLevel === "High" && FCLevel === "High") return "High";
        if (FRLevel === "Low" && FCLevel === "Low") return "Low";
        if (FRLevel === "High" && FCLevel === "Low") return "Average";
        if (FRLevel === "Low" && FCLevel === "High") return "Low";
        if (FRLevel === "Low" && FCLevel === "Average") return "Low";
        if (FRLevel === "Average" && FCLevel === "Low") return "Low";
        if (FRLevel === "Average" && FCLevel === "High") return "Average";
        if (FRLevel === "High" && FCLevel === "Average") return "Average";

        return "Average";
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

    const performance = calcularPerformance(stats.totalGrade, stats.confidence);

    return (
        <div className="student-info">
            <div className="student-typeVal">
                <p>Answers:</p>
                <p>Correct:</p>
                <p>Incorrect:</p>
                <p>Confidence:</p>
                <p>Performance:</p>
            </div>
            <div className="student-value">
                <p>{stats.answers}</p>
                <p>{stats.correct}</p>
                <p>{stats.incorrect}</p>
                <p>{stats.confidence}%</p>
                <p>{performance}</p>
            </div>
        </div>
    );
};

export default StudentBot;
