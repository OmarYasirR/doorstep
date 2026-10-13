import { useState } from 'react';
import { View, X } from 'lucide-react';

// Supports any embeddable tour URL (Matterport, Kuula, a hosted Pannellum page, etc.)
export default function VirtualTour({ url }) {
  const [open, setOpen] = useState(false);
  if (!url) return null;

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-brass w-full">
        <View size={18} /> Take the 3D virtual tour
      </button>
      {open && (
        <div className="fixed inset-0 z-[1200] flex flex-col bg-ink-900/90 p-4" role="dialog" aria-modal="true" aria-label="Virtual tour">
          <button onClick={() => setOpen(false)} className="ml-auto mb-2 flex items-center gap-1 text-sm text-white" aria-label="Close tour">
            <X size={18} /> Close
          </button>
          <iframe
            src={url}
            title="Virtual tour"
            className="w-full flex-1 rounded-xl bg-black"
            allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}
