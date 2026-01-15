import { useEffect, useMemo, useState } from "react";
import { ymd } from "../utils/dates";

export function usePomodoro({
  settings,
  onFocusMinute,   // called when a focus session completes (adds minutes)
  onSessionEnd,    // called when focus/break ends (for streak logic if needed)
}) {
  const focusSecondsDefault = settings.focusMin * 60;
  const breakSecondsDefault = settings.breakMin * 60;

  const [mode, setMode] = useState("Focus"); // Focus | Break
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(focusSecondsDefault);

  // Keep timer aligned when settings change (only if not running)
  // useEffect(() => {
  //   if (running) return;
  //   setSecondsLeft(mode === "Focus" ? focusSecondsDefault : breakSecondsDefault);
  // }, [settings.focusMin, settings.breakMin, mode, running, focusSecondsDefault, breakSecondsDefault]);

  // The real fix: interval is managed by useEffect and always cleaned up
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const endedMode = mode;

          // Notify session end
          onSessionEnd?.({ endedMode, date: ymd(new Date()) });

          // If a focus session ended, add focus minutes for progress
          if (endedMode === "Focus") {
            onFocusMinute?.(settings.focusMin);
          }

          // Auto-switch modes
          const nextMode = mode === "Focus" ? "Break" : "Focus";
          setMode(nextMode);

          return nextMode === "Focus" ? focusSecondsDefault : breakSecondsDefault;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, mode, settings.focusMin, onFocusMinute, onSessionEnd, focusSecondsDefault, breakSecondsDefault]);

  const controls = useMemo(() => {
    return {
      start: () => setRunning(true),
      pause: () => setRunning(false),
      toggle: () => setRunning((r) => !r),
      reset: () => {
        setRunning(false);
        setMode("Focus");
        setSecondsLeft(focusSecondsDefault);
      },
      setFocus: () => {
        setRunning(false);
        setMode("Focus");
        setSecondsLeft(focusSecondsDefault);
      },
      setBreak: () => {
        setRunning(false);
        setMode("Break");
        setSecondsLeft(breakSecondsDefault);
      },
    };
  }, [focusSecondsDefault, breakSecondsDefault]);

  return { mode, running, secondsLeft, controls, setSecondsLeft, setMode, setRunning };
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
