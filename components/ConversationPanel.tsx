import React, { useRef, useEffect } from 'react';
import { Message } from '../types';

interface ConversationPanelProps {
    messages: Message[];
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({ messages }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900 text-white text-sm">
            {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-lg shadow ${
                        msg.sender === 'user' ? 'bg-blue-600' 
                        : msg.sender === 'bot' ? 'bg-slate-700'
                        : 'bg-red-900/50 text-red-300'
                    }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
