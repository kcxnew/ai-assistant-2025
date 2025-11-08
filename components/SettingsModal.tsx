import React, { useState, useEffect } from 'react';
import type { Settings, LiveVoice, LiveModel, GroundedModel, ChatModel } from '../types';
import { LIVE_VOICES, LIVE_MODELS, GROUNDED_MODELS, CHAT_MODELS } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSave: (newSettings: Settings) => void;
    onReinitialize: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave, onReinitialize }) => {
    const [currentSettings, setCurrentSettings] = useState<Settings>(settings);

    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings, isOpen]);

    const handleSave = () => {
        onSave(currentSettings);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 m-4 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">Settings</h2>
                    <p className="text-sm text-gray-400">Customize your AI agents.</p>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Model Settings */}
                    <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-white">Model Selection</h3>
                        <div>
                            <label htmlFor="liveModel" className="block text-sm font-medium text-gray-300 mb-2">
                                Live Conversation Model
                            </label>
                            <select
                                id="liveModel"
                                value={currentSettings.liveModel}
                                onChange={(e) => setCurrentSettings({ ...currentSettings, liveModel: e.target.value as LiveModel })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {LIVE_MODELS.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="groundedModel" className="block text-sm font-medium text-gray-300 mb-2">
                                Grounded Chat Model
                            </label>
                            <select
                                id="groundedModel"
                                value={currentSettings.groundedModel}
                                onChange={(e) => setCurrentSettings({ ...currentSettings, groundedModel: e.target.value as GroundedModel })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {GROUNDED_MODELS.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="chatModel" className="block text-sm font-medium text-gray-300 mb-2">
                                Chat Bot Model
                            </label>
                            <select
                                id="chatModel"
                                value={currentSettings.chatModel}
                                onChange={(e) => setCurrentSettings({ ...currentSettings, chatModel: e.target.value as ChatModel })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {CHAT_MODELS.map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Agent-Specific Settings */}
                     <div className="space-y-4 p-4 border border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-white">Agent Configuration</h3>
                        <div>
                            <label htmlFor="liveVoice" className="block text-sm font-medium text-gray-300 mb-2">
                                Live Conversation Voice
                            </label>
                            <select
                                id="liveVoice"
                                value={currentSettings.liveVoice}
                                onChange={(e) => setCurrentSettings({ ...currentSettings, liveVoice: e.target.value as LiveVoice })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {LIVE_VOICES.map((voice) => (
                                    <option key={voice} value={voice}>{voice}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="chatBotPersona" className="block text-sm font-medium text-gray-300 mb-2">
                                Chat Bot Persona (System Instruction)
                            </label>
                            <textarea
                                id="chatBotPersona"
                                rows={4}
                                value={currentSettings.chatBotPersona}
                                onChange={(e) => setCurrentSettings({ ...currentSettings, chatBotPersona: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="e.g., You are a Shakespearean poet."
                            />
                        </div>
                    </div>
                    
                    {/* API Key */}
                     <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-white">API Key</h3>
                        <p className="text-sm text-gray-400">
                           This application uses the API key provided by the environment. If you update your key, re-initialize the agents to apply the change.
                        </p>
                         <button
                            onClick={onReinitialize}
                            className="w-full px-4 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Re-initialize Agents
                        </button>
                    </div>

                </div>
                <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3 rounded-b-lg flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;