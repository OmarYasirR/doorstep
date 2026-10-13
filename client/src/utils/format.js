export const formatPrice = (price, listingType) => {
  const n = `$${Number(price).toLocaleString()}`;
  return listingType === 'rent' ? `${n}/mo` : n;
};

export const shortPrice = (price) =>
  price >= 1_000_000 ? `$${(price / 1_000_000).toFixed(1)}M` : price >= 1000 ? `$${Math.round(price / 1000)}k` : `$${price}`;

export const primaryImage = (p) =>
  p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url ||
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=60';

export const statusStyles = {
  available: 'bg-sage/15 text-sage',
  pending: 'bg-brass/15 text-brass-dark',
  sold: 'bg-ink/10 text-ink',
  rented: 'bg-ink/10 text-ink',
  confirmed: 'bg-sage/15 text-sage',
  declined: 'bg-red-100 text-red-700',
  completed: 'bg-ink/10 text-ink',
  cancelled: 'bg-slate/20 text-slate',
};
