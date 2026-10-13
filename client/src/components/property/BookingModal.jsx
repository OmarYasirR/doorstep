import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookingModal({ property, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0];

  const [type, setType] = useState('viewing_request');
  const [form, setForm] = useState({
    name: user?.username || '', email: user?.email || '', phone: user?.phone || '',
    date: '', slot: '', message: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: location } });
    setError('');
    setSubmitting(true);
    try {
      await api.post('/inquiries', {
        propertyId: property._id,
        type,
        message: form.message,
        requestedDate: type === 'viewing_request' ? form.date : undefined,
        requestedTimeSlot: type === 'viewing_request' ? form.slot : undefined,
        contactInfo: { name: form.name, email: form.email, phone: form.phone },
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send your request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-ink-900/60 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-paper p-6 sm:max-w-md sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl">{done ? 'Request sent' : 'Contact the agent'}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={44} className="mx-auto text-sage" />
            <p className="mt-3 text-ink/80">The agent has your request and will reply by email.</p>
            <button onClick={onClose} className="btn-primary mt-5">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink/5 p-1 text-sm">
              {[['viewing_request', 'Book a viewing'], ['message', 'Send a message']].map(([val, label]) => (
                <button type="button" key={val} onClick={() => setType(val)}
                  className={`rounded-md py-2 font-medium ${type === val ? 'bg-white text-ink shadow-sm' : 'text-ink/60'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div><label className="label">Name</label><input required className="input" value={form.name} onChange={set('name')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Email</label><input required type="email" className="input" value={form.email} onChange={set('email')} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
            </div>

            {type === 'viewing_request' && (
              <>
                <div><label className="label">Preferred date</label><input required type="date" min={today} className="input" value={form.date} onChange={set('date')} /></div>
                <div>
                  <label className="label">Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SLOTS.map((s) => (
                      <button type="button" key={s} onClick={() => setForm((f) => ({ ...f, slot: s }))}
                        className={`rounded-lg border py-2 text-sm ${form.slot === s ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div><label className="label">Message (optional)</label><textarea rows={3} className="input" value={form.message} onChange={set('message')} /></div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

            <button disabled={submitting || (type === 'viewing_request' && !form.slot)} className="btn-brass w-full">
              {submitting ? 'Sending…' : user ? 'Send request' : 'Log in to send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
