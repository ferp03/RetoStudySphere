import React, { useState, useEffect } from 'react';
import ChatInput from '../Components/ChatInput';
import ChatMessage from '../Components/ChatMessage';
import NavBar from '../Components/NavBar';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' }
  ]);

  const handleSendMessage = async (message) => {
    setMessages([...messages, { text: message, sender: 'user' }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      setMessages([...messages, { text: message, sender: 'user' }, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages([...messages, { text: message, sender: 'user' }, { text: 'Oops! Algo salió mal. Intenta de nuevo.', sender: 'bot' }]);
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector('.chatbox');
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <div className="chatbot-container">
      <NavBar />
      <div className="chatbot">
        <header>
          <h2>Asesor Financiero</h2>
        </header>
        <ul className="chatbox">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </ul>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatBot;
