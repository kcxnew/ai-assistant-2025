import React from 'react';
import type { Tab } from '../types';
import { LiveIcon, SearchIcon, ChatIcon, SettingsIcon } from '../constants';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onSettingsClick: () => void;
}

const NavItem: React.FC<{
  tab: Tab;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <span className="mr-4">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onSettingsClick }) => {
  return (
    <aside className="w-64 bg-gray-800/80 backdrop-blur-sm flex-shrink-0 flex flex-col p-4 border-r border-gray-700">
      <div className="px-2 mb-8">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Gemini
          <span className="block text-lg font-normal text-gray-400">Multi-Agent AI</span>
        </h1>
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        <NavItem
          tab="live"
          label="Live Conversation"
          icon={<LiveIcon className="w-6 h-6" />}
          isActive={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
        />
        <NavItem
          tab="search"
          label="Grounded Chat"
          icon={<SearchIcon className="w-6 h-6" />}
          isActive={activeTab === 'search'}
          onClick={() => setActiveTab('search')}
        />
        <NavItem
          tab="chat"
          label="Chat Bot"
          icon={<ChatIcon className="w-6 h-6" />}
          isActive={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        />
      </nav>
      <div>
         <button
            onClick={onSettingsClick}
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 rounded-lg"
          >
            <SettingsIcon className="w-6 h-6 mr-4" />
            <span className="font-medium">Settings</span>
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;