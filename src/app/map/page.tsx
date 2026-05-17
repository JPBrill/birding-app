'use client';
import dynamic from 'next/dynamic';
const SightingsMap = dynamic(() => import('@/components/SightingsMap'), { ssr: false });

export default function MapPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-forest-800">🗺️ Sightings Map</h1>
      <SightingsMap />
    </div>
  );
}
