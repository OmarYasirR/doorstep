import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-[1100] border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Doorstep home"><Logo size={34} /></Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/search?listingType=sale" className={linkClass}>Buy</NavLink>
          <NavLink to="/search?listingType=rent" className={linkClass}>Rent</NavLink>
          {user && <NavLink to="/saved" className={linkClass}>Saved</NavLink>}
          {user && ['agent', 'admin'].includes(user.role) && (
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink/70">{user.username}</span>
              <button onClick={handleLogout} className="btn-secondary">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-ink/10 bg-paper px-4 py-4 md:hidden">
          <Link to="/search?listingType=sale" onClick={() => setOpen(false)}>Buy</Link>
          <Link to="/search?listingType=rent" onClick={() => setOpen(false)}>Rent</Link>
          {user && <Link to="/saved" onClick={() => setOpen(false)} className="flex items-center gap-2"><Heart size={16} /> Saved</Link>}
          {user && ['agent', 'admin'].includes(user.role) && (
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary">Log out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
