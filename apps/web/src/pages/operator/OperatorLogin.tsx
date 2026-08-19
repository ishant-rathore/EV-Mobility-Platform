import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, LockKeyhole, Unplug } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { INFRASTRUCTURE_ROLES, useOperatorAuth } from "../../app/providers/OperatorAuthProvider";

export function OperatorLogin() {
  const { user, login } = useOperatorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && INFRASTRUCTURE_ROLES.has(user.role)) return <Navigate to="/operator" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      const destination = (location.state as { from?: string } | null)?.from ?? "/operator";
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="operator-app grid min-h-screen bg-[#F8FAFC] lg:grid-cols-[0.85fr_1.15fr]">
    <aside className="hidden bg-[#111827] p-12 text-white lg:flex lg:flex-col lg:justify-between"><div><span className="grid h-11 w-11 place-items-center rounded-lg bg-[#2563EB]"><Unplug className="h-6 w-6" /></span><h1 className="mt-8 max-w-md text-3xl font-semibold tracking-tight">One workspace for charging and parking operations.</h1><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">Monitor assigned infrastructure, manage availability, review revenue, and control connected devices through authenticated platform APIs.</p></div><p className="text-xs text-slate-500">EV Mobility Platform · Operations Console</p></aside>
    <main className="grid place-items-center p-6"><form onSubmit={submit} className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#2563EB] text-white"><Unplug className="h-5 w-5" /></span><span className="font-semibold">EV Mobility</span></div><LockKeyhole className="mt-8 h-7 w-7 text-[#2563EB] lg:mt-0" /><h2 className="mt-4 text-2xl font-semibold tracking-tight">Operator sign in</h2><p className="mt-2 text-sm text-[#64748B]">Use your infrastructure operations account.</p>
      {error ? <div role="alert" className="mt-5 flex gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-[#DC2626]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div> : null}
      <label className="mt-6 block text-sm font-medium" htmlFor="operator-email">Email address</label><input id="operator-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
      <label className="mt-4 block text-sm font-medium" htmlFor="operator-password">Password</label><input id="operator-password" required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
      <button type="submit" disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}<ArrowRight className="h-4 w-4" /></button>
    </form></main>
  </div>;
}
