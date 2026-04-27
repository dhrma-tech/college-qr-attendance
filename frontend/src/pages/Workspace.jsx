import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileText,
  Layers3,
  PanelTop,
  Sparkles,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CopyButton from '../components/CopyButton';
import MetricCard from '../components/MetricCard';
import {
  activeProjects,
  dashboardMetrics,
  performanceData,
  product,
  reviewQueue,
  workflowStages,
} from '../data/siteData';
import { useAuth } from '../context/AuthContext';

const promptTypes = ['Landing page', 'Dashboard UX', 'Campaign kit', 'QA review'];
const MotionDiv = motion.div;

const buildPrompt = ({ brief, type, audience, tone }) => {
  const goal = brief.trim() || 'Create a polished campus digital experience';
  return `Act as a senior product designer, prompt engineer, and frontend lead for ${product.college}.

Project type: ${type}
Audience: ${audience}
Tone: ${tone}
Goal: ${goal}

Return a production-ready plan with:
1. Clear positioning and user outcome
2. Route or section architecture
3. Component list and interaction states
4. Responsive layout notes for mobile and desktop
5. Visual direction with typography, spacing, and color guidance
6. Accessibility, performance, and deployment checks
7. A final handoff checklist for the college team`;
};

const Workspace = () => {
  const { user } = useAuth();
  const [brief, setBrief] = useState('Build a premium website for the college innovation cell.');
  const [type, setType] = useState(promptTypes[0]);
  const [audience, setAudience] = useState('Students, parents, faculty, and recruiters');
  const [tone, setTone] = useState('Premium, clear, fast, credible');

  const generatedPrompt = useMemo(
    () => buildPrompt({ brief, type, audience, tone }),
    [audience, brief, tone, type],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-lg border border-ink/10 bg-ink p-6 text-white shadow-crisp sm:p-8"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-citron">Workspace</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                Good morning, {user?.name?.split(' ')[0]}. Build the next college launch.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/60">
                Draft prompts, track creative production, and move campus web projects through review without losing context.
              </p>
            </div>
            <div className="grid min-w-48 grid-cols-2 gap-3 md:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black">12</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/50">Ready briefs</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black text-citron">4</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/50">Launch blockers</p>
              </div>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal">Prompt health</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Output trend</h2>
            </div>
            <div className="rounded-md bg-citron/20 px-3 py-2 text-xs font-black text-ink">6 week view</div>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ left: -18, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="promptFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#087f7a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#087f7a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e8ece5" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5f625d', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5f625d', fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{
                    border: '1px solid rgba(21,21,21,0.1)',
                    borderRadius: 8,
                    boxShadow: '0 18px 60px rgba(21,21,21,0.08)',
                    fontWeight: 700,
                  }}
                />
                <Area type="monotone" dataKey="prompts" stroke="#087f7a" strokeWidth={3} fill="url(#promptFill)" />
                <Area type="monotone" dataKey="shipped" stroke="#e35d4f" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MotionDiv>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Prompt builder</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Create a clean production prompt</h2>
            </div>
            <CopyButton text={generatedPrompt} label="Copy prompt" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">Project brief</span>
                <textarea
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-lg border border-ink/10 bg-paper p-4 text-sm font-semibold leading-6 text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">Audience</span>
                  <input
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-paper px-3 text-sm font-bold outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">Tone</span>
                  <input
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-ink/10 bg-paper px-3 text-sm font-bold outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
                  />
                </label>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-ink/50">Prompt type</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {promptTypes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`rounded-md border px-3 py-2 text-xs font-black transition ${
                        type === item ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-paper text-ink/60 hover:border-teal hover:text-ink'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-ink/10 bg-ink p-5 text-white">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-citron">Generated prompt</span>
                <Sparkles className="h-4 w-4 text-citron" />
              </div>
              <pre className="min-h-[360px] whitespace-pre-wrap text-sm font-semibold leading-7 text-white/70">
                {generatedPrompt}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal">Active projects</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">Production board</h2>
              </div>
              <Layers3 className="h-6 w-6 text-teal" />
            </div>

            <div className="mt-5 space-y-3">
              {activeProjects.map((project) => (
                <article key={project.id} className="rounded-lg border border-ink/10 bg-paper p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-ink">{project.title}</p>
                      <p className="mt-1 text-xs font-bold text-ink/50">{project.owner}</p>
                    </div>
                    <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black text-teal">{project.status}</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-ink/10">
                    <span className="block h-2 rounded-full bg-teal" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-black text-ink/50">
                    <span>{project.type}</span>
                    <span>{project.due}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-coral" />
              <h2 className="text-xl font-black tracking-tight">Review queue</h2>
            </div>
            <div className="mt-5 space-y-3">
              {reviewQueue.map((item) => (
                <div key={item.item} className="flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-paper p-4">
                  <div>
                    <p className="text-sm font-black">{item.item}</p>
                    <p className="mt-1 text-xs font-bold text-ink/50">{item.status}</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-teal" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber">Workflow map</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Standard launch cycle</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-paper px-4 py-2.5 text-sm font-black transition hover:border-ink hover:bg-ink hover:text-white">
            Save as template
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {workflowStages.map((stage, index) => (
            <article key={stage.stage} className="rounded-lg border border-ink/10 bg-paper p-4">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-black text-ink/40">0{index + 1}</span>
                {[FileText, Sparkles, Code2, ClipboardCheck, PanelTop][index] &&
                  (() => {
                    const Icon = [FileText, Sparkles, Code2, ClipboardCheck, PanelTop][index];
                    return <Icon className="h-4 w-4 text-teal" />;
                  })()}
              </div>
              <p className="text-sm font-black text-ink">{stage.stage}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-ink/50">{stage.title}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Workspace;
