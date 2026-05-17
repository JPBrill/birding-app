'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Sighting { id: string; species_spp: string; species_name: string; sighted_at: string; location_name: string; count: number; }

export default function LifeListPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sightings').then(r => r.json()).then(d => setSightings(d.sightings ?? [])).finally(() => setLoading(false));
  }, []);

  const unique = [...new Map(sightings.map(s => [s.species_spp, s])).values()];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-800">📋 Life List</h1>
        <div className="text-right">
          <p className="text-3xl font-bold text-forest-600">{unique.length}</p>
          <p className="text-xs text-gray-400">unique species</p>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400 animate-pulse">Loading your sightings…</p>}

      {!loading && sightings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">📭</span>
          <p className="mt-3">No sightings yet. <Link href="/log" className="text-forest-600 underline">Log your first bird!</Link></p>
        </div>
      )}

      <div className="divide-y divide-forest-100 bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
        {sightings.map(s => (
          <Link key={s.id} href={`/species/${s.species_spp}`} className="flex items-center justify-between px-4 py-3 hover:bg-forest-50 transition-colors">
            <div>
              <p className="font-semibold text-forest-800">{s.species_name}</p>
              <p className="text-xs text-gray-400">{s.location_name || 'No location'}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{new Date(s.sighted_at).toLocaleDateString('en-ZA')}</p>
              <p>×{s.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
