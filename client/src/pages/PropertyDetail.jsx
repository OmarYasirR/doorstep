import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Ruler, Calendar, Check, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';
import ImageGallery from '../components/property/ImageGallery';
import VirtualTour from '../components/property/VirtualTour';
import AgentCard from '../components/property/AgentCard';
import BookingModal from '../components/property/BookingModal';
import { formatPrice, statusStyles } from '../utils/format';

const pin = L.divIcon({
  className: 'price-pin',
  html: '<div style="transform:translate(-50%,-100%);width:18px;height:18px;border-radius:50%;background:#B08D57;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>',
  iconSize: [0, 0],
});

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    setProperty(null);
    api.get(`/properties/${id}`)
      .then(({ data }) => setProperty(data))
      .catch((err) => setError(err.response?.status === 404 ? 'This listing is no longer available.' : 'Could not load this listing.'));
    window.scrollTo(0, 0);
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl p-12 text-center">
        <p className="text-ink">{error}</p>
        <Link to="/search" className="btn-primary mt-5">Back to search</Link>
      </div>
    );
  }
  if (!property) return <div className="p-12 text-center text-ink/60">Loading…</div>;

  const [lng, lat] = property.location.coordinates.coordinates;
  const { specs: s } = property;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <ImageGallery images={property.images} title={property.title} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl">{property.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-ink/60">
                <MapPin size={16} /> {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl text-ink">{formatPrice(property.price, property.listingType)}</p>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[property.status]}`}>{property.status}</span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-ink/10 py-5 sm:grid-cols-4">
            <div className="flex items-center gap-2"><Bed size={18} className="text-brass" /><div><dt className="text-xs text-ink/60">Beds</dt><dd className="font-medium">{s.beds}</dd></div></div>
            <div className="flex items-center gap-2"><Bath size={18} className="text-brass" /><div><dt className="text-xs text-ink/60">Baths</dt><dd className="font-medium">{s.baths}</dd></div></div>
            <div className="flex items-center gap-2"><Ruler size={18} className="text-brass" /><div><dt className="text-xs text-ink/60">Area</dt><dd className="font-medium">{s.sqft.toLocaleString()} sqft</dd></div></div>
            {s.yearBuilt && <div className="flex items-center gap-2"><Calendar size={18} className="text-brass" /><div><dt className="text-xs text-ink/60">Built</dt><dd className="font-medium">{s.yearBuilt}</dd></div></div>}
          </dl>

          <section className="mt-6">
            <h2 className="text-xl">Overview</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/80">{property.description}</p>
          </section>

          {property.amenities?.length > 0 && (
            <section className="mt-6">
              <h2 className="text-xl">Amenities</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm capitalize"><Check size={16} className="text-sage" />{a.replace(/-/g, ' ')}</li>
                ))}
              </ul>
            </section>
          )}

          {property.virtualTourUrl && <div className="mt-6"><VirtualTour url={property.virtualTourUrl} /></div>}

          <section className="mt-8">
            <h2 className="mb-3 text-xl">Location</h2>
            <div className="h-72 overflow-hidden rounded-xl ring-1 ring-ink/10">
              <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={pin} />
              </MapContainer>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AgentCard agent={property.agent} onBook={() => setBooking(true)} />
        </aside>
      </div>

      {booking && <BookingModal property={property} onClose={() => setBooking(false)} />}
    </div>
  );
}
