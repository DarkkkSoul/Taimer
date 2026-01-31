import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  elapsedTime: number; // in milliseconds
}

export interface TimerControls {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export interface UseTimerReturn extends TimerState, TimerControls {}

/**
 * Custom hook for managing timer state and controls
 * Uses timestamp-based calculation to avoid drift
 */
export const useTimer = (): UseTimerReturn => {
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Refs to store timing data without causing re-renders
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  /**
   * Updates elapsed time based on current timestamp
   * This approach prevents drift by always calculating from the actual time difference
   */
  const updateElapsedTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = Date.now();
      const currentElapsed = now - startTimeRef.current + pausedTimeRef.current;
      setElapsedTime(currentElapsed);
    }
  }, []);

  /**
   * Starts the timer
   * Records start timestamp and begins interval for UI updates
   */
  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [isRunning]);

  /**
   * Pauses the timer
   * Preserves elapsed time and stops the interval
   */
  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current !== null) {
      const now = Date.now();
      pausedTimeRef.current += now - startTimeRef.current;
      startTimeRef.current = null;
      setIsRunning(false);
    }
  }, [isRunning]);

  /**
   * Resets the timer
   * Clears all timing data and stops the interval
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, []);

  // Effect to manage the update interval
  useEffect(() => {
    if (isRunning) {
      // Update every 100ms for smooth UI updates
      intervalRef.current = setInterval(updateElapsedTime, 100);
    } else {
      // Clean up interval when paused or stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateElapsedTime]);

  return {
    isRunning,
    elapsedTime,
    start,
    pause,
    reset,
  };
};