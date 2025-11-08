export type Tab = 'live' | 'search' | 'chat';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Transcript {
  speaker: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

export type LiveVoice = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

// Fix: Add LIVE_VOICES constant for use in SettingsModal.tsx
export const LIVE_VOICES: LiveVoice[] = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

// Model Types
export const LIVE_MODELS = ['gemini-2.5-flash-native-audio-preview-09-2025'] as const;
export const GROUNDED_MODELS = ['gemini-2.5-flash'] as const;
export const CHAT_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro'] as const;

export type LiveModel = typeof LIVE_MODELS[number];
export type GroundedModel = typeof GROUNDED_MODELS[number];
export type ChatModel = typeof CHAT_MODELS[number];

export interface Settings {
  liveVoice: LiveVoice;
  liveModel: LiveModel;
  groundedModel: GroundedModel;
  chatModel: ChatModel;
  chatBotPersona: string;
}
