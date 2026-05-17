'use client';
import { useState, useEffect, useRef } from 'react';

interface Sound {
  id: string;
  recordist: string;
  file: string;
  quality: string;
  duration: string;
  location: string;
}

export function SoundsTab({ commonName }: { commonName: string }) {
  const [sounds, setSounds]   = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/sounds?name=${encodeURIComponent(commonName)}`)
      .then(r => r.json())
      .then((d: { recordings?: Sound[] }) => setSounds(d.recordings ?? []))
      .finally(() => setLoading(false));
  }, [commonName]);

  if (loading) return <p className="text-sm text-gray-400 animate-pulse">Loading recordings…</p>;
  if (!sounds.length) return <p className="text-gray-400 text-sm">No recordings found</p>;

  return (
    <ul className="space-y-2">
      {sounds.map(s => (
        <li key={s.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              audioRef.current = new Audio(s.file);
              audioRef.current.play().catch(console.error);
            }}
            className="shrink-0 w-9 h-9 bg-forest-600 text-white rounded-full flex items-center justify-center hover:bg-forest-700"
          >▶</button>
          <div className="text-sm">
            <p className="font-medium">{s.recordist}</p>
            <p className="text-gray-400 text-xs">{s.location} · {s.duration}s · Q:{s.quality}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
