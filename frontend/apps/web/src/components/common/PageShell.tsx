import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-volt-400">
            VoltTwin AI
          </NavLink>
          <nav className="flex gap-5 text-sm text-slate-300">
            <NavLink to="/">Journey</NavLink>
            <NavLink to="/operator">Digital Twin</NavLink>
            <NavLink to="/admin">Demo</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
