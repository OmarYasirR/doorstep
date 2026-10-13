import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/property/PropertyCard';
import { useAuth } from '../context/AuthContext';

export default function Saved() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  // Re-fetch when favorites change so un-saving removes the card
  useEffect(() => {
    api.get('/users/favorites/me').then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, [user?.favorites?.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl">Saved homes</h1>
      {items === null ? (
        <p className="text-ink/60">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center ring-1 ring-ink/10">
          <p className="text-ink">You haven’t saved any homes yet.</p>
          <Link to="/search" className="btn-primary mt-4">Browse homes</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  );
}
