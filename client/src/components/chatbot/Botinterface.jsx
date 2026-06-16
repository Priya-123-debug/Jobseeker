import React, { useState } from "react";
import axios from "axios";
import { CHATBOT_API_END_POINT } from "../../utilis/constant";

function Botinterface({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "How can I assist you?" }
  ]);

  // 1️⃣ unique session per chat
  const [sessionId] = useState(() => crypto.randomUUID());

  const handlefunc = async () => {
    if (!input.trim()) return;

    // add user message
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    try {
      const response = await axios.post(
        `${CHATBOT_API_END_POINT}/getchatbot`,
        {
          sessionId,
          message: input
        }
      );

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: response.data.message }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." }
      ]);
      console.error(err);
    }

    setInput("");
  };

  // 2️⃣ clear backend memory when closing chat
  const handleClose = async () => {
    try {
      await axios.post(`${CHATBOT_API_END_POINT}/getchatbot`, {
        sessionId,
        action: "close"
      });
    } catch (err) {
      console.error(err);
    }

    onClose();
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="w-80 h-[500px] bg-white shadow-lg rounded-lg flex flex-col">

        {/* Header */}
        <div className="bg-orange-600 flex text-white py-3 text-lg font-bold rounded-t-lg">
          <h1 className="flex-1 text-center">Chatbot</h1>
          <button
            className="mr-3 bg-white text-gray-900 rounded-full w-8 h-8"
            onClick={handleClose}
          >
            ✖
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  m.sender === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 flex gap-2 border-t">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlefunc()}
          />
          <button
            className="bg-orange-600 text-white px-4 rounded hover:bg-orange-800"
            onClick={handlefunc}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Botinterface;
