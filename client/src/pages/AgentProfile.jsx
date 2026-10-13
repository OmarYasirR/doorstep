import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Phone } from 'lucide-react';
import api from '../api/axios';
import PropertyCard from '../components/property/PropertyCard';

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get(`/users/${id}`), api.get(`/properties/agent/${id}`)])
      .then(([a, l]) => { setAgent(a.data); setListings(l.data); })
      .catch(() => setError('We could not find this agent.'));
  }, [id]);

  if (error) return <p className="p-12 text-center text-ink/70">{error}</p>;
  if (!agent) return <p className="p-12 text-center text-ink/60">Loading…</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center ring-1 ring-ink/10 sm:flex-row sm:text-left">
        <img
          src={agent.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.username)}&background=16324F&color=fff&size=200`}
          alt={agent.username}
          className="h-28 w-28 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl">{agent.username}</h1>
          {agent.agencyName && <p className="text-ink/60">{agent.agencyName}</p>}
          <p className="mt-1 flex items-center justify-center gap-1 sm:justify-start">
            <Star size={16} className="fill-brass text-brass" />
            <span className="font-medium">{agent.rating?.toFixed(1) || 'New'}</span>
            {agent.reviewCount > 0 && <span className="text-sm text-ink/60">· {agent.reviewCount} reviews</span>}
          </p>
          {agent.bio && <p className="mt-3 max-w-xl text-ink/80">{agent.bio}</p>}
        </div>
        {agent.phone && <a href={`tel:${agent.phone}`} className="btn-primary"><Phone size={16} /> Call agent</a>}
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl">Active listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="text-ink/60">This agent has no active listings right now.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
