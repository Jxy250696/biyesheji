"use client"
import React, { useState } from 'react';
import './index.css';

const topics = [
    {
        id: 1,
        title: 'JavaScript 础',
        description: '包含 JavaScript 的基础知识...'
    },
    {
        id: 2,
        title: 'CSS 式',
        description: '包含 CSS 相关的样式问题'
    },
    {
        id: 3,
        title: 'HTML 础',
        description: 'HTML 标记语言的基本知识'
    },
    {
        id: 4,
        title: '前端框架',
        description: 'React, Vue, Angular 框架相关'
    },
    {
        id: 5,
        title: '算法与数据结构',
        description: '数据结构和算法题目'
    },
    {
        id: 6,
        title: '数据库原理',
        description: 'SQL 语句和数据库设计'
    },
    {
        id: 7,
        title: '操作系统',
        description: '操作系统的概念'
    },
    {
        id: 8,
        title: '网络协议',
        description: 'HTTP, TCP/IP 网络协议题目'
    },
    {
        id: 9,
        title: '设计模式',
        description: '常见设计模式及其应用'
    },
    {
        id: 10,
        title: '编程语言概述',
        description: '多种编程语言的基础知识'
    },
    {
        id: 11,
        title: '版本控制',
        description: 'Git 和 SVN 的使用'
    },
    {
        id: 12,
        title: '安全与加密',
        description: '网络安全和加密技术'
    },
    {
        id: 13,
        title: '云计算',
        description: '云服务和架构'
    },
    {
        id: 14,
        title: '微服务架构',
        description: '微服务的设计与实现'
    },
    {
        id: 15,
        title: '容器技术',
        description: 'Docker 和 Kubernetes 关'
    },
    {
        id: 16,
        title: 'DevOps 实践',
        description: '持续集成与持续交付'
    },
    {
        id: 17,
        title: '数据分析',
        description: '数据分析和可视化'
    },
    {
        id: 18,
        title: '人工智能',
        description: '机器学习与深度学习基础'
    },
    {
        id: 19,
        title: '区块链技术',
        description: '区块链的基本原理和应用'
    },
    {
        id: 20,
        title: '项目管理',
        description: '软件开发项目的管理和执行'
    }
];

export default function Home() {
    const [selectedTopic, setSelectedTopic] = useState(null);

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="home-page">
            <h1>请选择您想要面试的内容</h1>
            <div className="topics-grid">
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
                        onClick={() => handleTopicSelect(topic)}
                    >
                        {/* 图片路径可能需要根据实际情况调整 */}
                        <img src={`/images/${topic.title}.png`} alt={topic.title} />
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                    </div>
                ))}
            </div>
            {selectedTopic && (
                <button
                    className="start-interview-button"
                    onClick={() => window.location.href = `/aimianshi/mianshi/${encodeURIComponent(selectedTopic.title)}`}
                >
                    开始面试
                </button>
            )}
        </div>
    );
}