import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'agent' ? '/dashboard' : '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl">Create your account</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-ink/10">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink/5 p-1 text-sm">
          {[['user', 'I’m looking for a home'], ['agent', 'I’m an agent']].map(([val, label]) => (
            <button type="button" key={val} onClick={() => setForm({ ...form, role: val })}
              className={`rounded-md py-2 font-medium ${form.role === val ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}>
              {label}
            </button>
          ))}
        </div>
        <div><label className="label">Username</label><input required className="input" value={form.username} onChange={set('username')} /></div>
        <div><label className="label">Email</label><input required type="email" className="input" value={form.email} onChange={set('email')} /></div>
        <div><label className="label">Password</label><input required minLength={6} type="password" className="input" value={form.password} onChange={set('password')} /><p className="mt-1 text-xs text-ink/60">At least 6 characters.</p></div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating account…' : 'Sign up'}</button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/70">Already registered? <Link to="/login" className="font-medium text-ink underline">Log in</Link></p>
    </div>
  );
}
