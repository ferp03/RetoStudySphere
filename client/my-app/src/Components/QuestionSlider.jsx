import { useEffect, useState, useCallback } from "react";
import { Carousel } from "react-bootstrap";

const QuestionSlider = ({ searchQuiz, interval, questionCount }) => {
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(interval / 1000);
    const totalQ = questionCount;
    const handleSelect = useCallback((selectedIndex) => {
        setIndex(selectedIndex);
        setTimeLeft(interval / 1000); // reset the timer
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : interval / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [interval]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (index < totalQ) {
                handleSelect(index + 1);
            }else{
                setTimeLeft(0);
            }
        }
    }, [timeLeft, index, totalQ, interval, handleSelect]);


    return (
        <Carousel interval={null} activeIndex={index} onSelect={handleSelect} controls={false} variant="dark" className="question-bg">
            {searchQuiz && Object.entries(searchQuiz.preguntas).map(([question], idx) => (
                <Carousel.Item key={idx}>
                    <img src={"/slidebg.png"} alt="" className="d-block w-100 custom-rounded"/>
                    <Carousel.Caption className="center-caption">
                        <h3>{question}</h3>
                        <p>Time remaining: {timeLeft - 1}s</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
            {index === totalQ && (
                <Carousel.Item>
                    <img src={"/slidebg.png"} alt="" className="d-block w-100 custom-rounded"/>
                    <Carousel.Caption className="center-caption">
                        <h3>Quiz over</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            )}
        </Carousel>
    );
};

export default QuestionSlider;
