import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { formatTime } from '../utils/timeFormatter';
import { ElectronControls } from './ElectronControls';

/**
 * Timer Component
 * Displays a timer with start, pause, and reset functionality
 * Uses timestamp-based calculation to prevent drift
 * Themed with purple gradient inspired by Aura AI design
 * 
 * Responsive design:
 * - Large screens: Full UI with headers, status, decorations
 * - Small screens (< 280px width or < 200px height): Minimal UI with just timer and buttons
 */
export const Timer: React.FC = () => {
  const { isRunning, elapsedTime, start, pause, reset } = useTimer();

  return (
    <div className="h-screen w-screen bg-[#ffcd00] flex items-center justify-center relative overflow-hidden">
      {/* Electron Controls (only shows in Electron and larger screens) */}
      <div className=" min-[280px]:min-h-[200px]:block">
        <ElectronControls />
      </div>

      {/* Background decorative elements (hidden on small screens) */}
      <div className="absolute inset-0 overflow-hidden hidden min-[280px]:min-h-[200px]:block">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Timer Container - Responsive Layout */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        
        {/* Large Screen Layout */}
        <div className="hidden sm:block min-[280px]:min-h-[200px]:flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white/90 mb-2">Taimer</h1>
            <p className="text-purple-200 text-sm">Stay focused, stay productive</p>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-10">
            <div className="relative">
              <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl md:text-6xl font-mono font-bold text-[#3d474e] clip-text">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
         <div className="flex justify-center items-center space-x-3">
            {/* Start/Pause Button - Smaller */}
            {!isRunning ? (
              <button
                onClick={start}
                className="flex items-center justify-center w-12 h-12 border-2 cursor-pointer border-white/90 rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Play className="w-4 h-4 text-white/90 ml-0.5" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center justify-center bg-white w-12 h-12 cursor-pointer rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Pause className="w-4 h-4 text-[#2c2f38]" fill="currentColor" />
              </button>
            )}

            {/* Reset Button - Smaller */}
            <button
              onClick={reset}
              disabled={elapsedTime === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 focus:outline-none ${
                elapsedTime === 0
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : 'bg-[#192230] shadow-lg cursor-pointer'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${elapsedTime === 0 ? 'text-gray-400' : 'text-white'}`} />
            </button>
          </div>

          {/* Decorative bottom element */}
          <div className="mt-8 flex justify-center">
            <div className="w-12 h-1 bg-[#2c2f38] rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Small Screen Layout - Minimal UI */}
        <div className="flex sm:hidden min-[280px]:min-h-[200px]:hidden flex-col items-center justify-center w-full h-full p-2">
          {/* Compact Timer Display */}
          <div className="text-center mb-4">
            <div className="text-3xl font-mono font-bold text-[#3d474e] clip-text">
              {formatTime(elapsedTime)}
            </div>
          </div>

          {/* Compact Control Buttons */}
          <div className="flex justify-center items-center space-x-3">
            {/* Start/Pause Button - Smaller */}
            {!isRunning ? (
              <button
                onClick={start}
                className="flex items-center justify-center w-10 h-10 border-2 cursor-pointer border-white/90 rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Play className="w-4 h-4 text-white/90 ml-0.5" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center justify-center bg-white w-10 h-10 cursor-pointer rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Pause className="w-4 h-4 text-[#2c2f38]" fill="currentColor" />
              </button>
            )}

            {/* Reset Button - Smaller */}
            <button
              onClick={reset}
              disabled={elapsedTime === 0}
              className={`flex items-center justify-center w-10 h-10  rounded-full transition-all duration-300 focus:outline-none ${
                elapsedTime === 0
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : 'bg-[#192230] shadow-lg cursor-pointer'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${elapsedTime === 0 ? 'text-gray-400' : 'text-white'}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};