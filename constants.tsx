import React from 'react';

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"></path>
    <path d="M17 11a1 1 0 012 0v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1z"></path>
    <path d="M12 18.5a1.5 1.5 0 01-1.5-1.5v-2a1.5 1.5 0 013 0v2a1.5 1.5 0 01-1.5 1.5z"></path>
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v8h-2v-8z"></path>
    <rect x="8" y="8" width="8" height="8" rx="1" ry="1"></rect>
  </svg>
);


export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.5 14c-.83 0-1.5-.67-1.5-1.5S8.67 11 9.5 11s1.5.67 1.5 1.5S10.33 14 9.5 14zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 11 14.5 11s1.5.67 1.5 1.5S15.33 14 14.5 14zM12 9c-1.38 0-2.5-1.12-2.5-2.5S10.62 4 12 4s2.5 1.12 2.5 2.5S13.38 9 12 9z"></path>
    </svg>
);

export const LiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6V7.5a6 6 0 0 0-12 0v5.25a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a3 3 0 0 1-3-3V7.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
  </svg>
);


export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0-9-9" />
  </svg>
);


export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.198-.033 1.634.333l10.5 11.25c.387.415.622.96.622 1.542 0 .582-.235 1.127-.622 1.542l-10.5 11.25c-.436.366-1.08.553-1.634.333-.55-.219-1.02-.684-1.11-1.226l-.28-1.68c-.028-.168.038-.337.143-.463l.994-1.132c.081-.092.143-.207.143-.333v-9.332c0-.126-.062-.24-.143-.333l-.994-1.132a.52.52 0 0 1-.143-.463l.28-1.68Zm4.28 1.134a.938.938 0 0 0-.938-.937h-.018a.938.938 0 0 0-.938.937v.868c0 .517.42.937.937.937h.018a.938.938 0 0 0 .938-.937v-.868Zm0 3.332a.938.938 0 0 0-.938-.937h-.018a.938.938 0 0 0-.938.937v.868c0 .517.42.937.937.937h.018a.938.938 0 0 0 .938-.937v-.868Zm0 3.332a.938.938 0 0 0-.938-.937h-.018a.938.938 0 0 0-.938.937v.868c0 .517.42.937.937.937h.018a.938.938 0 0 0 .938-.937v-.868Zm0 3.332a.938.938 0 0 0-.938-.937h-.018a.938.938 0 0 0-.938.937v.868c0 .517.42.937.937.937h.018a.938.938 0 0 0 .938-.937v-.868Z" />
    </svg>
);