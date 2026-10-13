import { Link } from 'react-router-dom';
import { Star, Phone } from 'lucide-react';

export default function AgentCard({ agent, onBook }) {
  if (!agent) return null;
  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
      <div className="flex items-center gap-3">
        <img
          src={agent.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.username)}&background=16324F&color=fff`}
          alt={agent.username}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="min-w-0">
          <Link to={`/agents/${agent._id}`} className="block truncate font-semibold text-ink hover:underline">{agent.username}</Link>
          {agent.agencyName && <p className="truncate text-sm text-ink/60">{agent.agencyName}</p>}
          <p className="flex items-center gap-1 text-sm text-ink/70">
            <Star size={14} className="fill-brass text-brass" /> {agent.rating?.toFixed(1) || 'New'}
            {agent.reviewCount ? <span className="text-ink/50">({agent.reviewCount} reviews)</span> : null}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="btn-secondary"><Phone size={16} /> Call agent</a>
        )}
        <button onClick={onBook} className="btn-primary">Book a viewing</button>
      </div>
    </div>
  );
}
