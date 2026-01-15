import { useCallback, useMemo, useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useHotkeys } from "../hooks/useHotKeys";
import { formatTime, usePomodoro } from "../hooks/usePomodoro";
import { ymd } from "../utils/dates";

function clampNumber(raw, min, max, fallback) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export default function Dashboard() {
  const today = ymd(new Date());

  // Settings (C)
  const [settings, setSettings] = useLocalStorage("studysprint_settings", {
    focusMin: 25,
    breakMin: 5,
  });

  const [focusInput, setFocusInput] = useState(String(settings.focusMin));
const [breakInput, setBreakInput] = useState(String(settings.breakMin));

useEffect(() => {
  setFocusInput(String(settings.focusMin));
  setBreakInput(String(settings.breakMin));
}, [settings.focusMin, settings.breakMin]);

function commitFocus() {
  const next = clampNumber(focusInput, 1, 180, settings.focusMin); // allow 1..180
  setSettings((s) => ({ ...s, focusMin: next }));
}

function commitBreak() {
  const next = clampNumber(breakInput, 1, 120, settings.breakMin); // allow 1..120
  setSettings((s) => ({ ...s, breakMin: next }));
}

  // Tasks store (for quick stats)
  const [tasks, setTasks] = useLocalStorage("studysprint_tasks", []);

  // Progress store (A)
  const [focusByDay, setFocusByDay] = useLocalStorage("studysprint_focusByDay", {});
  const [tasksDoneByDay, setTasksDoneByDay] = useLocalStorage("studysprint_tasksDoneByDay", {});

  // Streak store (B)
  const [streak, setStreak] = useLocalStorage("studysprint_streak", {
    current: 0,
    best: 0,
    lastActiveDay: null,
  });

  // When a focus session completes, add focus minutes to today
  const onFocusMinute = useCallback(
    (minutes) => {
      setFocusByDay((prev) => ({
        ...prev,
        [today]: (prev?.[today] ?? 0) + minutes,
      }));

      // Update streak based on doing at least one focus session today
      setStreak((prev) => {
        const last = prev.lastActiveDay;
        if (last === today) return prev;

        // If lastActiveDay is yesterday => +1; else reset to 1
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yesterday = ymd(y);

        const nextCurrent = last === yesterday ? prev.current + 1 : 1;
        const nextBest = Math.max(prev.best ?? 0, nextCurrent);

        return { current: nextCurrent, best: nextBest, lastActiveDay: today };
      });
    },
    [setFocusByDay, setStreak, today]
  );

  const onSessionEnd = useCallback(() => {
    // optional hook point (sound/notification later)
  }, []);

  const { mode, running, secondsLeft, controls } = usePomodoro({
    settings,
    onFocusMinute,
    onSessionEnd,
  });

  // Spacebar toggles timer (and doesn’t trigger while typing)
  useHotkeys({
    onToggleTimer: controls.toggle,
  });

  // Task stats
  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const completion = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // Every time tasks change, update tasksDoneByDay for today
  // (Keeps progress charts accurate)
  useMemo(() => {
    setTasksDoneByDay((prev) => ({
      ...prev,
      [today]: doneCount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card title="Pomodoro Timer">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-zinc-400 text-sm mb-1">{mode}</div>
            <div className="text-5xl font-semibold tabular-nums">{formatTime(secondsLeft)}</div>
            <div className="text-xs text-zinc-500 mt-2">
              Tip: Press <span className="text-zinc-300 font-semibold">Space</span> to Start/Pause
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={controls.setFocus} variant="secondary">Focus</Button>
            <Button onClick={controls.setBreak} variant="secondary">Break</Button>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button onClick={controls.start} disabled={running}>Start</Button>
          <Button onClick={controls.pause} variant="secondary" disabled={!running}>Pause</Button>
          <Button onClick={controls.reset} variant="secondary">Reset</Button>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-5">
        <Card title="Today’s Overview">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <MiniStat label="Tasks total" value={tasks.length} />
            <MiniStat label="Tasks done" value={doneCount} />
            <MiniStat label="Completion" value={`${completion}%`} />
            <MiniStat label="Streak" value={`${streak.current} 🔥`} sub={`Best: ${streak.best}`} />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm text-zinc-300 mb-3">Pomodoro Settings</div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-400 w-20">Focus</label>
                <input
                  className="w-full rounded-xl bg-zinc-950/60 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
                  value={focusInput}
                    onChange={(e) => setFocusInput(e.target.value)}
                    onBlur={commitFocus}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                      commitFocus();
                      e.currentTarget.blur();
                      }
                  }}
                />
                <span className="text-sm text-zinc-500">min</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm text-zinc-400 w-20">Break</label>
                <input
                  className="w-full rounded-xl bg-zinc-950/60 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
                  value={breakInput}
                    onChange={(e) => setBreakInput(e.target.value)}
                    onBlur={commitBreak}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitBreak();
                        e.currentTarget.blur();
                    }
                  }}
                />
                <span className="text-sm text-zinc-500">min</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm text-zinc-300 mb-2">Progress Today</div>
              <div className="text-zinc-400 text-sm">
                Focus minutes: <span className="text-zinc-200 font-semibold">{focusByDay?.[today] ?? 0}</span>
              </div>
              <div className="text-zinc-400 text-sm mt-1">
                Tasks done: <span className="text-zinc-200 font-semibold">{tasksDoneByDay?.[today] ?? 0}</span>
              </div>
              <div className="text-xs text-zinc-500 mt-3">
                Finish one focus session today to keep your streak.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-zinc-950/50 border border-zinc-800 p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-xs text-zinc-500 mt-1">{sub}</div> : null}
    </div>
  );
}
