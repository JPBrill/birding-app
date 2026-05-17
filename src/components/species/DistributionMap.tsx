'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapComponent = dynamic(() => import('@/components/LeafletMap'), { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-xl animate-pulse" /> });

export function DistributionMap({ spp }: { spp: string }) {
  const [geoData, setGeoData] = useState<unknown>(null);

  useEffect(() => {
    fetch(`/api/species/${spp}/distribution`)
      .then(r => r.json()).then(setGeoData).catch(console.error);
  }, [spp]);

  return <MapComponent geoData={geoData} />;
}
