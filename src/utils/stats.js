import { lastNDays } from "./dates";

export function buildWeeklySeries(focusByDay, tasksDoneByDay) {
  const days = lastNDays(7);
  return days.map((day) => ({
    day: day.slice(5), // MM-DD
    focusMin: focusByDay?.[day] ?? 0,
    tasksDone: tasksDoneByDay?.[day] ?? 0,
  }));
}
