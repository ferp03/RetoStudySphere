import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-input">
      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Mande mensaje..."
      ></textarea>
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};

export default ChatInput;
