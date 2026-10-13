import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { shortPrice, formatPrice, primaryImage } from '../../utils/format';

const pinIcon = (price, active) =>
  L.divIcon({
    className: 'price-pin',
    html: `<div style="transform:translate(-50%,-100%);display:inline-block;padding:4px 10px;border-radius:999px;font:600 12px Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25);${
      active ? 'background:#B08D57;color:#fff;' : 'background:#16324F;color:#fff;'
    }">${shortPrice(price)}</div>`,
    iconSize: [0, 0],
  });

// Fits the map to results when the result set changes (not on user pan)
function FitToResults({ properties }) {
  const map = useMap();
  useEffect(() => {
    if (!properties.length) return;
    const pts = properties.map((p) => [p.location.coordinates.coordinates[1], p.location.coordinates.coordinates[0]]);
    map.fitBounds(pts, { padding: [50, 50], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.map((p) => p._id).join(',')]);
  return null;
}

function SearchThisArea({ onSearch }) {
  const [moved, setMoved] = useState(false);
  const map = useMapEvents({ dragend: () => setMoved(true), zoomend: () => setMoved((m) => m) });
  if (!moved) return null;

  return (
    <button
      className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-lg hover:bg-paper"
      onClick={() => {
        const center = map.getCenter();
        const radiusMeters = center.distanceTo(map.getBounds().getNorthEast());
        onSearch({ center, radiusMeters });
        setMoved(false);
      }}
    >
      Search this area
    </button>
  );
}

export default function MapView({ properties, hoveredId, selectedId, onMarkerHover, onMarkerClick, onSearchArea }) {
  const selected = properties.find((p) => p._id === selectedId);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[30.2672, -97.7431]} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToResults properties={properties} />
        <SearchThisArea onSearch={onSearchArea} />

        {properties.map((p) => (
          <Marker
            key={`${p._id}-${hoveredId === p._id || selectedId === p._id}`}
            position={[p.location.coordinates.coordinates[1], p.location.coordinates.coordinates[0]]}
            icon={pinIcon(p.price, hoveredId === p._id || selectedId === p._id)}
            zIndexOffset={hoveredId === p._id || selectedId === p._id ? 1000 : 0}
            eventHandlers={{
              mouseover: () => onMarkerHover(p._id),
              mouseout: () => onMarkerHover(null),
              click: () => {
                onMarkerClick(p._id);
                document.getElementById(`card-${p._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              },
            }}
          />
        ))}
      </MapContainer>

      {selected && (
        <Link
          to={`/properties/${selected._id}`}
          className="absolute bottom-4 left-4 right-4 z-[1000] flex max-w-sm gap-3 rounded-xl bg-white p-3 shadow-xl ring-1 ring-ink/10"
        >
          <img src={primaryImage(selected)} alt="" className="h-20 w-24 rounded-lg object-cover" />
          <div className="min-w-0">
            <p className="font-display text-lg text-ink">{formatPrice(selected.price, selected.listingType)}</p>
            <p className="truncate text-sm font-medium">{selected.title}</p>
            <p className="text-xs text-ink/60">{selected.specs.beds} bd · {selected.specs.baths} ba</p>
          </div>
        </Link>
      )}
    </div>
  );
}
