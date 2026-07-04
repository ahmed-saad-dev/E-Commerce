import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "أهلاً بك في EGZone! 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://egzone.runasp.net/api/Chatbot/ask",
        { message: text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || "عذراً، لم أفهم سؤالك.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "حدث خطأ، يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #198754, #20c997)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(25,135,84,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 28,
            zIndex: 9998,
            width: 350,
            height: 520,
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #198754, #20c997)",
              padding: "16px 20px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            🤖 EGZone Assistant
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 15,
              background: "#f8f9fa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background:
                      msg.from === "user"
                        ? "linear-gradient(135deg,#198754,#20c997)"
                        : "#fff",
                    color: msg.from === "user" ? "#fff" : "#000",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {loading && <p>Typing...</p>}

            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 12,
              borderTop: "1px solid #eee",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب رسالتك..."
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                width: 45,
                border: "none",
                borderRadius: 10,
                background: "#198754",
                color: "#fff",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}