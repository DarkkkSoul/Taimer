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
    <div className="h-screen w-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center relative overflow-hidden">
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
            <h1 className="text-2xl font-bold text-white/90 mb-2">Timer</h1>
            <p className="text-purple-200/70 text-sm">Stay focused, stay productive</p>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-12">
            <div className="relative">
              {/* Glow effect behind timer */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-indigo-400 blur-2xl opacity-30 rounded-2xl"></div>
              <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl md:text-6xl font-mono font-bold text-transparent bg-linear-to-r from-purple-300 to-indigo-300 bg-clip-text">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {/* Start/Pause Button */}
            {!isRunning ? (
              <button
                onClick={start}
                className="group relative flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/30 shadow-lg shadow-green-500/25"
              >
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            ) : (
              <button
                onClick={pause}
                className="group relative flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 shadow-lg shadow-yellow-500/25"
              >
                <Pause className="w-6 h-6 text-white" fill="currentColor" />
                <div className="absolute inset-0 bg-linear-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            )}

            {/* Reset Button */}
            <button
              onClick={reset}
              disabled={elapsedTime === 0}
              className={`group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 transform focus:outline-none ${
                elapsedTime === 0
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : 'bg-linear-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 hover:scale-105 focus:ring-4 focus:ring-red-500/30 shadow-lg shadow-red-500/25'
              }`}
            >
              <RotateCcw className={`w-6 h-6 ${elapsedTime === 0 ? 'text-gray-400' : 'text-white'}`} />
              {elapsedTime > 0 && (
                <div className="absolute inset-0 bg-linear-to-r from-red-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          {/* Status Indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isRunning 
                  ? 'bg-green-400 animate-pulse' 
                  : elapsedTime > 0 
                  ? 'bg-yellow-400' 
                  : 'bg-gray-400'
              }`}></div>
              <span className="text-white/70 text-sm font-medium">
                {isRunning ? 'Running' : elapsedTime > 0 ? 'Paused' : 'Ready to start'}
              </span>
            </div>
          </div>

          {/* Decorative bottom element */}
          <div className="mt-8 flex justify-center">
            <div className="w-12 h-1 bg-linear-to-r from-purple-400 to-indigo-400 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Small Screen Layout - Minimal UI */}
        <div className="flex sm:hidden min-[280px]:min-h-[200px]:hidden flex-col items-center justify-center w-full h-full p-2">
          {/* Compact Timer Display */}
          <div className="text-center mb-4">
            <div className="text-3xl font-mono font-bold text-transparent bg-linear-to-r from-purple-300 to-indigo-300 bg-clip-text">
              {formatTime(elapsedTime)}
            </div>
          </div>

          {/* Compact Control Buttons */}
          <div className="flex justify-center items-center space-x-3">
            {/* Start/Pause Button - Smaller */}
            {!isRunning ? (
              <button
                onClick={start}
                className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-full transition-all duration-300 focus:outline-none shadow-lg"
              >
                <Pause className="w-4 h-4 text-white" fill="currentColor" />
              </button>
            )}

            {/* Reset Button - Smaller */}
            <button
              onClick={reset}
              disabled={elapsedTime === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 focus:outline-none ${
                elapsedTime === 0
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : 'bg-linear-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 shadow-lg'
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