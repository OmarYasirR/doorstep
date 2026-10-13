import { useState } from 'react';
import { Map as MapIcon, List } from 'lucide-react';
import FilterBar from '../components/search/FilterBar';
import ResultsList from '../components/search/ResultsList';
import MapView from '../components/search/MapView';
import { usePropertySearch } from '../hooks/usePropertySearch';

export default function SearchPage() {
  const { properties, total, loading, error, updateFilter, searchParams, setSearchParams } = usePropertySearch();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  const searchArea = ({ center, radiusMeters }) => {
    const next = new URLSearchParams(searchParams);
    next.set('lat', center.lat.toFixed(6));
    next.set('lng', center.lng.toFixed(6));
    next.set('radius', Math.round(radiusMeters));
    next.delete('city'); // area search replaces the city filter
    setSearchParams(next);
  };

  const clearArea = () => {
    const next = new URLSearchParams(searchParams);
    ['lat', 'lng', 'radius'].forEach((k) => next.delete(k));
    setSearchParams(next);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <FilterBar filters={searchParams} onChange={updateFilter} />

      <div className="relative flex flex-1 overflow-hidden">
        <section className={`${mobileView === 'list' ? 'block' : 'hidden'} w-full overflow-y-auto border-r border-ink/10 md:block md:w-[45%] lg:w-[38%]`}>
          <div className="flex items-center justify-between px-4 pt-4 text-sm text-ink/60">
            <span aria-live="polite">{loading ? 'Searching…' : `${total} ${total === 1 ? 'home' : 'homes'} found`}</span>
            {searchParams.get('lat') && (
              <button onClick={clearArea} className="font-medium text-ink underline-offset-4 hover:underline">Clear map area</button>
            )}
          </div>
          <ResultsList
            properties={properties}
            loading={loading}
            error={error}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={setHoveredId}
            onSelect={setSelectedId}
          />
        </section>

        <section className={`${mobileView === 'map' ? 'block' : 'hidden'} h-full flex-1 md:block`}>
          <MapView
            properties={properties}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onMarkerHover={setHoveredId}
            onMarkerClick={setSelectedId}
            onSearchArea={searchArea}
          />
        </section>

        <button
          onClick={() => setMobileView((v) => (v === 'list' ? 'map' : 'list'))}
          className="btn-primary absolute bottom-5 left-1/2 z-[1000] -translate-x-1/2 shadow-lg md:hidden"
        >
          {mobileView === 'list' ? <><MapIcon size={16} /> Map</> : <><List size={16} /> List</>}
        </button>
      </div>
    </div>
  );
}
