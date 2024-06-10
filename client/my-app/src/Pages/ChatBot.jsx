import React, { useState, useEffect } from 'react';
import ChatInput from '../Components/ChatInput';
import ChatMessage from '../Components/ChatMessage';
import NavBar from '../Components/NavBar';
import Botones from '../Components/BotonesChatBot';
import Logo from '../Components/Logo';
import './ChatBot.css';
import axiosInstance from '../axiosInstance'; 

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' }
  ]);
  const [showButtons, setShowButtons] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const handleSendMessage = async (message) => {
    setShowButtons(false);
    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
  
    const messageWithUserInfo = `${message}\n\nInformación del usuario:\n${JSON.stringify(userInfo)}`;
    console.log("Mensaje con información del usuario:", messageWithUserInfo);
  
    try {
      const response = await axiosInstance.post('/chat', { message: messageWithUserInfo }); 
      const data = response.data;
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

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/getUserInfo'); 
        const data = response.data;
        setUserInfo(data.userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
