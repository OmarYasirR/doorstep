import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axios';

const empty = {
  title: '', description: '', price: '', listingType: 'sale', propertyType: 'house',
  address: '', city: '', state: '', zip: '', lat: '', lng: '',
  beds: '', baths: '', sqft: '', amenities: '', virtualTourUrl: '',
};

export default function ListingForm({ onClose, onCreated }) {
  const [f, setF] = useState(empty);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', f.title);
      fd.append('description', f.description);
      fd.append('price', f.price);
      fd.append('listingType', f.listingType);
      fd.append('propertyType', f.propertyType);
      fd.append('virtualTourUrl', f.virtualTourUrl);
      fd.append('location', JSON.stringify({
        address: f.address, city: f.city, state: f.state, zip: f.zip,
        coordinates: { type: 'Point', coordinates: [Number(f.lng), Number(f.lat)] },
      }));
      fd.append('specs', JSON.stringify({ beds: Number(f.beds), baths: Number(f.baths), sqft: Number(f.sqft) }));
      fd.append('amenities', JSON.stringify(f.amenities.split(',').map((a) => a.trim()).filter(Boolean)));
      Array.from(files).forEach((file) => fd.append('images', file));

      const { data } = await api.post('/properties', fd);
      onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not publish this listing. Check the required fields.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, props = {}) => (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={f[key]} onChange={set(key)} {...props} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink-900/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-paper p-6">
        <div className="flex items-start justify-between">
          <h2 className="text-xl">New listing</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        {field('Title', 'title', { required: true })}
        <div>
          <label className="label">Description</label>
          <textarea required rows={3} className="input" value={f.description} onChange={set('description')} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {field('Price (USD)', 'price', { required: true, type: 'number', min: 0 })}
          <div>
            <label className="label">Listing type</label>
            <select className="input" value={f.listingType} onChange={set('listingType')}>
              <option value="sale">For sale</option><option value="rent">For rent</option>
            </select>
          </div>
          <div>
            <label className="label">Property type</label>
            <select className="input" value={f.propertyType} onChange={set('propertyType')}>
              {['house', 'apartment', 'condo', 'villa', 'land', 'commercial'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2">{field('Street address', 'address', { required: true })}</div>
          {field('City', 'city', { required: true })}
          {field('State', 'state', { required: true })}
          {field('ZIP', 'zip')}
          {field('Latitude', 'lat', { required: true, type: 'number', step: 'any' })}
          {field('Longitude', 'lng', { required: true, type: 'number', step: 'any' })}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {field('Beds', 'beds', { required: true, type: 'number', min: 0 })}
          {field('Baths', 'baths', { required: true, type: 'number', min: 0, step: 0.5 })}
          {field('Sqft', 'sqft', { required: true, type: 'number', min: 0 })}
        </div>

        {field('Amenities (comma separated)', 'amenities', { placeholder: 'pool, garage, gym' })}
        {field('Virtual tour URL (embeddable)', 'virtualTourUrl', { type: 'url', placeholder: 'https://…' })}

        <div>
          <label className="label">Photos (the first is the cover)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="text-sm" />
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button disabled={saving} className="btn-primary">{saving ? 'Publishing…' : 'Publish listing'}</button>
        </div>
      </form>
    </div>
  );
}
