import { Search } from 'lucide-react';

const PRICE_STEPS = [0, 100000, 200000, 300000, 400000, 600000, 800000, 1000000, 2000000];
const TYPES = ['apartment', 'house', 'condo', 'villa', 'land', 'commercial'];

export default function FilterBar({ filters, onChange }) {
  const get = (k) => filters.get(k) || '';

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 bg-white px-4 py-3">
      <div className="relative min-w-[200px] flex-1 md:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
        <input
          className="input pl-9"
          placeholder="City"
          defaultValue={get('city')}
          onChange={(e) => onChange('city', e.target.value.trim())}
          aria-label="City"
        />
      </div>

      <select className="input w-auto" value={get('listingType')} onChange={(e) => onChange('listingType', e.target.value)} aria-label="Buy or rent">
        <option value="">Buy or rent</option>
        <option value="sale">For sale</option>
        <option value="rent">For rent</option>
      </select>

      <select className="input w-auto" value={get('minPrice')} onChange={(e) => onChange('minPrice', e.target.value)} aria-label="Minimum price">
        <option value="">Min price</option>
        {PRICE_STEPS.slice(1).map((p) => <option key={p} value={p}>${p.toLocaleString()}</option>)}
      </select>

      <select className="input w-auto" value={get('maxPrice')} onChange={(e) => onChange('maxPrice', e.target.value)} aria-label="Maximum price">
        <option value="">Max price</option>
        {PRICE_STEPS.slice(1).map((p) => <option key={p} value={p}>${p.toLocaleString()}</option>)}
      </select>

      <select className="input w-auto" value={get('beds')} onChange={(e) => onChange('beds', e.target.value)} aria-label="Bedrooms">
        <option value="">Beds</option>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
      </select>

      <select className="input w-auto" value={get('baths')} onChange={(e) => onChange('baths', e.target.value)} aria-label="Bathrooms">
        <option value="">Baths</option>
        {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
      </select>

      <select className="input w-auto" value={get('propertyType')} onChange={(e) => onChange('propertyType', e.target.value)} aria-label="Property type">
        <option value="">Any type</option>
        {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
      </select>

      <input
        className="input w-auto min-w-[160px]"
        placeholder="Amenities (pool,garage)"
        defaultValue={get('amenities')}
        onChange={(e) => onChange('amenities', e.target.value.replace(/\s/g, ''))}
        aria-label="Amenities, comma separated"
      />
    </div>
  );
}
