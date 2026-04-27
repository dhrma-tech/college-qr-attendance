const toneMap = {
  teal: 'border-teal/25 bg-teal/5 text-teal',
  citron: 'border-citron/40 bg-citron/10 text-ink',
  coral: 'border-coral/25 bg-coral/5 text-coral',
  amber: 'border-amber/30 bg-amber/10 text-ink',
};

const MetricCard = ({ label, value, change, tone = 'teal' }) => (
  <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-panel">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">{label}</p>
    <div className="mt-5 flex items-end justify-between gap-4">
      <p className="text-3xl font-black tracking-tight text-ink">{value}</p>
      <span className={`rounded-md border px-2.5 py-1 text-[11px] font-black ${toneMap[tone] || toneMap.teal}`}>
        {change}
      </span>
    </div>
  </article>
);

export default MetricCard;
