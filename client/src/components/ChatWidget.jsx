import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS, SUPPORT_URLS } from '../config/api';
import '../styles/ChatWidget.css';

const API_URL = API_ENDPOINTS.AI_CHAT.replace('/chat', '');
const TELEGRAM_URL = SUPPORT_URLS.TELEGRAM;
const EMAIL_URL = SUPPORT_URLS.EMAIL;

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

// Parse message into structured segments: text, images, links
function parseMessage(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { textContent: text, images: [], links: [] };
  }

  try {
    const images = [];
    const links = [];

    // Extract markdown images: ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = imageRegex.exec(text)) !== null) {
      images.push({
        alt: match[1] || 'Product image',
        url: match[2],
      });
    }

    // Extract markdown links: [text](url) — not images
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    while ((match = linkRegex.exec(text)) !== null) {
      // Skip if this overlaps with an image (image syntax includes link-like parts)
      const isImage = images.some(
        (img) => match.index >= img.index && match.index < img.index + img.length
      );
      if (!isImage) {
        links.push({
          label: match[1],
          url: match[2],
        });
      }
    }

    // Remove image and link syntax from text, replace with placeholder or just remove
    let textContent = text
      .replace(/!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g, '')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1');

    return { textContent, images, links };
  } catch (err) {
    return { textContent: text, images: [], links: [] };
  }
}

// Render message with text, non-clickable images after, and clickable links
function renderMessageWithLinks(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return text;
  }

  try {
    const { textContent, images, links } = parseMessage(text);

    const parts = [];

    // Render text with bold **text** converted to <strong>
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const textParts = [];
    let lastIndex = 0;
    let boldMatch;

    while ((boldMatch = boldRegex.exec(textContent)) !== null) {
      if (boldMatch.index > lastIndex) {
        textParts.push(textContent.slice(lastIndex, boldMatch.index));
      }
      textParts.push(<strong key={`b-${boldMatch.index}`}>{boldMatch[1]}</strong>);
      lastIndex = boldMatch.index + boldMatch[0].length;
    }
    if (lastIndex < textContent.length) {
      textParts.push(textContent.slice(lastIndex));
    }

    parts.push(<span key="text">{textParts.length > 0 ? textParts : textContent}</span>);

    // Render images AFTER the text, non-clickable
    images.forEach((img, i) => {
      if (img.url && typeof img.url === 'string') {
        parts.push(
          <img
            key={`img-${i}`}
            src={img.url}
            alt={img.alt || 'Product image'}
            className="chat-product-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        );
      }
    });

    // Render links AFTER images, clickable
    links.forEach((link, i) => {
      if (link.url && typeof link.url === 'string') {
        parts.push(
          <a
            key={`link-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {link.label || 'View Product'}
          </a>
        );
      }
    });

    return parts;
  } catch (err) {
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
                    <div className="escalate-buttons">
                      <a
                        href={TELEGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="escalate-btn"
                      >
                        📱 Telegram
                      </a>
                      <a
                        href={EMAIL_URL}
                        className="escalate-btn"
                      >
                        📧 Email
                      </a>
                    </div>
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