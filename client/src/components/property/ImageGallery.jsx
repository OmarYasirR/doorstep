import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageGallery({ images = [], title }) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70' }];
  const go = (d) => setIndex((i) => (i + d + list.length) % list.length);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={list[index].url}
            alt={`${title} photo ${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {list.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white">
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 rounded bg-ink/80 px-2 py-1 text-xs text-white">{index + 1} / {list.length}</span>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg ring-2 ${i === index ? 'ring-brass' : 'ring-transparent'}`}>
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
