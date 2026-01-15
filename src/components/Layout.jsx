import { NavLink, Outlet } from "react-router-dom";

const linkBase = "px-3 py-2 rounded-xl text-sm font-medium transition";
const linkOff = "text-zinc-300 hover:bg-zinc-900/60 hover:text-white";
const linkOn = "bg-zinc-900/70 border border-zinc-800 text-white";

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-2xl font-semibold tracking-tight">StudySprint</div>
            <div className="text-zinc-400 text-sm">Pomodoro + Tasks + Progress — all in one place</div>
          </div>

          <nav className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-2">
            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkOn : linkOff}`}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `${linkBase} ${isActive ? linkOn : linkOff}`}>
              Tasks
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `${linkBase} ${isActive ? linkOn : linkOff}`}>
              Progress
            </NavLink>
          </nav>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
