import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatPrice, primaryImage, statusStyles } from '../../utils/format';

export default function ListingsTable({ listings, onStatusChange, onDelete }) {
  if (!listings.length) {
    return <p className="p-6 text-center text-sm text-ink/60">No listings yet. Use “New listing” to publish your first one.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-ink/10 text-ink/60">
          <tr>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Agent</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l._id} className="border-b border-ink/5 last:border-0">
              <td className="px-4 py-3">
                <Link to={`/properties/${l._id}`} className="flex items-center gap-3 hover:underline">
                  <img src={primaryImage(l)} alt="" className="h-10 w-14 rounded object-cover" />
                  <span className="font-medium">{l.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-ink/70">{l.agent?.username || '—'}</td>
              <td className="px-4 py-3">{formatPrice(l.price, l.listingType)}</td>
              <td className="px-4 py-3">
                <select
                  value={l.status}
                  onChange={(e) => onStatusChange(l._id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${statusStyles[l.status]}`}
                  aria-label={`Status for ${l.title}`}
                >
                  {['available', 'pending', 'sold', 'rented'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onDelete(l._id)} aria-label={`Delete ${l.title}`} className="text-slate hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
