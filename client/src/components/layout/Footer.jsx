import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo size={34} variant="light" />
          <p className="mt-1 max-w-xs text-sm text-white/60">Browse homes, tour them online, and book a viewing with a local agent.</p>
        </div>
        <nav className="flex gap-6 text-sm text-white/80">
          <Link to="/search?listingType=sale" className="hover:text-white">Buy</Link>
          <Link to="/search?listingType=rent" className="hover:text-white">Rent</Link>
          <Link to="/register" className="hover:text-white">List with us</Link>
        </nav>
      </div>
    </footer>
  );
}
