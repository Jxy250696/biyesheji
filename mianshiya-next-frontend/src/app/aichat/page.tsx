// ./app/aichat/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import "./index.css";

export default function AIChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { type: "user" | "ai"; content: string }[]
  >([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the list
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: userInput },
    ]);
    setUserInput("");

    // Simulate sending message to backend and getting response (replace with actual API call)
    //用axios发送请求，将userInput发送给127.0.0.1:5000//api/v1/chat
      try {
          const response = await axios.post(`http://127.0.0.1:5001/api/v1/chat`, {
              "question": userInput,
          });

          const aiResponse = response.data['answer'];

          // Add AI response to the list

          setMessages((prevMessages) => [
              ...prevMessages,
              { type: "ai", content: aiResponse },
          ]);
      }
      catch (error) {
          console.error("Error:", error);
      }
      // setTimeout(() => {
    //   const aiResponse = "这是模拟的AI回复"; // Replace with actual response from your backend
    //
    //   // Add AI response to the list
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { type: "ai", content: aiResponse },
    //   ]);
    // }, 1000); // Simulate network delay
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100vh" }}
      >
        <div style={{ fontWeight: "bold", fontSize: "25px" }}>
          你好，我是一个AI助手。帮你解决一切计算机领域 相关的问题。
        </div>
      </div>
      <div className="chatWindow">
        <div className={`message box`}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="inputArea">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="请输入您的问题..."
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#1890ff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
