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

export interface UseTimerReturn extends TimerState, TimerControls { }

// LocalStorage key for persisting timer state
const STORAGE_KEY = 'timer-state';

// Interface for persisted state
interface PersistedTimerState {
  startTime: number | null;
  elapsedBeforePause: number;
  isRunning: boolean;
}

/**
 * Custom hook for managing timer state and controls
 * Uses timestamp-based calculation to avoid drift
 * Persists state to localStorage and auto-pauses on app close
 */
export const useTimer = (): UseTimerReturn => {
  // Timer state - initialize from localStorage if available
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: PersistedTimerState = JSON.parse(saved);
      // Always force isRunning to false on mount (auto-pause behavior)
      return false;
    }
    return false;
  });

  const [elapsedTime, setElapsedTime] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: PersistedTimerState = JSON.parse(saved);
      // Restore the elapsed time from before pause
      return parsed.elapsedBeforePause;
    }
    return 0;
  });

  // Refs to store timing data without causing re-renders
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: PersistedTimerState = JSON.parse(saved);
      return parsed.elapsedBeforePause;
    }
    return 0;
  });
  const intervalRef = useRef<number | null>(null);

  /**
   * Persists timer state to localStorage
   */
  const persistState = useCallback((state: PersistedTimerState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

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

      // Persist state
      persistState({
        startTime: startTimeRef.current,
        elapsedBeforePause: pausedTimeRef.current,
        isRunning: true,
      });
    }
  }, [isRunning, persistState]);

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

      // Persist state
      persistState({
        startTime: null,
        elapsedBeforePause: pausedTimeRef.current,
        isRunning: false,
      });
    }
  }, [isRunning, persistState]);

  /**
   * Resets the timer
   * Clears all timing data and stops the interval
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    // Persist cleared state
    persistState({
      startTime: null,
      elapsedBeforePause: 0,
      isRunning: false,
    });
  }, [persistState]);

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

  // Effect to handle auto-pause on app close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // If timer is running, calculate final elapsed time and auto-pause
      if (isRunning && startTimeRef.current !== null) {
        const now = Date.now();
        const finalElapsed = now - startTimeRef.current + pausedTimeRef.current;

        // Persist auto-paused state
        persistState({
          startTime: null,
          elapsedBeforePause: finalElapsed,
          isRunning: false,
        });
      }
    };

    // Add event listener for app close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, persistState]);

  return {
    isRunning,
    elapsedTime,
    start,
    pause,
    reset,
  };
};