// ============================================================
// AutoRoute AI — AI Chat Widget
// ============================================================
// Floating chat bubble (bottom-right) that opens a chat panel.
// Sends conversation history to /api/chat and displays the
// AI response. Handles normal Q&A, status checks, cancellations,
// and escalations — all transparently to the user.
// ============================================================

import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm the AutoRoute AI assistant. I can help with questions about shipping your vehicle, carrier details, transit times, and more. What can I help you with?",
};

function ChatWidget() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([GREETING]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus the input when the widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    // Add user message to the conversation
    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send full conversation history (minus the greeting — it's a UI-only message)
      const historyToSend = updatedMessages.filter((_, i) => i > 0); // skip greeting

      const response = await fetch(`${API_URL}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: historyToSend }),
      });

      const data = await response.json();
      const aiMessage = {
        role:    'assistant',
        content: data.message || "I'm sorry, something went wrong. Please try again.",
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* ── Chat panel ──────────────────────────────────────── */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">AI</div>
              <div>
                <p className="chat-header-name">AutoRoute Assistant</p>
                <p className="chat-header-status">Always online</p>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble-row ${msg.role === 'user' ? 'chat-bubble-row--user' : 'chat-bubble-row--ai'}`}
              >
                <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="chat-bubble-row chat-bubble-row--ai">
                <div className="chat-bubble chat-bubble--ai chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ───────────────────────────── */}
      <button
        className="chat-fab"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '✕' : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>
    </>
  );
}

export default ChatWidget;
