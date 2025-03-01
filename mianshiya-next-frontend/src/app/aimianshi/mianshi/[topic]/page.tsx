"use client";
import "./index.css";
import React, { useEffect, useState ,useRef} from "react";
import axios from "axios";
import {addInterviewRecordUsingPost} from "@/api/interviewRecordController";
import {message} from "antd";
import {addInterviewUsingPost, listMyInterviewVoByPageUsingPost} from "@/api/interviewController";

// 假设你已经安装了axios用于网络请求
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export default function InterviewPage({ params }) {
  //topic是utf-8编码，还要解码一下
  const topic = decodeURIComponent(params.topic);
  const [records, setRecords] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<
    { type: "user" | "ai"; content: string }[]
  >([]);
  // 用一个全局变量记录当前的面试题目等级，初始为0
    const [level, setLevel] = useState(0);
  //   定义五个称号，水平从低到高

    const [levels, setLevels] = useState([
        "菜鸟",
        "初级",
        "中级",
        "高级",
        "专家"
    ]);

    const didfetch = useRef(false);
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the list
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: userInput },
    ]);
    setUserInput("");

    // // Simulate sending message to backend and getting response (replace with actual API call)
    // setTimeout(() => {
    //   const aiResponse = topic; // Replace with actual response from your backend
    //
    //   // Add AI response to the list
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { type: "ai", content: aiResponse },
    //   ]);
    // }, 1000); // Simulate network delay
    //给127.0.0.1:5000  发送get请求
    try {
        // 给127.0.0.1:5000/api/v1/mianshi 发送post请求，封装axios请求，要传入当前面试的类型，以及上一个问题和用户的回答
        const response = await axios.post(`http://127.0.0.1:5001/api/v1/mianshi`, {
            "topic": topic,
            // ai的最后一条content就是历史问题
            "question": messages[messages.length - 1]?.content,
            "answer": userInput,
            "level": level
        });
        const aiResponse = response.data;
        const ispass = response.data['ispass'];
        const new_question = aiResponse['question'];
        if (ispass){

            // 如果level大于等于4，则结束面试
            if (level >= 4){
                setLevel(4);
                handleEndInterview();
                return;
            }
            // 如果通过，则增加level
            setLevel(level + 1);
        }
        // Add AI response to the list
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: "ai", content: new_question },
        ]);
    } catch (error) {
        console.error("Error fetching interview:", error);
    }
  };

    const handleEndInterview = async () => {
        // 给addInterviewRecordUsingPost发请求，存储记录
        try{
            const res = await addInterviewUsingPost({
                "topic": topic,
                "rating": levels[level]
            });
        }catch (e) {
            console.log("添加面试记录失败，" + e.message);
        }

        // alert输出面试等级
        alert(`面试结束。你的最终评级为：${levels[level]}`);

        // alert框消失之后自动跳转到首页
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    };
  // 获取历史面试记录
  useEffect(() => {

    async function fetchRecords() {
      try {
        const response = await listMyInterviewVoByPageUsingPost({
            current: 1,
            pageSize: 10
        }); // 确保后端有对应的API路由
          console.log(response.data.records);
        setRecords(response.data.records);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }



    async function question_init(){
        // 给127.0.0.1:5000/api/v1/mianshi 发送post请求，封装axios请求，要传入当前面试的类型
        try {
            const response = await axios.post(`http://127.0.0.1:5001/api/v1/mianshi`, {
                "topic": topic,
                "level": 0
            });

            const aiResponse = response.data['question'];

            // Add AI response to the list
            // Add AI response to the list
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: "ai", content: aiResponse },
            ]);

        }
        catch (error) {
            console.error("Error:", error);
        }
    }
    if (!didfetch.current){
        fetchRecords();
        question_init();
        didfetch.current = true;
    }


  }, []);

  return (
    <div className="interview-page">
      {/* 左侧历史面试记录 */}
      <aside className="history-records">
        <h2>历史面试记录</h2>
        <ul>
            {records.map((record) => (
                <li key={record.id}>
                    主题：{record.topic} - 评级：{record.rating} <br></br> 面试时间：{formatDate(record.createTime)}
                </li>
            ))}
        </ul>
      </aside>

      {/* 右侧聊天窗口 */}
      <div className={`chatContainer`}>
        <div
          style={{ display: "flex", justifyContent: "center", height: "100vh" }}
        >
          <div style={{ fontWeight: "bold", fontSize: "25px" }}>
            你好，我是本场的面试官，请回答下面的问题。
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
          <div className="endInterviewButton">
            <button
                onClick={handleEndInterview}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  cursor: "pointer",
                }}
            >
              提前结束面试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
