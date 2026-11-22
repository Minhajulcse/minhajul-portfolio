import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icons";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  error?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Who is Minhajul Islam?",
  "What technologies does he work with?",
  "What are his programming skills?",
  "Tell me about his projects.",
  "What are his competitive programming achievements?",
  "How can I contact him?",
];

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Simple markdown formatter for AI assistant responses
function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="chat-markdown">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.slice(2);
          return (
            <div key={idx} className="chat-bullet">
              <span className="bullet-dot">•</span>
              <span>{formatInlineMarkdown(bulletText)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="chat-numbered">
              <span className="num-prefix">{numMatch[1]}.</span>
              <span>{formatInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="chat-spacer" />;
        }

        // Normal paragraph
        return (
          <p key={idx} className="chat-p">
            {formatInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineMarkdown(text: string): React.ReactNode {
  // Regex to split by bold (**text**), inline code (`code`), or links [text](url)
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--text)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="chat-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function Chatbot(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am **Minhajul Islam's AI Assistant**.\n\nAsk me anything about Minhajul's competitive programming journey, academic projects, technical toolkit, experience, or contact information. You can ask in either **English** or **Bangla**!",
      timestamp: formatTime(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (questionToSend?: string) => {
    const textToSend = (questionToSend || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: formatTime(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = newMessages
        .filter((m) => !m.error)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            error: true,
            content:
              data.error ||
              "Sorry, I encountered an issue processing your question. Please try again.",
            timestamp: formatTime(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: formatTime(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          error: true,
          content:
            "Network error: Unable to reach the assistant server. Please check your connection and try again.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset. How can I help you today regarding Minhajul's portfolio, skills, projects, or achievements?",
        timestamp: formatTime(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="chatbot-launcher-wrap">
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          className={`chatbot-launcher ${isOpen ? "active" : ""}`}
          aria-label={isOpen ? "Close AI chat assistant" : "Open AI chat assistant"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <div className="launcher-icon-inner">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close-icon"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon name="close" size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="ai-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon name="sparkles" size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="online-indicator" aria-hidden="true" />
        </motion.button>

        {/* Floating tooltip badge when closed */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="chatbot-tooltip"
            onClick={() => setIsOpen(true)}
          >
            <span className="tooltip-sparkle">✨</span>
            <span>Ask Minhajul&apos;s AI</span>
          </motion.div>
        )}
      </div>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className={`chatbot-window ${isMinimized ? "minimized" : ""}`}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "58px" : "min(620px, calc(100vh - 110px))",
            }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            role="dialog"
            aria-label="Minhajul Islam AI Assistant"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div
                className="chatbot-header-info"
                onClick={() => setIsMinimized((prev) => !prev)}
                role="button"
                tabIndex={0}
              >
                <div className="chatbot-avatar">
                  <Icon name="sparkles" size={16} />
                  <span className="avatar-status" />
                </div>
                <div>
                  <h3 className="chatbot-title">Minhajul&apos;s AI Assistant</h3>
                  <p className="chatbot-subtitle">Ask anything · English or Bangla</p>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button
                  type="button"
                  onClick={resetChat}
                  className="chat-action-btn"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Icon name="refresh" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className="chat-action-btn"
                  title={isMinimized ? "Expand chat" : "Minimize chat"}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <span className="minimize-dash">{isMinimized ? "▢" : "—"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="chat-action-btn close-btn"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body & Messages */}
            {!isMinimized && (
              <>
                <div className="chatbot-body">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`chat-bubble-wrap ${
                        msg.role === "user" ? "user-wrap" : "assistant-wrap"
                      } ${msg.error ? "error-wrap" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="bubble-avatar" aria-hidden="true">
                          <Icon name="sparkles" size={12} />
                        </div>
                      )}
                      <div className="bubble-content-col">
                        <div className="chat-bubble">
                          <MarkdownMessage content={msg.content} />
                        </div>
                        <span className="chat-timestamp">{msg.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="chat-bubble-wrap assistant-wrap"
                    >
                      <div className="bubble-avatar">
                        <Icon name="sparkles" size={12} />
                      </div>
                      <div className="chat-bubble loading-bubble">
                        <div className="typing-dots">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions Drawer */}
                {messages.length <= 2 && !loading && (
                  <div className="chat-suggestions">
                    <span className="suggestions-label">Suggested questions:</span>
                    <div className="suggestions-grid">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          className="suggestion-chip"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input Form */}
                <form
                  className="chatbot-footer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <div className="input-row">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about Minhajul..."
                      rows={1}
                      disabled={loading}
                      aria-label="Type your question"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="send-button"
                      aria-label="Send message"
                    >
                      <Icon name="send" size={16} />
                    </button>
                  </div>
                  <div className="input-hint">
                    <span>Enter ↵ to send · Shift + Enter for new line</span>
                  </div>
                </form>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Chatbot Launcher Button */
        .chatbot-launcher-wrap {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 75;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-launcher {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 1px solid var(--line-strong);
          background: var(--text);
          color: var(--bg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }

        .chatbot-launcher:hover {
          box-shadow: 0 14px 38px color-mix(in srgb, var(--accent) 30%, transparent);
          border-color: var(--accent);
        }

        .chatbot-launcher.active {
          background: var(--surface);
          color: var(--text);
          border-color: var(--accent);
        }

        .launcher-icon-inner {
          display: grid;
          place-items: center;
        }

        .online-indicator {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid var(--bg);
        }

        .chatbot-tooltip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--line-strong);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: var(--shadow);
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .chatbot-tooltip:hover {
          transform: translateX(-3px);
          border-color: var(--accent);
        }

        .tooltip-sparkle {
          font-size: 13px;
        }

        /* Chatbot Window Container */
        .chatbot-window {
          position: fixed;
          bottom: 92px;
          right: 24px;
          width: min(420px, calc(100vw - 36px));
          z-index: 75;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: 18px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          backdrop-filter: blur(24px);
        }

        .chatbot-window.minimized {
          height: 58px !important;
        }

        /* Header */
        .chatbot-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          background: color-mix(in srgb, var(--surface-soft) 85%, transparent);
          user-select: none;
        }

        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
        }

        .chatbot-avatar {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: var(--accent);
          color: #fff;
          display: grid;
          place-items: center;
        }

        .avatar-status {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          border: 1.5px solid var(--surface);
        }

        .chatbot-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text);
        }

        .chatbot-subtitle {
          margin: 1px 0 0;
          font-size: 10px;
          color: var(--muted);
        }

        .chatbot-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .chat-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--muted);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
        }

        .chat-action-btn:hover {
          background: var(--surface-soft);
          color: var(--text);
          border-color: var(--line);
        }

        .minimize-dash {
          font-size: 11px;
          line-height: 1;
        }

        /* Body & Messages */
        .chatbot-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }

        .chat-bubble-wrap {
          display: flex;
          gap: 9px;
          max-width: 88%;
        }

        .user-wrap {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .assistant-wrap {
          align-self: flex-start;
        }

        .bubble-avatar {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          background: var(--accent-soft);
          color: var(--accent);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bubble-content-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-wrap .bubble-content-col {
          align-items: flex-end;
        }

        .chat-bubble {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.55;
          word-break: break-word;
        }

        .user-wrap .chat-bubble {
          background: var(--text);
          color: var(--bg);
          border-bottom-right-radius: 3px;
        }

        .assistant-wrap .chat-bubble {
          background: var(--surface-soft);
          color: var(--text);
          border: 1px solid var(--line);
          border-bottom-left-radius: 3px;
        }

        .error-wrap .chat-bubble {
          background: color-mix(in srgb, #ef4444 12%, var(--surface));
          border-color: color-mix(in srgb, #ef4444 35%, var(--line));
        }

        .chat-timestamp {
          font-size: 9px;
          color: var(--faint);
          padding: 0 4px;
        }

        /* Markdown Styles in Chat */
        .chat-markdown {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .chat-p {
          margin: 0;
        }

        .chat-bullet, .chat-numbered {
          display: flex;
          gap: 6px;
          align-items: flex-start;
          margin-left: 2px;
        }

        .bullet-dot {
          color: var(--accent);
          font-weight: 700;
        }

        .num-prefix {
          color: var(--accent);
          font-weight: 700;
          font-size: 11px;
          min-width: 14px;
        }

        .chat-spacer {
          height: 4px;
        }

        .chat-inline-code {
          padding: 1px 5px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 11px;
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          color: var(--accent);
        }

        .chat-link {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Loading Dots */
        .loading-bubble {
          padding: 12px 18px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Suggestions */
        .chat-suggestions {
          padding: 10px 16px;
          border-top: 1px solid var(--line);
          background: color-mix(in srgb, var(--surface) 95%, transparent);
        }

        .suggestions-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--faint);
          margin-bottom: 8px;
        }

        .suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-height: 120px;
          overflow-y: auto;
        }

        .suggestion-chip {
          padding: 6px 10px;
          font-size: 11px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--surface-soft);
          color: var(--text);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
        }

        .suggestion-chip:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-soft);
          transform: translateY(-1px);
        }

        /* Missing API Key Banner */
        .api-key-banner {
          padding: 12px;
          border-radius: 10px;
          background: color-mix(in srgb, #f59e0b 12%, var(--surface));
          border: 1px solid color-mix(in srgb, #f59e0b 35%, var(--line));
          font-size: 11px;
          color: var(--text);
        }

        .api-key-banner pre {
          margin: 6px 0;
          padding: 6px 8px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 6px;
          font-size: 10px;
          overflow-x: auto;
        }

        .banner-subtext {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 10px;
        }

        /* Footer Input Form */
        .chatbot-footer {
          padding: 12px 14px 10px;
          border-top: 1px solid var(--line);
          background: var(--surface);
        }

        .input-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: var(--surface-soft);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 6px 8px 6px 12px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-row:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
        }

        .input-row textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-size: 13px;
          font-family: inherit;
          resize: none;
          max-height: 90px;
          padding: 4px 0;
          line-height: 1.4;
        }

        .input-row textarea::placeholder {
          color: var(--faint);
        }

        .send-button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: var(--accent);
          color: #fff;
          display: grid;
          place-items: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.16s ease, opacity 0.16s ease, background 0.16s ease;
        }

        .send-button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          background: var(--faint);
        }

        .send-button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .input-hint {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          padding: 0 2px;
          font-size: 9px;
          color: var(--faint);
        }

        /* Mobile Layout */
        @media (max-width: 640px) {
          .chatbot-launcher-wrap {
            bottom: 18px;
            right: 18px;
          }

          .chatbot-tooltip {
            display: none;
          }

          .chatbot-window {
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: min(85vh, 600px) !important;
            border-radius: 20px 20px 0 0;
            border-bottom: none;
          }

          .chatbot-window.minimized {
            height: 58px !important;
          }
        }
      `}</style>
    </>
  );
}
