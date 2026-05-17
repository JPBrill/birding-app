'use client';
import { useEffect, useRef } from 'react';

export default function LeafletMap({ geoData }: { geoData: unknown }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !geoData) return;
    let map: import('leaflet').Map | null = null;
    (async () => {
      const L = (await import('leaflet')).default;

      // Fix default marker icons broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      map = L.map(ref.current!).setView([-29, 25], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      if (geoData) {
        L.geoJSON(geoData as GeoJSON.FeatureCollection, {
          style: (feature) => {
            const rr = feature?.properties?.['full protocol'] ?? 0;
            return {
              fillColor:   '#16a34a',
              weight:      0.5,
              color:       '#166534',
              fillOpacity: Math.min(rr / 100, 1) * 0.8,
            };
          },
        }).addTo(map);
      }
    })();
    return () => { map?.remove(); };
  }, [geoData]);

  return <div ref={ref} className="h-64 w-full rounded-xl z-0" />;
}
