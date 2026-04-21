import React, { useState, useCallback } from 'react';
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

// Safely parse message text and convert URLs into clickable anchor elements
// Handles both markdown links [text](url) and standalone URLs
function renderMessageWithLinks(text) {
  // Return plain text if not a valid string
  if (typeof text !== 'string' || text.length === 0) {
    return text;
  }

  try {
    // Combined regex: markdown links AND standalone URLs
    const urlRegex = /(?:\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s]+))/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let hasMatches = false;

    // First pass: collect all matches and split text
    const segments = [];
    while ((match = urlRegex.exec(text)) !== null) {
      hasMatches = true;
      // Add text before match
      if (match.index > lastIndex) {
        segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }

      if (match[1] && match[2]) {
        // Markdown link: [text](url)
        segments.push({ type: 'markdown', label: match[1], url: match[2] });
      } else if (match[3]) {
        // Standalone URL
        segments.push({ type: 'url', url: match[3] });
      }

      lastIndex = urlRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({ type: 'text', content: text.slice(lastIndex) });
    }

    // If no URLs found, return plain text
    if (!hasMatches) {
      return text;
    }

    // Render segments
    return segments.map((seg, i) => {
      if (seg.type === 'markdown') {
        return (
          <a
            key={i}
            href={seg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {seg.label}
          </a>
        );
      }
      if (seg.type === 'url') {
        const isProductLink = typeof seg.url === 'string' && seg.url.startsWith(PRODUCT_BASE_URL);
        return (
          <a
            key={i}
            href={seg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {isProductLink ? 'View Product' : seg.url}
          </a>
        );
      }
      // Plain text segment
      return <span key={i}>{seg.content}</span>;
    });
  } catch (err) {
    // If anything goes wrong, return the plain text safely
    console.error('ChatWidget render error:', err);
    return text;
  }
}

export const ChatWidget = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: CHAT_TRANSLATIONS.en.initialGreeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatT = CHAT_TRANSLATIONS[language] || CHAT_TRANSLATIONS.en;

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage = {
      id: messages.length + 1,
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          lang: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const botMessage = {
        id: messages.length + 2,
        text: typeof data.reply === 'string' ? data.reply : String(data.reply || ''),
        sender: 'bot',
        timestamp: new Date(),
        escalate: data.escalate === true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: messages.length + 2,
        text: chatT.errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, language, messages.length, chatT.errorMessage]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isTyping) {
        handleSendMessage();
      }
    },
    [isTyping, handleSendMessage]
  );

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
              {messages.map((message) => (
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
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="message message-bot">
                  <p className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </p>
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder={chatT.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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