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

// LocalStorage key
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

  // ✅ Read localStorage ONCE
  const savedState = localStorage.getItem(STORAGE_KEY);
  const parsedState: PersistedTimerState | null = savedState
    ? JSON.parse(savedState)
    : null;

  // Always force paused on mount
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [elapsedTime, setElapsedTime] = useState<number>(
    parsedState?.elapsedBeforePause ?? 0
  );

  // Refs (no lazy functions!)
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(
    parsedState?.elapsedBeforePause ?? 0
  );
  const intervalRef = useRef<number | null>(null);

  /**
   * Persist timer state
   */
  const persistState = useCallback((state: PersistedTimerState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  /**
   * Calculate elapsed time using timestamp difference
   * Prevents drift because it always uses actual time difference
   */
  const updateElapsedTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = Date.now();
      const currentElapsed =
        now - startTimeRef.current + pausedTimeRef.current;

      setElapsedTime(currentElapsed);
    }
  }, []);

  /**
   * Start timer
   */
  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setIsRunning(true);

      persistState({
        startTime: startTimeRef.current,
        elapsedBeforePause: pausedTimeRef.current,
        isRunning: true,
      });
    }
  }, [isRunning, persistState]);

  /**
   * Pause timer
   */
  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current !== null) {
      const now = Date.now();
      pausedTimeRef.current += now - startTimeRef.current;
      startTimeRef.current = null;

      setElapsedTime(pausedTimeRef.current);
      setIsRunning(false);

      persistState({
        startTime: null,
        elapsedBeforePause: pausedTimeRef.current,
        isRunning: false,
      });
    }
  }, [isRunning, persistState]);

  /**
   * Reset timer
   */
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);

    startTimeRef.current = null;
    pausedTimeRef.current = 0;

    persistState({
      startTime: null,
      elapsedBeforePause: 0,
      isRunning: false,
    });
  }, [persistState]);

  /**
   * Manage interval for smooth UI updates
   */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(updateElapsedTime, 100);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateElapsedTime]);

  /**
   * Auto-pause on app close
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning && startTimeRef.current !== null) {
        const now = Date.now();
        const finalElapsed =
          now - startTimeRef.current + pausedTimeRef.current;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            startTime: null,
            elapsedBeforePause: finalElapsed,
            isRunning: false,
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning]);

  return {
    isRunning,
    elapsedTime,
    start,
    pause,
    reset,
  };
};
