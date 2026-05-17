'use client';
import { useState, useEffect } from 'react';
import { SpeciesTile } from '@/components/species/SpeciesTile';

interface Sighting {
  id: string;
  species_spp: string;
  species_name: string;
  sighted_at: string;
  location_name: string;
  count: number;
}

interface LifeListEntry {
  spp: string;
  name: string;
  firstSeen: string;
  count: number;
  location: string;
}

export default function LifeListPage() {
  const [list, setList]       = useState<LifeListEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sightings')
      .then(r => r.json())
      .then((d: { sightings?: Sighting[] }) => {
        const map: Record<string, LifeListEntry> = {};
        for (const s of d.sightings ?? []) {
          if (!map[s.species_spp]) {
            map[s.species_spp] = {
              spp:      s.species_spp,
              name:     s.species_name,
              firstSeen: s.sighted_at,
              count:    s.count,
              location: s.location_name,
            };
          }
        }
        setList(Object.values(map).sort((a, b) => a.name.localeCompare(b.name)));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">Loading life list…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-800">📋 My Life List</h1>
        <span className="badge bg-forest-100 text-forest-800 text-sm">{list.length} species</span>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">🦜</span>
          <p className="mt-3">No sightings yet. Go log a bird!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {list.map(entry => (
            <SpeciesTile
              key={entry.spp}
              spp={entry.spp}
              commonName={entry.name}
              scientificName={entry.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
