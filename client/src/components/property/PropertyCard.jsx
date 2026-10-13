import { Link } from 'react-router-dom';
import { Bed, Bath, Ruler, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, primaryImage } from '../../utils/format';

export default function PropertyCard({ property: p }) {
  const { user, toggleFavorite } = useAuth();
  const saved = user?.favorites?.some((f) => (f._id || f) === p._id);

  return (
    <article className="group overflow-hidden rounded-xl bg-white ring-1 ring-ink/10">
      <Link to={`/properties/${p._id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img src={primaryImage(p)} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {p.listingType === 'rent' && (
          <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-xs font-semibold text-ink">For rent</span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-xl text-ink">{formatPrice(p.price, p.listingType)}</p>
          {user && (
            <button onClick={() => toggleFavorite(p._id)} aria-label={saved ? 'Remove from saved' : 'Save property'}>
              <Heart size={20} className={saved ? 'fill-brass text-brass' : 'text-slate hover:text-brass'} />
            </button>
          )}
        </div>
        <Link to={`/properties/${p._id}`} className="mt-1 block truncate font-medium hover:underline">{p.title}</Link>
        <p className="truncate text-sm text-ink/60">{p.location.address}, {p.location.city}, {p.location.state}</p>
        <div className="mt-3 flex gap-4 border-t border-ink/10 pt-3 text-sm text-ink/70">
          <span className="flex items-center gap-1.5"><Bed size={15} />{p.specs.beds} bd</span>
          <span className="flex items-center gap-1.5"><Bath size={15} />{p.specs.baths} ba</span>
          <span className="flex items-center gap-1.5"><Ruler size={15} />{p.specs.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </article>
  );
}
