import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-volt-400">
            VoltTwin AI
          </NavLink>
          <nav aria-label="Primary navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300" />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
