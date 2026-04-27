import { CheckCircle2, KeyRound, Palette, School, Shield, SlidersHorizontal } from 'lucide-react';
import { integrations, product } from '../data/siteData';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal">Settings</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Single-college studio controls.</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-ink/60">
          Keep identity, integrations, and review rules aligned to one campus instead of a multi-tenant marketplace.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-ink/10 bg-ink p-6 text-white shadow-crisp">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-ink">
              <School className="h-7 w-7 text-teal" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-citron">{product.college}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">{product.name}</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['Workspace owner', user?.name],
              ['Role', user?.role],
              ['Team', user?.team],
              ['Domain', `@${product.emailDomain}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
                <p className="mt-2 text-sm font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-teal" />
            <h2 className="text-2xl font-black tracking-tight">Operating rules</h2>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              ['Faculty approval', 'Required before external launch', Shield],
              ['Brand tokens', 'College voice, colors, and content rules', Palette],
              ['Provider access', 'Demo mode until production AI keys are configured', KeyRound],
            ].map(([title, detail, Icon]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-paper p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-teal">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink">{title}</p>
                    <p className="mt-1 text-xs font-bold text-ink/50">{detail}</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-teal" />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-coral" />
          <h2 className="text-2xl font-black tracking-tight">Integrations</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {integrations.map((integration) => (
            <article key={integration.name} className="rounded-lg border border-ink/10 bg-paper p-5">
              <p className="text-lg font-black text-ink">{integration.name}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-teal">{integration.status}</p>
              <p className="mt-4 text-sm font-semibold leading-6 text-ink/60">{integration.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
