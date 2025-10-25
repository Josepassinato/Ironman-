
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const ConversationalUI: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);
        
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        await streamChatResponse(input, (chunk) => {
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    const updatedMessages = [...prev];
                    updatedMessages[prev.length - 1] = { ...lastMessage, text: lastMessage.text + chunk };
                    return updatedMessages;
                }
                return prev;
            });
        });

        setIsLoading(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-800/50 rounded-lg border border-slate-700/50 shadow-2xl shadow-cyan-500/5 animate-fadeIn">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold font-orbitron text-slate-100">J.A.R.V.I.S. Interface</h2>
                <p className="text-sm text-slate-400">How may I assist you, sir?</p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex-shrink-0 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse"></div>
                            </div>
                        )}
                        <div className={`max-w-xl p-4 rounded-lg shadow-lg ${msg.role === 'user' ? 'bg-slate-700 text-slate-200' : 'bg-slate-900 text-slate-300'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}{isLoading && msg.role==='model' && index === messages.length - 1 ? '...' : ''}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-700">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Delegate a task or ask a question..."
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-4 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || !input.trim()}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversationalUI;
