import React, { useState, useCallback, useRef, useEffect } from 'react';
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

// Safely render message text with clickable links, images, and markdown
// Handles: ![alt](url) images, [text](url) links, and bare URLs
function renderMessageWithLinks(text) {
  // Return plain text if not a valid string
  if (typeof text !== 'string' || text.length === 0) {
    return text;
  }

  try {
    // Regex patterns:
    // 1. Markdown image: ![alt](url)
    // 2. Markdown link: [text](url)
    // 3. Bare URL: https://...
    const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = [];
    let lastIndex = 0;
    let hasMatches = false;

    // Track matches from all patterns
    const matches = [];

    let match;

    // Find all markdown images
    while ((match = imageRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        type: 'image',
        alt: match[1] || 'Product image',
        url: match[2],
      });
    }

    // Reset and find markdown links (that aren't images)
    linkRegex.lastIndex = 0;
    while ((match = linkRegex.exec(text)) !== null) {
      // Skip if this is actually part of an image tag (overlapping)
      const isOverlapping = matches.some(
        (m) => match.index >= m.index && match.index < m.index + m.length
      );
      if (!isOverlapping) {
        matches.push({
          index: match.index,
          length: match[0].length,
          type: 'link',
          label: match[1],
          url: match[2],
        });
      }
    }

    // Find bare URLs (that aren't already captured)
    while ((match = urlRegex.exec(text)) !== null) {
      const isOverlapping = matches.some(
        (m) => match.index >= m.index && match.index < m.index + m.length
      );
      if (!isOverlapping) {
        matches.push({
          index: match.index,
          length: match[0].length,
          type: 'url',
          url: match[1],
        });
      }
    }

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);

    // If no matches, return plain text
    if (matches.length === 0) {
      return text;
    }

    // Build rendered parts
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const before = text.slice(lastIndex, m.index);

      // Add text before match
      if (before.length > 0) {
        parts.push(<span key={`text-${i}`}>{before}</span>);
      }

      if (m.type === 'image') {
        // Render image with link wrapper
        const isProductUrl = typeof m.url === 'string' && m.url.length > 0;
        parts.push(
          <span key={`img-${i}`} className="chat-image-wrapper">
            {isProductUrl ? (
              <a
                href={m.url.startsWith('http') ? m.url : `${PRODUCT_BASE_URL}${m.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-link"
              >
                <img
                  src={m.url}
                  alt={m.alt || 'Product image'}
                  className="chat-product-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </a>
            ) : null}
          </span>
        );
      } else if (m.type === 'link') {
        parts.push(
          <a
            key={`link-${i}`}
            href={typeof m.url === 'string' ? m.url : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {m.label || m.url}
          </a>
        );
      } else if (m.type === 'url') {
        const isProductLink =
          typeof m.url === 'string' && m.url.startsWith(PRODUCT_BASE_URL);
        parts.push(
          <a
            key={`url-${i}`}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {isProductLink ? 'View Product' : m.url}
          </a>
        );
      }

      lastIndex = m.index + m.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return parts;
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

  const messagesEndRef = useRef(null);
  const chatT = CHAT_TRANSLATIONS[language] || CHAT_TRANSLATIONS.en;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
              <div ref={messagesEndRef} />
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