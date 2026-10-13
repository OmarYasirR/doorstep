import { statusStyles } from '../../utils/format';

export default function InquiriesTable({ inquiries, onStatusChange }) {
  if (!inquiries.length) {
    return <p className="p-6 text-center text-sm text-ink/60">No requests yet. New viewing requests and messages will appear here.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-ink/10 text-ink/60">
          <tr>
            <th className="px-4 py-3 font-medium">From</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">When</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((q) => (
            <tr key={q._id} className="border-b border-ink/5 align-top last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium">{q.contactInfo?.name}</p>
                <p className="text-xs text-ink/60">{q.contactInfo?.email}</p>
                {q.message && <p className="mt-1 max-w-xs text-xs text-ink/70">{q.message}</p>}
              </td>
              <td className="px-4 py-3 text-ink/80">{q.property?.title}</td>
              <td className="px-4 py-3">{q.type === 'viewing_request' ? 'Viewing' : 'Message'}</td>
              <td className="px-4 py-3">
                {q.requestedDate ? `${new Date(q.requestedDate).toLocaleDateString()} ${q.requestedTimeSlot || ''}` : '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  value={q.status}
                  onChange={(e) => onStatusChange(q._id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${statusStyles[q.status]}`}
                  aria-label={`Status for request from ${q.contactInfo?.name}`}
                >
                  {['pending', 'confirmed', 'declined', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
