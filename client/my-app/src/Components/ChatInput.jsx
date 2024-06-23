import React, { useState } from 'react';
import './ChatInput.css'; 

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    }
  };

  return (
    <div className="chat-input">
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress} 
        placeholder="Message..."
      ></textarea>
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
