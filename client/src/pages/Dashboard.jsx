import { useEffect, useState, useCallback } from 'react';
import { Building2, Users, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard';
import ListingsTable from '../components/dashboard/ListingsTable';
import InquiriesTable from '../components/dashboard/InquiriesTable';
import ListingForm from '../components/dashboard/ListingForm';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function TrendBars({ trends }) {
  if (!trends?.length) return <p className="p-6 text-sm text-ink/60">Not enough data yet.</p>;
  const max = Math.max(...trends.map((t) => t.count), 1);
  return (
    <div className="flex h-40 items-end gap-3 p-4">
      {trends.map((t) => (
        <div key={`${t._id.year}-${t._id.month}`} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs text-ink/70">{t.count}</span>
          <div className="w-full rounded-t bg-ink" style={{ height: `${(t.count / max) * 100}%`, minHeight: 4 }} />
          <span className="text-xs text-ink/60">{MONTHS[t._id.month - 1]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';

  const [tab, setTab] = useState('listings');
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const requests = [
        isAdmin ? api.get('/admin/listings', { params: { limit: 50 } }).then((r) => r.data.listings)
                : api.get(`/properties/agent/${user._id}`).then((r) => r.data),
        api.get('/inquiries').then((r) => r.data),
      ];
      if (isAdmin) {
        requests.push(api.get('/admin/stats').then((r) => r.data));
        requests.push(api.get('/admin/users', { params: { limit: 50 } }).then((r) => r.data.users));
      }
      const [l, q, s, u] = await Promise.all(requests);
      setListings(l);
      setInquiries(q);
      if (s) setStats(s);
      if (u) setUsers(u);
    } catch {
      setError('Could not load dashboard data. Refresh to try again.');
    }
  }, [isAdmin, user._id]);

  useEffect(() => { load(); }, [load]);

  const changeListingStatus = async (id, status) => {
    await api.put(`/properties/${id}`, { status });
    setListings((ls) => ls.map((l) => (l._id === id ? { ...l, status } : l)));
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    await api.delete(`/properties/${id}`);
    setListings((ls) => ls.filter((l) => l._id !== id));
  };

  const changeInquiryStatus = async (id, status) => {
    await api.put(`/inquiries/${id}/status`, { status });
    setInquiries((qs) => qs.map((q) => (q._id === id ? { ...q, status } : q)));
  };

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    setUsers((us) => us.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  const pendingCount = inquiries.filter((q) => q.status === 'pending').length;
  const tabs = [['listings', 'Listings'], ['inquiries', `Requests${pendingCount ? ` (${pendingCount})` : ''}`], ...(isAdmin ? [['users', 'Users']] : [])];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">{isAdmin ? 'Admin dashboard' : 'Agent dashboard'}</h1>
        <button onClick={() => setShowForm(true)} className="btn-brass"><Plus size={16} /> New listing</button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard highlight label="Total listings" icon={Building2} value={isAdmin ? stats?.totalListings : listings.length} />
        <StatCard label={isAdmin ? 'New this week' : 'Pending requests'} icon={TrendingUp} value={isAdmin ? stats?.newListings : pendingCount} />
        <StatCard label={isAdmin ? 'Active users' : 'Total requests'} icon={Users} value={isAdmin ? stats?.activeUsers : inquiries.length} />
        <StatCard label={isAdmin ? 'Sold / rented' : 'Sold / rented'} icon={MessageSquare} value={isAdmin ? stats?.soldCount : listings.filter((l) => ['sold', 'rented'].includes(l.status)).length} />
      </div>

      {isAdmin && stats && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-xl bg-white ring-1 ring-ink/10 lg:col-span-2">
            <h2 className="px-4 pt-4 text-lg">Listing trends (6 months)</h2>
            <TrendBars trends={stats.trends} />
          </section>
          <section className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
            <h2 className="text-lg">Listings by city</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {stats.regionalActivity.map((r) => (
                <li key={r._id} className="flex items-center justify-between border-b border-ink/5 pb-2 last:border-0">
                  <span>{r._id}</span><span className="font-medium">{r.count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <div className="mt-8 flex gap-6 border-b border-ink/10">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium ${tab === key ? 'border-brass text-ink' : 'border-transparent text-ink/60 hover:text-ink'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-white ring-1 ring-ink/10">
        {tab === 'listings' && <ListingsTable listings={listings} onStatusChange={changeListingStatus} onDelete={deleteListing} />}
        {tab === 'inquiries' && <InquiriesTable inquiries={inquiries} onStatusChange={changeInquiryStatus} />}
        {tab === 'users' && isAdmin && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-ink/10 text-ink/60">
                <tr><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Role</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3 text-ink/70">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} disabled={u._id === user._id} onChange={(e) => changeRole(u._id, e.target.value)} className="input w-auto py-1.5" aria-label={`Role for ${u.username}`}>
                        {['user', 'agent', 'admin'].map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ListingForm
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
