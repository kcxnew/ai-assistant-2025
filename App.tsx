import React, { useState } from 'react';
import type { Tab, Settings } from './types';
import LiveConversation from './components/LiveConversation';
import GroundedSearch from './components/GroundedSearch';
import ChatBot from './components/ChatBot';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import { CHAT_MODELS, GROUNDED_MODELS, LIVE_MODELS } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    liveVoice: 'Zephyr',
    liveModel: LIVE_MODELS[0],
    groundedModel: GROUNDED_MODELS[0],
    chatModel: CHAT_MODELS[0],
    chatBotPersona: 'You are a helpful and creative AI assistant. Be conversational and engaging.',
  });
  const [resetKey, setResetKey] = useState(0);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const handleReinitialize = () => {
    setResetKey(prev => prev + 1);
    setIsSettingsOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveConversation settings={settings} resetKey={resetKey} />;
      case 'search':
        return <GroundedSearch settings={settings} resetKey={resetKey} />;
      case 'chat':
        return <ChatBot settings={settings} resetKey={resetKey} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onReinitialize={handleReinitialize}
      />
    </div>
  );
};

export default App;