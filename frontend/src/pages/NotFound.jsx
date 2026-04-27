import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
    <section className="w-full max-w-lg rounded-lg border border-ink/10 bg-white p-8 text-center shadow-crisp">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-coral">404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Page not found</h1>
      <p className="mt-4 text-sm font-semibold leading-6 text-ink/60">
        The route you opened is not part of the current CampusForge workspace.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-teal"
      >
        <ArrowLeft className="h-4 w-4" />
        Return home
      </Link>
    </section>
  </main>
);

export default NotFound;
