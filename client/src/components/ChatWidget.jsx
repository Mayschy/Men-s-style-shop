import React, { useState } from 'react';
import '../styles/ChatWidget.css';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Привет! 👋 Чем я могу тебе помочь?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Спасибо за твой вопрос! Я усовершенствуюсь и скоро смогу давать более полезные ответы. 🤖',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
        {isOpen && (
          <div className="chat-content">
            <div className="chat-header">
              <h3>Ассистент 🤖</h3>
              <button
                className="chat-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="chat-messages">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message message-${message.sender}`}
                >
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Напиши сообщение..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                className="chat-send-btn"
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                ⟶
              </button>
            </div>
          </div>
        )}

        <button
          className="chat-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle chat"
          title="Открыть чат"
        >
          💬
        </button>
      </div>
    </>
  );
};
