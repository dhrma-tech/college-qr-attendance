import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { demoUsers, product } from '../data/siteData';

const MotionDiv = motion.div;

const Login = () => {
  const [email, setEmail] = useState(demoUsers[0].email);
  const [password, setPassword] = useState('studio123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/workspace';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-paper text-ink lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden border-r border-ink/10 bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="[&_span]:text-white [&_span_span:last-child]:text-white/50">
          <Logo />
        </div>
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-citron">Private campus studio</p>
          <h1 className="mt-5 text-5xl font-black tracking-tight">
            One place for prompts, projects, and launch-ready digital work.
          </h1>
          <p className="mt-6 text-lg font-semibold leading-8 text-white/60">
            Sign in as the studio lead, a faculty mentor, or a student creator to explore the production workspace.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['Prompt OS', 'Review flow', 'Project board'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-black">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-crisp sm:p-8">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
                <ShieldCheck className="h-6 w-6 text-citron" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Enter {product.name}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink/60">
                Use the demo college accounts below. Production auth can be connected later without changing the UI.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-bold text-coral">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">College email</span>
                <span className="relative mt-2 block">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-lg border border-ink/10 bg-paper pl-10 pr-4 text-sm font-bold text-ink outline-none transition placeholder:text-ink/40 focus:border-teal focus:ring-4 focus:ring-teal/10"
                    placeholder="name@college.edu"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">Password</span>
                <span className="relative mt-2 block">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-lg border border-ink/10 bg-paper pl-10 pr-4 text-sm font-bold text-ink outline-none transition placeholder:text-ink/40 focus:border-teal focus:ring-4 focus:ring-teal/10"
                    required
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-black text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Opening workspace...' : 'Open Workspace'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-8 grid gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                    setError('');
                  }}
                  className="flex items-center justify-between rounded-lg border border-ink/10 bg-paper px-4 py-3 text-left transition hover:border-teal"
                >
                  <span>
                    <span className="block text-sm font-black text-ink">{user.name}</span>
                    <span className="block text-xs font-bold text-ink/50">{user.role}</span>
                  </span>
                  <span className="text-xs font-black text-teal">{user.email}</span>
                </button>
              ))}
            </div>

            <Link to="/" className="mt-6 inline-flex text-sm font-black text-ink/50 transition hover:text-ink">
              Back to landing
            </Link>
          </div>
        </MotionDiv>
      </section>
    </main>
  );
};

export default Login;
