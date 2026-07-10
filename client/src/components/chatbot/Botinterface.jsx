import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CHATBOT_API_END_POINT } from "../../utilis/constant";

const QUICK_REPLIES = [
  "Show me jobs",
  "What is this website?",
  "How do I apply?",
];

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h3a4 4 0 014 4v.5a1.5 1.5 0 010 3V16a4 4 0 01-4 4H8a4 4 0 01-4-4v-1.5a1.5 1.5 0 010-3V11a4 4 0 014-4h3V5.73A2 2 0 0111 4a2 2 0 011-2zM8 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-6 5a1 1 0 000 2h4a1 1 0 100-2h-4z" />
      </svg>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Botinterface({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there 👋 I can help you find jobs, check on applications, or answer questions about this site. What can I do for you?", time: new Date() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text, time: new Date() }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${CHATBOT_API_END_POINT}/getchatbot`, {
        sessionId,
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.message, time: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong on my end. Please try again.", time: new Date() },
      ]);
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleClose = async () => {
    try {
      await axios.post(`${CHATBOT_API_END_POINT}/getchatbot`, {
        sessionId,
        action: "close",
      });
    } catch (err) {
      console.error(err);
    }
    onClose();
  };

  const showQuickReplies = messages.length === 1;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-[slideUp_0.25s_ease-out]">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-in { animation: fadeIn 0.2s ease-out; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
      `}</style>

      <div className="w-[22rem] h-[34rem] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3.5 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <BotAvatar />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-sm font-semibold leading-tight">Career Assistant</h1>
            <p className="text-slate-300 text-xs">Online now</p>
          </div>
          <button
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition flex-shrink-0"
            onClick={handleClose}
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 px-3.5 py-4 space-y-3.5 overflow-y-auto chat-scroll bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`msg-in flex items-end gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "bot" && <BotAvatar />}
              <div className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} max-w-[78%]`}>
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-orange-600 text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-slate-700 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{formatTime(m.time)}</span>
              </div>
            </div>
          ))}

          {isTyping && <div className="msg-in"><TypingIndicator /></div>}

          {showQuickReplies && !isTyping && (
            <div className="flex flex-wrap gap-2 pt-1 pl-10">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center">
          <input
            ref={inputRef}
            className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition disabled:bg-slate-50"
            placeholder="Type your message..."
            value={input}
            disabled={isTyping}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
          />
          <button
            className="bg-orange-600 hover:bg-orange-700 active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center transition flex-shrink-0"
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M2.94 2.94a1.5 1.5 0 011.66-.32l17 7.5a1.5 1.5 0 010 2.76l-17 7.5a1.5 1.5 0 01-2.09-1.67L3.98 12 1.5 5.29a1.5 1.5 0 011.44-2.35z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Botinterface;