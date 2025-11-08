import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAI_Blob } from '@google/genai';
import type { Transcript, Settings } from '../types';
import { MicIcon, StopIcon, UserIcon, BotIcon } from '../constants';

// Audio Encoding & Decoding Functions (as per Gemini API documentation)
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

const TranscriptItem: React.FC<{ transcript: Transcript }> = ({ transcript }) => {
    const isUser = transcript.speaker === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <BotIcon className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />}
            <div className={`px-4 py-3 rounded-2xl max-w-md ${isUser ? 'bg-blue-600 rounded-br-lg' : 'bg-gray-700 rounded-bl-lg'} ${!transcript.isFinal ? 'opacity-70' : ''}`}>
                <p className="text-white">{transcript.text}</p>
            </div>
            {isUser && <UserIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />}
        </div>
    );
};

interface LiveConversationProps {
    settings: Settings;
    resetKey: number;
}

const LiveConversation: React.FC<LiveConversationProps> = ({ settings, resetKey }) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [status, setStatus] = useState('Idle. Press Start to begin.');
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const addOrUpdateTranscript = (speaker: 'user' | 'model', text: string, isFinal: boolean) => {
        setTranscripts(prev => {
            const newTranscripts = [...prev];
            const lastTranscript = newTranscripts[newTranscripts.length - 1];

            if (lastTranscript && lastTranscript.speaker === speaker && !lastTranscript.isFinal) {
                lastTranscript.text += text;
                lastTranscript.isFinal = isFinal;
            } else if (text) { // Don't add empty transcripts unless it's to finalize
                 newTranscripts.push({ speaker, text, isFinal });
            }
            // Finalize the last relevant transcript
            if (isFinal && lastTranscript && lastTranscript.speaker === speaker) {
                lastTranscript.isFinal = true;
            }

            return newTranscripts;
        });
    };

    const handleStop = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        
        if(scriptProcessorRef.current && mediaStreamSourceRef.current && inputAudioContextRef.current) {
            mediaStreamSourceRef.current.disconnect();
            scriptProcessorRef.current.disconnect();
            inputAudioContextRef.current.close().catch(console.error);
        }

        if(outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(console.error);
        }

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        
        setIsSessionActive(false);
        setStatus('Session ended. Press Start to begin again.');
    }, []);

    useEffect(() => {
        if (isSessionActive) {
            handleStop();
            setStatus('Settings changed. Please start a new session.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings, resetKey]);

    const handleStart = async () => {
        setTranscripts([]);
        setStatus('Requesting permissions...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            setStatus('Initializing...');

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            let currentInputTranscription = '';
            let currentOutputTranscription = '';

            sessionPromiseRef.current = ai.live.connect({
                model: settings.liveModel,
                callbacks: {
                    onopen: () => {
                        setStatus('Connected. Start speaking...');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;

                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: GenAI_Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            currentInputTranscription += text;
                            addOrUpdateTranscript('user', text, false);
                        }
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            currentOutputTranscription += text;
                            addOrUpdateTranscript('model', text, false);
                        }

                        if (message.serverContent?.turnComplete) {
                            addOrUpdateTranscript('user', '', true);
                            addOrUpdateTranscript('model', '', true);
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            setStatus("Speaking...");
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            
                            const currentTime = outputAudioContextRef.current.currentTime;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);

                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContextRef.current.destination);
                            
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                if (sourcesRef.current.size === 0) {
                                    setStatus("Listening...");
                                }
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(source => source.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('API Error:', e);
                        setStatus(`Error: ${e.message}. Please try again.`);
                        handleStop();
                    },
                    onclose: () => {
                        setStatus('Connection closed.');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.liveVoice } } },
                    systemInstruction: 'You are a friendly and helpful AI assistant.',
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

            setIsSessionActive(true);
        } catch (error) {
            console.error('Failed to start session:', error);
            setStatus('Failed to get microphone. Please check permissions.');
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-800/50 rounded-lg p-6 shadow-xl border border-gray-700">
             <div className="text-center">
                 <h2 className="text-2xl font-bold text-white mb-1">Live Conversation</h2>
                <p className="text-gray-400">Speak with the AI in real-time.</p>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 my-4">
                 {transcripts.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Your conversation will appear here.</p>
                    </div>
                )}
                {transcripts.map((t, i) => <TranscriptItem key={i} transcript={t} />)}
            </div>
            <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-700">
                <p className="text-center text-gray-400 mb-4 h-5">{status}</p>
                <button
                    onClick={isSessionActive ? handleStop : handleStart}
                    className={`flex items-center justify-center w-20 h-20 rounded-full text-white transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 ${isSessionActive ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                >
                    {isSessionActive ? <StopIcon className="w-10 h-10" /> : <MicIcon className="w-10 h-10" />}
                </button>
            </div>
        </div>
    );
};

export default LiveConversation;