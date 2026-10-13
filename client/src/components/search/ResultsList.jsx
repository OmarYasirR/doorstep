import { Link } from 'react-router-dom';
import { Bed, Bath, Ruler, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, primaryImage } from '../../utils/format';

export default function ResultsList({ properties, loading, error, hoveredId, selectedId, onHover, onSelect }) {
  const { user, toggleFavorite } = useAuth();

  if (error) return <div className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>;

  if (loading && properties.length === 0) {
    return (
      <div className="grid gap-3 p-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-ink/5" />)}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="p-8 text-center text-ink/60">
        <p className="font-medium text-ink">No homes match these filters.</p>
        <p className="mt-1 text-sm">Widen the price range or remove a filter to see more.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 p-4">
      {properties.map((p) => {
        const active = hoveredId === p._id || selectedId === p._id;
        const saved = user?.favorites?.some((f) => (f._id || f) === p._id);
        return (
          <li
            key={p._id}
            id={`card-${p._id}`}
            onMouseEnter={() => onHover(p._id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(p._id)}
            className={`flex gap-3 rounded-xl bg-white p-3 ring-1 transition ${active ? 'ring-2 ring-brass' : 'ring-ink/10'}`}
          >
            <img src={primaryImage(p)} alt={p.title} loading="lazy" className="h-24 w-32 flex-shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-lg text-ink">{formatPrice(p.price, p.listingType)}</p>
                {user && (
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p._id); }} aria-label={saved ? 'Remove from saved' : 'Save property'}>
                    <Heart size={18} className={saved ? 'fill-brass text-brass' : 'text-slate hover:text-brass'} />
                  </button>
                )}
              </div>
              <Link to={`/properties/${p._id}`} className="block truncate text-sm font-medium hover:underline">{p.title}</Link>
              <p className="truncate text-xs text-ink/60">{p.location.address}, {p.location.city}</p>
              <div className="mt-2 flex gap-3 text-xs text-ink/70">
                <span className="flex items-center gap-1"><Bed size={13} />{p.specs.beds}</span>
                <span className="flex items-center gap-1"><Bath size={13} />{p.specs.baths}</span>
                <span className="flex items-center gap-1"><Ruler size={13} />{p.specs.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
