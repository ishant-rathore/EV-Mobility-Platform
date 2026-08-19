import type { PropsWithChildren, ReactNode } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Inbox, LoaderCircle, Search, X } from "lucide-react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">{eyebrow}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">{title}</h1><p className="mt-1 max-w-3xl text-sm text-[#64748B]">{description}</p></div>{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}</div>;
}

export function Button({ variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const styles = variant === "primary" ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]" : variant === "danger" ? "border border-red-200 bg-white text-[#DC2626] hover:bg-red-50" : "border border-[#E5E7EB] bg-white text-[#111827] hover:bg-slate-50";
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`} />;
}

const badgeStyles: Record<string, string> = {
  AVAILABLE: "bg-green-50 text-[#16A34A]", ONLINE: "bg-green-50 text-[#16A34A]", COMPLETED: "bg-green-50 text-[#16A34A]", CONFIRMED: "bg-blue-50 text-[#2563EB]",
  OCCUPIED: "bg-indigo-50 text-[#4F46E5]", ACTIVE: "bg-sky-50 text-[#0284C7]", CHARGING: "bg-sky-50 text-[#0284C7]", PENDING: "bg-amber-50 text-[#D97706]",
  FAULTED: "bg-red-50 text-[#DC2626]", FAULT: "bg-red-50 text-[#DC2626]", CANCELLED: "bg-slate-100 text-[#64748B]", OFFLINE: "bg-slate-100 text-[#64748B]",
  UNREAD: "bg-red-50 text-[#DC2626]", READ: "bg-slate-100 text-[#64748B]", HEALTHY: "bg-green-50 text-[#16A34A]", STALE: "bg-amber-50 text-[#D97706]",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeStyles[status.toUpperCase()] ?? "bg-slate-100 text-[#64748B]"}`}>{status.replaceAll("_", " ")}</span>;
}

export function KpiCard({ label, value, hint, tone = "blue" }: { label: string; value: ReactNode; hint?: string; tone?: "blue" | "teal" | "green" | "amber" | "indigo" }) {
  const bar = { blue: "bg-[#2563EB]", teal: "bg-[#0F766E]", green: "bg-[#16A34A]", amber: "bg-[#D97706]", indigo: "bg-[#4F46E5]" }[tone];
  return <article className="relative overflow-hidden rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm"><span className={`absolute inset-y-0 left-0 w-1 ${bar}`} /><p className="text-xs font-medium text-[#64748B]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">{value}</p>{hint ? <p className="mt-1 text-xs text-[#64748B]">{hint}</p> : null}</article>;
}

export function Panel({ title, description, children, className = "" }: PropsWithChildren<{ title?: string; description?: string; className?: string }>) {
  return <section className={`rounded-lg border border-[#E5E7EB] bg-white shadow-sm ${className}`}>{title ? <div className="border-b border-[#E5E7EB] px-5 py-4"><h2 className="text-sm font-semibold">{title}</h2>{description ? <p className="mt-1 text-xs text-[#64748B]">{description}</p> : null}</div> : null}{children}</section>;
}

export function QueryState({ loading, error, empty, emptyTitle = "No records found", emptyDescription = "There is no data in your assigned scope.", children }: PropsWithChildren<{ loading: boolean; error: unknown; empty: boolean; emptyTitle?: string; emptyDescription?: string }>) {
  if (loading) return <div className="grid min-h-52 place-items-center rounded-lg border border-[#E5E7EB] bg-white"><div className="text-center text-sm text-[#64748B]"><LoaderCircle className="mx-auto mb-2 h-6 w-6 animate-spin text-[#2563EB]" />Loading data…</div></div>;
  if (error) return <div role="alert" className="flex min-h-40 items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-[#DC2626]"><AlertCircle className="h-5 w-5" /><span>{error instanceof Error ? error.message : "The request could not be completed."}</span></div>;
  if (empty) return <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-[#E5E7EB] bg-white p-8 text-center"><div><Inbox className="mx-auto h-7 w-7 text-slate-400" /><h2 className="mt-3 text-sm font-semibold">{emptyTitle}</h2><p className="mt-1 text-sm text-[#64748B]">{emptyDescription}</p></div></div>;
  return children;
}

export function SearchField({ value, onChange, placeholder = "Filter records" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="relative block min-w-56"><span className="sr-only">{placeholder}</span><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-md border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" /></label>;
}

export function Pagination({ page, limit, total = 0, onPage }: { page: number; limit: number; total?: number; onPage: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-3 text-xs text-[#64748B]"><span>{total ? `${(page - 1) * limit + 1}–${Math.min(total, page * limit)} of ${total}` : "0 records"}</span><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded border border-[#E5E7EB] p-1.5 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span>Page {page} of {pages}</span><button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded border border-[#E5E7EB] p-1.5 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div>;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", busy, danger, onCancel, onConfirm }: { open: boolean; title: string; description: string; confirmLabel?: string; busy?: boolean; danger?: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] grid place-items-center p-4"><button type="button" aria-label="Close dialog" className="absolute inset-0 bg-slate-950/50" onClick={onCancel} /><div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"><button type="button" aria-label="Close" className="absolute right-4 top-4 rounded p-1 text-[#64748B]" onClick={onCancel}><X className="h-4 w-4" /></button><h2 id="confirm-title" className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#64748B]">{description}</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button variant={danger ? "danger" : "primary"} disabled={busy} onClick={onConfirm}>{busy ? "Working…" : confirmLabel}</Button></div></div></div>;
}

export function Modal({ open, title, description, children, onClose }: PropsWithChildren<{ open: boolean; title: string; description?: string; onClose: () => void }>) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4"><button type="button" aria-label="Close dialog" className="fixed inset-0 bg-slate-950/50" onClick={onClose} /><section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative my-8 w-full max-w-lg rounded-lg bg-white shadow-xl"><div className="border-b border-[#E5E7EB] px-6 py-5"><button type="button" aria-label="Close" className="absolute right-4 top-4 rounded p-1.5 text-[#64748B] hover:bg-slate-100" onClick={onClose}><X className="h-4 w-4" /></button><h2 id="modal-title" className="text-lg font-semibold">{title}</h2>{description ? <p className="mt-1 text-sm text-[#64748B]">{description}</p> : null}</div><div className="p-6">{children}</div></section></div>;
}

export const fieldClass = "mt-1.5 w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100";

export function UnavailableModule({ title, description, endpoint }: { title: string; description: string; endpoint: string }) {
  return <Panel><div className="flex min-h-72 flex-col items-center justify-center p-8 text-center"><AlertCircle className="h-8 w-8 text-[#D97706]" /><h2 className="mt-4 text-base font-semibold">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">{description}</p><code className="mt-4 rounded bg-slate-100 px-2.5 py-1.5 text-xs text-[#64748B]">Required API: {endpoint}</code></div></Panel>;
}
