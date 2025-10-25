import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from '/images/logo.png';

const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("Physics");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef();

  const API_BASE_URL = "http://localhost:8000"; // 🔗 change when deploying backend

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        session_id: sessionId,
        message: input,
        subject: subject,
      });

      const data = response.data;
      setSessionId(data.session_id);

      const botMsg = { role: "assistant", text: data.text_response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Unable to reach Atomia API. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const subjects = ["Physics", "Chemistry", "Mathematics", "Biology"];

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.headerIcon}>
                <h1 style={styles.headerTitle}>Atomia Bot</h1>
              </div>
              <div>
                <p style={styles.headerSubtitle}>
                  Your AI Doubt Partner for IISER Aspirants
                </p>
              </div>
            </div>
            {sessionId && (
              <div style={styles.sessionBadge}>
                <div style={styles.sessionLabel}>Session ID</div>
                <div style={styles.sessionId}>{sessionId}</div>
              </div>
            )}
          </div>
        </header>

        {/* Subject Selector */}
        <div style={{ padding: 'var(--space-lg)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center' }}>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                fontSize: '14px',
                borderRadius: '9999px',
                fontWeight: '500',
                transition: 'all var(--transition-speed)',
                border: 'none',
                cursor: 'pointer',
                ...(subject === sub
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-accent)',
                    }
                  : {
                      backgroundColor: 'var(--color-card-bg)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }),
              }}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div style={styles.chatContainer}>
          <div style={messages.length === 0 ? styles.messagesAreaEmpty : styles.messagesArea}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateContent}>
                  <div style={styles.headerIcon}><img src={logo} alt="AnyBot" width={100} height={100} /></div>
                  <h2 style={styles.emptyStateTitle}>Welcome to Atomia Bot</h2>
                  <p style={styles.emptyStateText}>
                    Your AI doubt partner for IISER aspirants. Ask questions about Physics, Chemistry, Mathematics, or Biology and get step-by-step explanations.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={
                    msg.role === "user"
                      ? styles.userMessageWrapper
                      : styles.assistantMessageWrapper
                  }
                >
                  {msg.role === "user" ? (
                    <div style={styles.userBubble}>
                      <div style={styles.userMessageText}>{msg.text}</div>
                    </div>
                  ) : (
                    <div style={styles.assistantMessageContainer}>
                      <div style={styles.assistantBubble}>
                        <div style={styles.messageText}>{msg.text}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div style={styles.inputArea}>
            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder="Ask your IAT doubt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.mainInput}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  ...styles.sendButton,
                  ...(loading && { opacity: 0.7 })
                }}
              >
                {loading ? (
                  <span style={styles.loadingText}>
                    <span style={styles.spinner}>⟳</span> Thinking...
                  </span>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            💡 Step-by-step learning powered by Atomia | Keep learning — every step
            counts!
          </p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--gradient-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xl)',
    fontFamily: 'var(--font-primary)'
  },
  mainCard: {
    width: '100%',
    maxWidth: '1400px',
    backgroundColor: 'var(--color-card-bg)',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-elevated)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 48px)',
    maxHeight: '900px'
  },
  header: {
    background: '#fff',
    color: '#000',
    padding: 'var(--space-xl)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-md)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)'
  },
  headerIcon: {
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-lg)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  headerSubtitle: {
    fontSize: '14px',
    margin: '4px 0 0 0',
    opacity: 0.9,
    fontWeight: '300'
  },
  sessionBadge: {
    textAlign: 'right'
  },
  sessionLabel: {
    fontSize: '12px',
    opacity: 0.8,
    marginBottom: '4px'
  },
  sessionId: {
    fontSize: '13px',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '6px 14px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    display: 'inline-block'
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)'
  },
  messagesAreaEmpty: {
    flex: 1,
    overflow: 'hidden',
    padding: 'var(--space-xl) var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)'
  },
  emptyState: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    marginTop: '-2.5%'
  },
  emptyStateContent: {
    textAlign: 'center',
    maxWidth: '720px'
  },
  emptyStateIcon: {
    fontSize: '72px',
    marginBottom: 'var(--space-xl)',
    color: 'var(--color-primary)'
  },
  emptyStateTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    margin: '0 0 var(--space-sm) 0'
  },
  emptyStateText: {
    fontSize: '16px',
    color: 'var(--color-secondary)',
    marginBottom: 'var(--space-2xl)'
  },
  userMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  assistantMessageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  userBubble: {
    maxWidth: '70%',
    background: '#f8f1de',
    color: '#000',
    borderRadius: '24px',
    borderTopRightRadius: '6px',
    padding: '20px 24px',
    boxShadow: 'var(--shadow-button)',
    fontWeight: 500
  },
  userMessageText: {
    fontSize: '15px',
    lineHeight: '1.6'
  },
  assistantMessageContainer: {
    maxWidth: '85%'
  },
  assistantBubble: {
    backgroundColor: 'var(--color-card-bg)',
    borderRadius: '24px',
    borderTopLeftRadius: '6px',
    padding: '20px 24px',
    marginBottom: '16px',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-card)'
  },
  messageText: {
    fontSize: '15px',
    color: 'var(--color-text)',
    lineHeight: '1.6',
    whiteSpace: 'pre-line'
  },
  inputArea: {
    padding: 'var(--space-lg)',
    backgroundColor: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)'
  },
  inputRow: {
    display: 'flex',
    gap: 'var(--space-sm)'
  },
  mainInput: {
    flex: 1,
    padding: 'var(--space-md) var(--space-lg)',
    fontSize: '15px',
    border: '2px solid var(--color-border)',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all var(--transition-speed)',
    backgroundColor: 'var(--color-card-bg)',
    fontFamily: 'var(--font-primary)',
    color: 'var(--color-text)'
  },
  sendButton: {
    padding: 'var(--space-md) var(--space-2xl)',
    background: 'var(--gradient-primary)',
    color: 'var(--color-accent)',
    border: 'none',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-speed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '140px',
    boxShadow: 'var(--shadow-button)',
    fontFamily: 'var(--font-primary)'
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)'
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite'
  },
  footer: {
    padding: 'var(--space-md) var(--space-3xl)',
    backgroundColor: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border)'
  },
  footerText: {
    fontSize: '12px',
    color: 'var(--color-secondary)',
    textAlign: 'center',
    margin: 0,
    fontWeight: '300'
  }
};

export default Bot;