import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import Logo from '../components/Logo';
import heroAsset from '../assets/hero.png';
import { featurePillars, heroStats, product, workflowStages } from '../data/siteData';

const pillarIcons = [Sparkles, Workflow, ShieldCheck];
const MotionDiv = motion.div;

const Landing = () => {
  return (
    <div className="bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="[&_span]:text-white [&_span_span:last-child]:text-white/50">
            <Logo />
          </div>
          <nav className="hidden items-center gap-7 text-sm font-bold text-white/70 md:flex">
            <a href="#system" className="transition hover:text-white">
              System
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#workspace" className="transition hover:text-white">
              Workspace
            </a>
          </nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-citron px-4 py-2 text-sm font-black text-ink transition hover:bg-white"
          >
            Open Studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-scene relative isolate min-h-[88svh] overflow-hidden bg-ink text-white">
          <div className="hero-grid absolute inset-0 opacity-45" />

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none absolute bottom-8 right-0 top-24 hidden w-[860px] lg:block"
          >
            <div className="absolute right-8 top-16 w-[560px] rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                  <span className="h-2.5 w-2.5 rounded-full bg-citron" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">AI workflow canvas</span>
              </div>
              <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
                <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-citron">Prompt brief</p>
                  <p className="mt-4 text-2xl font-black leading-tight">Admissions microsite for international applicants</p>
                  <div className="mt-6 space-y-2">
                    {['Audience: parents and students', 'Tone: assured, modern, warm', 'Output: React page and content kit'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-bold text-white/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-citron" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Brief', '92% ready', 'bg-citron'],
                    ['Generate', '3 routes', 'bg-teal'],
                    ['Review', 'Mobile QA', 'bg-coral'],
                  ].map(([title, status, color]) => (
                    <div key={title} className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-black">{title}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <span className={`block h-full rounded-full ${color}`} style={{ width: title === 'Brief' ? '92%' : title === 'Generate' ? '63%' : '48%' }} />
                      </div>
                      <p className="mt-3 text-xs font-bold text-white/50">{status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <img src={heroAsset} alt="" className="absolute bottom-0 left-44 w-56 opacity-80" />
          </MotionDiv>

          <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-citron">
                <Zap className="h-4 w-4" />
                Built for one college
              </span>
              <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                {product.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/70 sm:text-xl">
                {product.tagline} Give students, faculty, and digital teams a polished command center for AI-assisted
                websites, campaign assets, and launch-ready creative work.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-citron px-6 py-3.5 text-sm font-black text-ink transition hover:bg-white"
                >
                  Launch Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#system"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/6 px-6 py-3.5 text-sm font-black text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Explore Platform
                </a>
              </div>

              <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/40">{item.label}</p>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        </section>

        <section id="system" className="border-b border-ink/10 bg-paper py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal">The product idea</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">
                A private AI studio for campus web and creative production.
              </h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-ink/60">
                No marketplace sprawl, no generic template maze. CampusForge keeps one college's prompt standards,
                brand rules, project context, and launch workflow in a single fast interface.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {featurePillars.map((pillar, index) => {
                const Icon = pillarIcons[index];
                return (
                  <article key={pillar.title} className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
                    <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xl font-black tracking-tight text-ink">{pillar.title}</p>
                    <p className="mt-4 text-sm font-semibold leading-6 text-ink/60">{pillar.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b border-ink/10 bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Production workflow</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-ink">
                From first brief to launch package.
              </h2>
              <p className="mt-5 text-base font-semibold leading-7 text-ink/60">
                The workspace turns AI from a blank chat box into a repeatable creative system with accountability,
                quality gates, and reusable prompt recipes.
              </p>
            </div>
            <div className="grid gap-3">
              {workflowStages.map((stage, index) => (
                <article key={stage.stage} className="grid gap-4 rounded-lg border border-ink/10 bg-paper p-5 sm:grid-cols-[84px_1fr]">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">0{index + 1}</span>
                    <p className="mt-2 text-sm font-black text-teal">{stage.stage}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{stage.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink/60">{stage.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workspace" className="bg-paper py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber">Workspace UX</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-ink">
                  Clear daily tools, not a random dashboard template.
                </h2>
                <p className="mt-5 text-base font-semibold leading-7 text-ink/60">
                  Creators can draft prompts, copy templates, track projects, and see what needs review without jumping
                  through role screens that do not match the new product.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    [Code2, 'Web builds'],
                    [Palette, 'Creative kits'],
                    [Compass, 'Faculty review'],
                  ].map(([Icon, label]) => (
                    <div key={label} className="rounded-lg border border-ink/10 bg-white p-4">
                      <Icon className="h-5 w-5 text-teal" />
                      <p className="mt-5 text-sm font-black text-ink">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-crisp">
                <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                    <span className="h-2.5 w-2.5 rounded-full bg-citron" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Studio preview</span>
                </div>
                <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg bg-ink p-5 text-white">
                    <Layers3 className="h-6 w-6 text-citron" />
                    <p className="mt-8 text-2xl font-black leading-tight">Prompt stack: landing page rebuild</p>
                    <p className="mt-4 text-sm font-semibold leading-6 text-white/60">
                      Audience, tone, routes, components, mobile checks, and launch notes grouped into one recipe.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {['Hero section', 'Prompt library', 'Review gates'].map((item, index) => (
                      <div key={item} className="rounded-lg border border-ink/10 bg-paper p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-ink">{item}</p>
                          <span className="text-xs font-black text-teal">{[96, 82, 71][index]}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-ink/10">
                          <span
                            className="block h-2 rounded-full bg-teal"
                            style={{ width: `${[96, 82, 71][index]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-citron">Ready workspace</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Start building inside the college studio.</h2>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-black text-ink transition hover:bg-citron"
            >
              Enter Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
