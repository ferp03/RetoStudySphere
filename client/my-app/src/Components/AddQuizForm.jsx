import React, { useState } from 'react';
import { Tab, Nav, Form } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import moment from 'moment';

const AddQuizForm = ({ claseId }) => {
    const [name, setName] = useState('');
    const [questions, setQuestions] = useState([
        { question: '', answers: [{ answer: '', correct: false }] }
    ]);
    const [dueDate, setDueDate] = useState('');
    const [activeTab, setActiveTab] = useState('0');

    const addQuestion = () => {
        const newIndex = questions.length;
        setQuestions([...questions, { question: '', answers: [{ answer: '', correct: false }] }]);
        setActiveTab(newIndex.toString());
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(newQuestions);
        setActiveTab('0');
    };

    const addAnswer = (qIndex) => {
        const newQuestions = questions.map((q, index) => {
            if (index === qIndex) {
                return { ...q, answers: [...q.answers, { answer: '', correct: false }] };
            }
            return q;
        });
        setQuestions(newQuestions);
    };

    const removeAnswer = (qIndex, aIndex) => {
        const newQuestions = questions.map((q, index) => {
            if (index === qIndex) {
                return { ...q, answers: q.answers.filter((_, index) => index !== aIndex) };
            }
            return q;
        });
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = questions.map((q, qIndex) => {
            if (index === qIndex) {
                return { ...q, question: event.target.value };
            }
            return q;
        });
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, event) => {
        const newQuestions = questions.map((q, index) => {
            if (index === qIndex) {
                const newAnswers = q.answers.map((a, ansIndex) => {
                    if (aIndex === ansIndex) {
                        return { ...a, answer: event.target.value };
                    }
                    return a;
                });
                return { ...q, answers: newAnswers };
            }
            return q;
        });
        setQuestions(newQuestions);
    };

    const handleCorrectChange = (qIndex, aIndex, event) => {
        const newQuestions = questions.map((q, index) => {
            if (index === qIndex) {
                const newAnswers = q.answers.map((a, ansIndex) => {
                    if (aIndex === ansIndex) {
                        return { ...a, correct: event.target.checked };
                    }
                    return a;
                });
                return { ...q, answers: newAnswers };
            }
            return q;
        });
        setQuestions(newQuestions);
    };
    
    const handleAddQuiz = () => {
        const _formattedQuestions = questions.reduce((acc, q) => {
            const correctAnswer = q.answers.find(a => a.correct);
            acc[q.question] = {
                answers: q.answers.map(a => a.answer),
                correct: correctAnswer ? correctAnswer.answer : null
            };
            return acc;
        }, {});
        const formattedDateTime = moment(dueDate).format();
        return [_formattedQuestions, formattedDateTime];
    };
    
    const postQuiz = async (event) => {
        try {
            event.preventDefault();
            const [_questions, dueDate] = handleAddQuiz();
            console.log(name, _questions, claseId, dueDate);
            const response = await axiosInstance.post("/addQuiz", { name, _questions, claseId, dueDate });
            if(response.status === 200){
                console.log("Quiz created");
            }else{      
                event.preventDefault();
                console.log("Error al agregar quiz");
            }
        } catch (error) {
            event.preventDefault();
            console.log("Unexpected error, try again");
        }
    };


    return (
        <form onSubmit={postQuiz}>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                <label className="form-label">Name:</label>
            </div>
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav variant="tabs">
                    {questions.map((q, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link eventKey={index.toString()}>Question {index + 1}</Nav.Link>
                        </Nav.Item>
                    ))}
                    <Nav.Item>
                        <Nav.Link onClick={addQuestion}>Add new question</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    {questions.map((q, qIndex) => (
                        <Tab.Pane eventKey={qIndex.toString()} key={qIndex}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                />
                                <label className="form-label">Question {qIndex + 1}:</label>
                            </div>
                            {q.answers.map((a, aIndex) => (
                                <div className="mb-3" key={aIndex}>
                                    <label htmlFor={`answer-${qIndex}-${aIndex}`} className="form-label">Answer {aIndex + 1}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={`answer-${qIndex}-${aIndex}`}
                                        value={a.answer}
                                        onChange={(event) => handleAnswerChange(qIndex, aIndex, event)}
                                    />
                                    <div style={{ marginTop: '4px' }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`correct-${qIndex}-${aIndex}`}
                                            checked={a.correct}
                                            onChange={(event) => handleCorrectChange(qIndex, aIndex, event)}
                                        />
                                        <label className="form-check-label" htmlFor={`correct-${qIndex}-${aIndex}`}>Correct answer</label>
                                        <button type="button" className="btn btn-outline-secondary btn-sm ms-2" onClick={() => removeAnswer(qIndex, aIndex)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <button type="button" className="btn btn-primary mb-3 me-2" onClick={() => addAnswer(qIndex)}>Add new answer</button>
                                <button type="button" className="btn btn-danger mb-3" onClick={() => removeQuestion(qIndex)}>Remove question</button>
                            </div>
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
            <div className='modal-footer'>
                <Form.Group >
                    <Form.Label>Due date</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary ms-3">Submit</button>
            </div>
        </form>
    );
};

export default AddQuizForm;
