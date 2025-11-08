import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage, Settings } from '../types';
import { SendIcon, UserIcon, BotIcon } from '../constants';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <BotIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />}
            <div className={`px-4 py-3 rounded-2xl max-w-lg ${isUser ? 'bg-blue-600 rounded-br-lg text-white' : 'bg-gray-700 rounded-bl-lg text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {isUser && <UserIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />}
        </div>
    );
};

interface ChatBotProps {
    settings: Settings;
    resetKey: number;
}

const ChatBot: React.FC<ChatBotProps> = ({ settings, resetKey }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
            model: settings.chatModel,
            config: {
                systemInstruction: settings.chatBotPersona,
            },
        });
        setChatHistory([]);
    }, [settings.chatBotPersona, settings.chatModel, resetKey]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = useCallback(async () => {
        if (!currentMessage.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', content: currentMessage };
        setChatHistory(prev => [...prev, userMessage]);
        const messageToSend = currentMessage;
        setCurrentMessage('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: messageToSend });

            let modelResponse = '';
            setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].content = modelResponse;
                    return newHistory;
                });
            }
        } catch (err) {
            console.error('Chat failed:', err);
            setChatHistory(prev => [...prev, { role: 'model', content: 'Sorry, something went wrong.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [currentMessage, isLoading]);
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
             <div className="p-6 border-b border-gray-700 text-center">
                <h2 className="text-2xl font-bold text-white mb-1">AI Chat Bot</h2>
                <p className="text-gray-400">Have a conversation with a creative assistant.</p>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6">
                {chatHistory.length === 0 && (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Start a conversation with the AI chat bot.</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
                 {isLoading && chatHistory[chatHistory.length - 1]?.role === 'user' && (
                    <div className="flex items-start gap-3 my-4 justify-start">
                        <BotIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                        <div className="px-4 py-3 rounded-2xl bg-gray-700 rounded-bl-lg">
                            <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                <div className="relative">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !currentMessage.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-400 hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;