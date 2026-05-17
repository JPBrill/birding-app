'use client';
import { useEffect, useRef } from 'react';

export default function LeafletMap({ geoData }: { geoData: unknown }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !geoData) return;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(ref.current!).setView([-29, 25], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.geoJSON(geoData as GeoJSON.FeatureCollection, {
        style: (feature) => {
          const rr = feature?.properties?.['full protocol'] ?? 0;
          const opacity = Math.min(rr / 100, 1);
          return { fillColor: '#16a34a', weight: 0.5, color: '#166534', fillOpacity: opacity * 0.8 };
        },
      }).addTo(map);

      return () => map.remove();
    })();
  }, [geoData]);

  return <div ref={ref} className="h-64 w-full rounded-xl z-0" />;
}
