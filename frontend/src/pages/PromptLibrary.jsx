import { useMemo, useState } from 'react';
import { Filter, LibraryBig, Search, Sparkles } from 'lucide-react';
import CopyButton from '../components/CopyButton';
import { promptTemplates } from '../data/siteData';

const categories = ['All', ...Array.from(new Set(promptTemplates.map((template) => template.category)))];

const PromptLibrary = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return promptTemplates.filter((template) => {
      const matchesCategory = category === 'All' || template.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${template.title} ${template.description} ${template.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal">Prompt library</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Reusable recipes for college production.</h1>
            <p className="mt-4 text-sm font-semibold leading-6 text-ink/60">
              Store strong prompts for web builds, creative campaigns, QA passes, content systems, and repeatable AI workflows.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompt recipes"
                className="h-12 w-full rounded-lg border border-ink/10 bg-paper pl-10 pr-4 text-sm font-bold outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
              />
            </label>
            <label className="relative block">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 rounded-lg border border-ink/10 bg-paper pl-10 pr-9 text-sm font-black text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {filteredTemplates.map((template) => (
          <article key={template.id} className="rounded-lg border border-ink/10 bg-white p-6 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                  <LibraryBig className="h-5 w-5 text-citron" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal">{template.category}</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-ink">{template.title}</h2>
                </div>
              </div>
              <CopyButton text={template.body} />
            </div>
            <p className="mt-5 text-sm font-semibold leading-6 text-ink/60">{template.description}</p>
            <pre className="mt-5 max-h-52 overflow-auto rounded-lg border border-ink/10 bg-paper p-4 whitespace-pre-wrap text-xs font-semibold leading-6 text-ink/60">
              {template.body}
            </pre>
          </article>
        ))}
      </section>

      {filteredTemplates.length === 0 && (
        <section className="rounded-lg border border-dashed border-ink/20 bg-white p-12 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-teal" />
          <h2 className="mt-4 text-2xl font-black tracking-tight">No matching prompts</h2>
          <p className="mt-2 text-sm font-semibold text-ink/50">Try a different category or search term.</p>
        </section>
      )}
    </div>
  );
};

export default PromptLibrary;
