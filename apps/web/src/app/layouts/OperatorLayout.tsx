import { Suspense, useState, type PropsWithChildren } from "react";
import {
  Activity, AlertTriangle, BarChart3, BatteryCharging, Bell, Building2, CalendarClock,
  ChartNoAxesCombined, ChevronRight, CircleParking, CreditCard, Gauge, LayoutDashboard,
  LockKeyhole, Menu, MapPinned, RadioTower, Settings, SlidersHorizontal, SquareParking,
  Unplug, UsersRound, X, Zap,
  type LucideIcon,
} from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { INFRASTRUCTURE_ROLES, useOperatorAuth } from "../providers/OperatorAuthProvider";

interface NavigationItem { label: string; path: string; icon: LucideIcon }
interface NavigationGroup { label: string; items: NavigationItem[] }

const groups: NavigationGroup[] = [
  { label: "Workspace", items: [{ label: "Overview", path: "/operator", icon: LayoutDashboard }] },
  { label: "Charging", items: [
    { label: "Stations", path: "/operator/stations", icon: Building2 },
    { label: "Chargers", path: "/operator/chargers", icon: Zap },
    { label: "Live charger status", path: "/operator/charger-status", icon: Activity },
    { label: "Charging reservations", path: "/operator/charging-reservations", icon: CalendarClock },
    { label: "Charging sessions", path: "/operator/charging-sessions", icon: BatteryCharging },
    { label: "Pricing", path: "/operator/pricing", icon: CreditCard },
  ] },
  { label: "Parking", items: [
    { label: "Parking locations", path: "/operator/parking-locations", icon: MapPinned },
    { label: "Parking bays", path: "/operator/parking-bays", icon: SquareParking },
    { label: "Live occupancy", path: "/operator/occupancy", icon: CircleParking },
    { label: "Parking reservations", path: "/operator/parking-reservations", icon: CalendarClock },
    { label: "Parking sessions", path: "/operator/parking-sessions", icon: UsersRound },
  ] },
  { label: "Infrastructure", items: [
    { label: "IoT devices", path: "/operator/devices", icon: RadioTower },
    { label: "Device health", path: "/operator/device-health", icon: Gauge },
    { label: "Smart lock control", path: "/operator/smart-locks", icon: LockKeyhole },
  ] },
  { label: "Performance", items: [
    { label: "Revenue", path: "/operator/revenue", icon: ChartNoAxesCombined },
    { label: "Utilization", path: "/operator/utilization", icon: BarChart3 },
    { label: "Analytics", path: "/operator/analytics", icon: SlidersHorizontal },
    { label: "Alerts", path: "/operator/alerts", icon: Bell },
  ] },
  { label: "Account", items: [{ label: "Settings", path: "/operator/settings", icon: Settings }] },
];

const allItems = groups.flatMap((group) => group.items);

export function RequireInfrastructureOperator({ children }: PropsWithChildren) {
  const { user, isLoading, logout } = useOperatorAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="operator-app grid min-h-screen place-items-center bg-[#F8FAFC]"><div className="text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#2563EB]" /><p className="mt-3 text-sm text-[#64748B]">Verifying access…</p></div></div>;
  }
  if (!user) {
    return <Navigate to="/operator/login" replace />;
  }
  if (!INFRASTRUCTURE_ROLES.has(user.role)) {
    return <div className="operator-app grid min-h-screen place-items-center bg-[#F8FAFC] p-6"><div className="max-w-md rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm"><AlertTriangle className="mx-auto h-9 w-9 text-[#D97706]" /><h1 className="mt-4 text-xl font-semibold text-[#111827]">Operator access required</h1><p className="mt-2 text-sm text-[#64748B]">Your {user.role} account is not assigned to the infrastructure operations workspace.</p><button type="button" className="mt-6 rounded-md bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]" onClick={() => { logout(); navigate("/operator/login", { replace: true }); }}>Use another account</button></div></div>;
  }
  return children;
}

export function OperatorLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useOperatorAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const current = [...allItems].sort((a, b) => b.path.length - a.path.length).find((item) => item.path === "/operator" ? location.pathname === item.path : location.pathname.startsWith(item.path));

  const sidebar = (
    <div className="flex h-full flex-col bg-[#111827] text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]"><Unplug className="h-5 w-5" /></span>
        <div><p className="text-sm font-semibold leading-4">EV Mobility</p><p className="mt-1 text-[11px] text-slate-400">Infrastructure operations</p></div>
        <button type="button" aria-label="Close navigation" className="ml-auto rounded-md p-1.5 text-slate-400 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
      </div>
      <nav aria-label="Operator modules" className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => <div key={group.label} className="mb-5"><p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</p><div className="space-y-0.5">{group.items.map((item) => <NavLink key={item.path} to={item.path} end={item.path === "/operator"} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${isActive ? "bg-[#2563EB] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><item.icon className="h-4 w-4 shrink-0" /><span>{item.label}</span></NavLink>)}</div></div>)}
      </nav>
      <div className="border-t border-white/10 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0F766E] text-xs font-semibold">{user?.name?.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{user?.name}</p><p className="truncate text-[11px] text-slate-400">Infrastructure operator</p></div><button type="button" title="Sign out" aria-label="Sign out" className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white" onClick={() => { logout(); navigate("/operator/login"); }}><ChevronRight className="h-4 w-4" /></button></div></div>
    </div>
  );

  return <div className="operator-app min-h-screen bg-[#F8FAFC] text-[#111827]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
    {open ? <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close navigation overlay" className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} /><aside className="relative h-full w-72">{sidebar}</aside></div> : null}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
        <button type="button" aria-label="Open navigation" className="mr-3 rounded-md border border-[#E5E7EB] p-2 text-[#64748B] lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
        <div><p className="text-xs text-[#64748B]">Operations / {current?.label ?? "Workspace"}</p><p className="text-sm font-semibold">{current?.label ?? "Infrastructure operations"}</p></div>
        <div className="ml-auto flex items-center gap-2"><NavLink aria-label="Open alerts" to="/operator/alerts" className="rounded-md border border-[#E5E7EB] p-2 text-[#64748B] hover:bg-slate-50 hover:text-[#111827]"><Bell className="h-4 w-4" /></NavLink><span className="hidden rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-medium text-[#16A34A] sm:inline">Assigned scope</span></div>
      </header>
      <main className="px-4 py-6 sm:px-6 xl:px-8"><Suspense fallback={<div className="grid min-h-64 place-items-center rounded-lg border border-[#E5E7EB] bg-white"><div className="text-center"><div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#2563EB]" /><p className="mt-3 text-sm text-[#64748B]">Loading module…</p></div></div>}><Outlet /></Suspense></main>
    </div>
  </div>;
}
