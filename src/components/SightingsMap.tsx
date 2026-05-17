'use client';
import { useEffect, useRef, useState } from 'react';

interface Sighting { id: string; species_name: string; latitude: string; longitude: string; sighted_at: string; location_name: string; }

export default function SightingsMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useEffect(() => {
    fetch('/api/sightings').then(r => r.json()).then(d => setSightings(d.sightings ?? []));
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    let map: import('leaflet').Map | null = null;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      map = L.map(ref.current!).setView([-29, 25], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      sightings.filter(s => s.latitude && s.longitude).forEach(s => {
        L.circleMarker([+s.latitude, +s.longitude], {
          radius: 7, fillColor: '#16a34a', color: '#166534', weight: 1, fillOpacity: 0.8,
        }).bindPopup(`<b>${s.species_name}</b><br>${s.location_name || ''}<br>${new Date(s.sighted_at).toLocaleDateString()}`).addTo(map!);
      });
    })();
    return () => { map?.remove(); };
  }, [sightings]);

  return <div ref={ref} className="h-[60vh] w-full rounded-2xl z-0 border border-forest-200" />;
}
