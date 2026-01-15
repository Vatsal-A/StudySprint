import Card from "../components/ui/Card";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildWeeklySeries } from "../utils/stats";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Progress() {
  const [focusByDay] = useLocalStorage("studysprint_focusByDay", {});
  const [tasksDoneByDay] = useLocalStorage("studysprint_tasksDoneByDay", {});
  const [streak] = useLocalStorage("studysprint_streak", { current: 0, best: 0, lastActiveDay: null });

  const data = buildWeeklySeries(focusByDay, tasksDoneByDay);

  return (
    <div className="grid grid-cols-1 gap-5">
      <Card title="Weekly Progress">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Mini label="Current streak" value={`${streak.current} 🔥`} />
          <Mini label="Best streak" value={`${streak.best}`} />
          <Mini label="Last active day" value={streak.lastActiveDay ?? "—"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-sm text-zinc-300 mb-3">Focus Minutes (Last 7 days)</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="focusMin" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-sm text-zinc-300 mb-3">Tasks Done (Last 7 days)</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasksDone" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-950/50 border border-zinc-800 p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
