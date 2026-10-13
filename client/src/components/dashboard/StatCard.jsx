export default function StatCard({ label, value, icon: Icon, highlight }) {
  return (
    <div className={`rounded-xl p-5 ${highlight ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/10'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${highlight ? 'text-white/70' : 'text-ink/60'}`}>{label}</p>
        {Icon && <Icon size={18} className={highlight ? 'text-brass-light' : 'text-brass'} />}
      </div>
      <p className={`mt-2 font-display text-3xl ${highlight ? 'text-white' : 'text-ink'}`}>{value ?? '—'}</p>
    </div>
  );
}
