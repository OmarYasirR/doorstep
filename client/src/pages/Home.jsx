import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, View, CalendarCheck, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PropertyCard from '../components/property/PropertyCard';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { icon: SlidersHorizontal, title: 'Search your way', text: 'Filter by price, bedrooms, type and amenities, then see every match on the map.' },
  { icon: View, title: 'Tour from your sofa', text: 'Walk through listings in 3D and flip through full photo galleries before you leave home.' },
  { icon: CalendarCheck, title: 'Book a viewing', text: 'Pick a date and time and the agent gets your request straight away.' },
];

const QUICK = [
  { label: 'Homes for sale', to: '/search?listingType=sale' },
  { label: 'Rentals', to: '/search?listingType=rent' },
  { label: '3+ bedrooms', to: '/search?beds=3' },
  { label: 'With a pool', to: '/search?amenities=pool' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties', { params: { featured: 'true', limit: 6 } })
      .then(({ data }) => (data.properties.length
        ? setFeatured(data.properties)
        : api.get('/properties', { params: { limit: 6 } }).then(({ data: d }) => setFeatured(d.properties))))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/search${query.trim() ? `?city=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:py-24">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-sm font-medium uppercase tracking-widest text-brass-light">Homes · Rentals · Local agents</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Your next home starts at the <span className="text-brass-light">doorstep.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/70">
              Search the map, tour homes in 3D, and book a viewing with a local agent, all in one place.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row" role="search">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a city, e.g. Austin"
                  className="input h-12 pl-10 text-charcoal"
                  aria-label="Search by city"
                />
              </div>
              <button className="btn-brass h-12 px-7">Search</button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <Link key={q.label} to={q.to} className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/85 transition hover:border-brass-light hover:text-white">
                  {q.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link to="/search" className="group relative block aspect-[5/4] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80"
                alt="Modern home with warm lights at dusk"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-lg">
                <MapPin size={16} className="text-brass" /> Explore homes on the map
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl">Featured homes</h2>
            <p className="mt-1 text-ink/60">Hand-picked listings from agents near you.</p>
          </div>
          <Link to="/search" className="inline-flex items-center gap-1 text-sm font-medium text-ink underline-offset-4 hover:underline">
            See all <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-ink/5" />)}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-ink/60 ring-1 ring-ink/10">
            No listings yet. Run <code className="rounded bg-ink/5 px-1.5 py-0.5">npm run seed</code> in the project root to add demo homes.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="max-w-lg text-3xl">From first search to front door in three steps</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative border-t-2 border-brass pt-5">
                <span className="absolute -top-3 left-0 bg-white pr-3 font-display text-sm text-brass-dark">0{i + 1}</span>
                <Icon size={24} className="text-ink" />
                <h3 className="mt-3 text-xl">{title}</h3>
                <p className="mt-2 text-ink/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Agent CTA */}
      {(!user || user.role === 'user') && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink px-8 py-10 text-white md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl text-white">Selling or renting out a home?</h2>
              <p className="mt-2 max-w-lg text-white/70">Create an agent account to publish listings, add 3D tours and manage viewing requests from one dashboard.</p>
            </div>
            <Link to="/register" className="btn-brass whitespace-nowrap px-7 py-3">List with Doorstep</Link>
          </div>
        </section>
      )}
    </>
  );
}
