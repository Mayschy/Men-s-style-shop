import React, { useState } from 'react';
import '../styles/ChatWidget.css';

const API_URL = 'https://men-style-shop.onrender.com/api';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! 👋 Welcome to our store. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMessage = {
        id: messages.length + 2,
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
        escalate: data.escalate || false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, something went wrong. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
        {isOpen && (
          <div className="chat-content">
            <div className="chat-header">
              <h3>Style Consultant 🤖</h3>
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
                  {message.escalate && (
                    <a
                      href="https://t.me/mensstyleshop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="escalate-btn"
                    >
                      📱 Contact Support
                    </a>
                  )}
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="message message-bot">
                  <p className="typing-indicator">
                    <span></span><span></span><span></span>
                  </p>
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Ask about style, products, or sizing..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="chat-input"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                className="chat-send-btn"
                disabled={!inputValue.trim() || isTyping}
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
          title="Chat with style consultant"
        >
          💬
        </button>
      </div>
    </>
  );
};