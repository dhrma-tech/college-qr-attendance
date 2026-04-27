import { ArrowRight, CalendarClock, FolderKanban, MoreHorizontal, Plus } from 'lucide-react';
import { activeProjects, projectColumns } from '../data/siteData';

const priorityClass = {
  High: 'bg-coral/10 text-coral border-coral/25',
  Medium: 'bg-amber/10 text-ink border-amber/30',
};

const Projects = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">Projects</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Campus production pipeline.</h1>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-ink/60">
              Track websites, campaign kits, chatbot flows, content systems, and launch assets across the college studio.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-teal"
          >
            <Plus className="h-4 w-4" />
            New project
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {activeProjects.map((project) => (
          <article key={project.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal">{project.type}</p>
                <h2 className="mt-3 text-xl font-black tracking-tight">{project.title}</h2>
              </div>
              <span className={`rounded-md border px-2 py-1 text-[10px] font-black ${priorityClass[project.priority]}`}>
                {project.priority}
              </span>
            </div>
            <div className="mt-6 h-2 rounded-full bg-ink/10">
              <span className="block h-2 rounded-full bg-teal" style={{ width: `${project.progress}%` }} />
            </div>
            <div className="mt-5 flex items-center justify-between text-xs font-black text-ink/50">
              <span>{project.owner}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {project.due}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {projectColumns.map((column) => (
          <div key={column.title} className="rounded-lg border border-ink/10 bg-white p-4 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-teal" />
                <h2 className="text-sm font-black uppercase tracking-[0.14em] text-ink">{column.title}</h2>
              </div>
              <span className="rounded-md bg-paper px-2 py-1 text-xs font-black text-ink/50">{column.items.length}</span>
            </div>
            <div className="space-y-3">
              {column.items.map((item) => (
                <article key={item.title} className="rounded-lg border border-ink/10 bg-paper p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-black leading-5 text-ink">{item.title}</h3>
                    <button type="button" className="rounded-md p-1 text-ink/40 transition hover:bg-white hover:text-ink" aria-label="Project actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-xs font-bold text-ink/50">{item.owner}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink/60">{item.meta}</span>
                    <ArrowRight className="h-4 w-4 text-teal" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Projects;
