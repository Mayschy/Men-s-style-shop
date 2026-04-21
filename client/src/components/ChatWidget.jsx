import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/ChatWidget.css';

const API_URL = 'https://men-style-shop.onrender.com/api';
const PRODUCT_BASE_URL = 'https://mens-style-shop.vercel.app/product/';

const CHAT_TRANSLATIONS = {
  en: {
    placeholder: 'Ask about style, products, or sizing...',
    contactSupport: '📱 Contact Support',
    initialGreeting: 'Hi! 👋 Welcome to our store. How can I help you today?',
    errorMessage: 'Sorry, something went wrong. Please try again later.',
  },
  uk: {
    placeholder: 'Запитайте про стиль, товари чи розміри...',
    contactSupport: '📱 Зв\'язатися з підтримкою',
    initialGreeting: 'Привіт! 👋 Ласкаво просимо до нашого магазину. Чим я можу вам допомогти сьогодні?',
    errorMessage: 'Вибачте, щось пішло не так. Будь ласка, спробуйте пізніше.',
  },
};

// Parse message text and convert URLs into clickable anchor elements
function renderMessageWithLinks(text) {
  const parts = text.split(/(\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s]+))/g);

  return parts.map((part, i) => {
    const markdownMatch = part.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
    if (markdownMatch) {
      return (
        <a
          key={i}
          href={markdownMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {markdownMatch[1]}
        </a>
      );
    }

    const urlMatch = part.match(/^(https?:\/\/[^\s]+)$/);
    if (urlMatch) {
      const url = urlMatch[1];
      const isProductLink = url.startsWith(PRODUCT_BASE_URL);
      const label = isProductLink ? 'View Product' : url;

      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

export const ChatWidget = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: CHAT_TRANSLATIONS[language]?.initialGreeting || CHAT_TRANSLATIONS.en.initialGreeting,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatT = CHAT_TRANSLATIONS[language] || CHAT_TRANSLATIONS.en;

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

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
        body: JSON.stringify({
          message: trimmedInput,
          lang: language
        })
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
        text: chatT.errorMessage,
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
                  <p>{renderMessageWithLinks(message.text)}</p>
                  {message.escalate && (
                    <a
                      href="https://t.me/mensstyleshop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="escalate-btn"
                    >
                      {chatT.contactSupport}
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
                placeholder={chatT.placeholder}
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