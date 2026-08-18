import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title" className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">404</p>
      <h1 id="not-found-title" className="mt-3 text-3xl font-semibold">Route not found</h1>
      <p className="mt-3 text-slate-400">This application route is not available.</p>
      <Link to="/" className="mt-8 inline-block text-volt-400 hover:text-volt-300">Return to journey planner</Link>
    </section>
  );
}
