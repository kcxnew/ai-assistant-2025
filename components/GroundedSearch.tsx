import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { SendIcon, UserIcon, BotIcon } from '../constants';
import type { Settings } from '../types';

interface Source {
    web?: {
        uri: string;
        title: string;
    }
}

interface GroundedChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: Source[];
}

const GroundedChatBubble: React.FC<{ message: GroundedChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <BotIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />}
            <div className={`px-4 py-3 rounded-2xl max-w-lg ${isUser ? 'bg-blue-600 rounded-br-lg text-white' : 'bg-gray-700 rounded-bl-lg text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-600">
                        <h4 className="text-sm font-semibold text-blue-300 mb-2">Sources</h4>
                        <ul className="space-y-2">
                            {message.sources.map((source, index) => source.web && (
                                <li key={index}>
                                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                                        {index + 1}. {source.web.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isUser && <UserIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />}
        </div>
    );
};

interface GroundedSearchProps {
    settings: Settings;
    resetKey: number;
}

const GroundedSearch: React.FC<GroundedSearchProps> = ({ settings, resetKey }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<GroundedChatMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
            model: settings.groundedModel,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        setChatHistory([]);
    }, [settings.groundedModel, resetKey]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);


    const handleSendMessage = useCallback(async () => {
        if (!query.trim() || isLoading || !chatRef.current) return;

        const userMessage: GroundedChatMessage = { role: 'user', content: query };
        setChatHistory(prev => [...prev, userMessage]);
        const currentQuery = query;
        setQuery('');
        setIsLoading(true);
        setError(null);

        try {
            const result = await chatRef.current.sendMessage(currentQuery);
            
            const modelMessage: GroundedChatMessage = {
                role: 'model',
                content: result.text,
                sources: result.candidates?.[0]?.groundingMetadata?.groundingChunks || []
            };
            setChatHistory(prev => [...prev, modelMessage]);

        } catch (err: any) {
            console.error('Search failed:', err);
            const errorMessage = err.message || 'An unexpected error occurred.';
            setError(errorMessage);
            setChatHistory(prev => [...prev, {role: 'model', content: `Sorry, something went wrong. Please try again.`}]);
        } finally {
            setIsLoading(false);
        }
    }, [query, isLoading]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-800/50 rounded-lg shadow-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700 text-center">
                 <h2 className="text-2xl font-bold text-white mb-1">Grounded Chat</h2>
                <p className="text-gray-400">Ask questions for up-to-date, source-backed answers.</p>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6">
                {chatHistory.map((msg, index) => (
                    <GroundedChatBubble key={index} message={msg} />
                ))}
                 {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1]?.role === 'user' && (
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
                 {chatHistory.length === 0 && !isLoading && (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">e.g., Who won the latest F1 race?</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
                 <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a follow-up question..."
                        disabled={isLoading}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !query.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-400 hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroundedSearch;