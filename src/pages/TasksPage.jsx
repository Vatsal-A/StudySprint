import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage("studysprint_tasks", []);
  const [value, setValue] = useState("");

  function addTask() {
    const t = value.trim();
    if (!t) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), title: t, done: false }, ...prev]);
    setValue("");
  }

  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  return (
    <div className="grid grid-cols-1 gap-5">
      <Card title="Tasks">
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask(); // ✅ Enter adds task
            }}
            placeholder="Add a task and press Enter…"
            className="flex-1 rounded-2xl bg-zinc-950/60 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-zinc-600"
          />
          <Button onClick={addTask}>Add</Button>
        </div>

        <div className="mt-4 text-sm text-zinc-400">
          Total: <span className="text-zinc-200 font-semibold">{tasks.length}</span> • Done:{" "}
          <span className="text-zinc-200 font-semibold">{doneCount}</span>
        </div>

        <div className="mt-5 space-y-2">
          {tasks.length === 0 ? (
            <div className="text-zinc-500 text-sm">No tasks yet. Add your first one above.</div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/40 px-4 py-3"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="accent-white"
                  />
                  <span className={t.done ? "line-through text-zinc-500" : ""}>{t.title}</span>
                </label>

                <Button variant="secondary" onClick={() => removeTask(t.id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
