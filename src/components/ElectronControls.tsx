import React, { useState, useEffect } from 'react';
import { Pin, PinOff } from 'lucide-react';

/**
 * Electron Controls Component
 * 
 * This component provides Electron-specific features like always-on-top toggle.
 * It only renders when running in Electron environment.
 * 
 * This is completely separate from timer logic - it only handles OS-level features.
 */

// Type definitions for Electron API
declare global {
  interface Window {
    electronAPI?: {
      toggleAlwaysOnTop: () => Promise<boolean>;
      getAlwaysOnTop: () => Promise<boolean>;
      isElectron: boolean;
    };
  }
}

export const ElectronControls: React.FC = () => {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  // Check if running in Electron and get initial state
  useEffect(() => {
    const checkElectron = async () => {
      if (window.electronAPI?.isElectron) {
        setIsElectron(true);
        try {
          const alwaysOnTop = await window.electronAPI.getAlwaysOnTop();
          setIsAlwaysOnTop(alwaysOnTop);
        } catch (error) {
          console.log('Electron API not available yet');
        }
      }
    };

    checkElectron();
  }, []);

  // Toggle always-on-top behavior
  const handleToggleAlwaysOnTop = async () => {
    if (window.electronAPI?.toggleAlwaysOnTop) {
      try {
        const newState = await window.electronAPI.toggleAlwaysOnTop();
        setIsAlwaysOnTop(newState);
      } catch (error) {
        console.error('Failed to toggle always-on-top:', error);
      }
    }
  };

  // Don't render if not in Electron
  if (!isElectron) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-20 min-[280px]:min-h-[200px]:top-4 min-[280px]:min-h-[200px]:right-4">
      <button
        onClick={handleToggleAlwaysOnTop}
        className={`group relative flex items-center justify-center w-8 h-8 min-[280px]:min-h-[200px]:w-10 min-[280px]:min-h-[200px]:h-10 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none ${
          isAlwaysOnTop
            ? 'border-2 border-yellow-400/90 bg-white hover:from-purple-400 hover:to-indigo-400 shadow-lg shadow-purple-500/25'
            : 'border-2 border-white bg-black/20 hover:bg-black/30 focus:ring-4 focus:ring-white/20'
        }`}
        title={isAlwaysOnTop ? 'Disable Always On Top' : 'Enable Always On Top'}
      >
        {isAlwaysOnTop ? (
          <Pin className="w-3 h-3 min-[280px]:min-h-[200px]:w-4 min-[280px]:min-h-[200px]:h-4 text-black" />
        ) : (
          <PinOff className="w-3 h-3 min-[280px]:min-h-[200px]:w-4 min-[280px]:min-h-[200px]:h-4 text-black" />
        )}
        
        {/* Hover effect */}
        <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
          isAlwaysOnTop 
            ? 'bg-linear-to-r from-purple-400 to-indigo-400' 
            : 'bg-white'
        }`}></div>
      </button>
    </div>
  );
};