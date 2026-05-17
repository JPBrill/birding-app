'use client';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Hotspot { locId: string; locName: string; lat: number; lng: number; latestObsDt: string; numSpeciesAllTime: number; }

export default function HotspotsPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    navigator.geolocation?.getCurrentPosition(
      pos => {
        fetch(`/api/hotspots?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&dist=25`)
          .then(r => r.json())
          .then(d => setHotspots(d.hotspots ?? []))
          .catch(() => setError('Failed to load hotspots'))
          .finally(() => setLoading(false));
      },
      () => {
        // Default to Margate, KZN
        fetch('/api/hotspots?lat=-30.86&lng=30.37&dist=25')
          .then(r => r.json())
          .then(d => setHotspots(d.hotspots ?? []))
          .finally(() => setLoading(false));
      }
    );
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest-800">📍 Nearby Hotspots</h1>
      <p className="text-sm text-gray-500">Top eBird birding locations within 25 km</p>

      {loading && <p className="text-sm text-gray-400 animate-pulse">Finding hotspots near you…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="divide-y divide-forest-100 bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
        {hotspots.map(h => (
          <a
            key={h.locId}
            href={`https://ebird.org/hotspot/${h.locId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-3 hover:bg-forest-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-forest-500 shrink-0" />
              <div>
                <p className="font-semibold text-forest-800">{h.locName}</p>
                <p className="text-xs text-gray-400">Last obs: {h.latestObsDt ?? 'unknown'}</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold text-forest-600">{h.numSpeciesAllTime ?? '?'}</p>
              <p className="text-xs text-gray-400">species</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
