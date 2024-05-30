import React, { useState, useEffect } from 'react';
import ChatInput from '../Components/ChatInput';
import ChatMessage from '../Components/ChatMessage';
import NavBar from '../Components/NavBar';
import Botones from '../Components/BotonesChatBot';
import Logo from '../Components/Logo';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' }
  ]);
  const [showButtons, setShowButtons] = useState(true);

  const handleSendMessage = async (message) => {
    setShowButtons(false);
    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);

    try {
      const response = await fetch('https://studysphereserver-fernandos-projects-88891e4a.vercel.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages([...newMessages, { text: 'Oops! Algo salió mal. Intenta de nuevo.', sender: 'bot' }]);
    }
  };

  const handleButtonClick = (message) => {
    handleSendMessage(message);
  };

  useEffect(() => {
    const chatBox = document.querySelector('.chatbox');
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  return (
    <>
      <NavBar />
      <div className="chatbot-container">
        <div className="chatbot">
          <div className='headerXd'>
            <Logo />
            <h2 id='titleXd'>TutorAI</h2>
          </div>
          {showButtons && <Botones onButtonClick={handleButtonClick} />}
          <ul className="chatbox">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </ul>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatBot;
