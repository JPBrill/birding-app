'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  url: string;
  place: string;
  observed_on: string;
}

export function PhotosTab({ scientificName }: { scientificName: string }) {
  const [photos, setPhotos]   = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/photos?name=${encodeURIComponent(scientificName)}`)
      .then(r => r.json())
      .then((d: { photos?: Photo[] }) => setPhotos(d.photos ?? []))
      .finally(() => setLoading(false));
  }, [scientificName]);

  if (loading) return <p className="text-sm text-gray-400 animate-pulse">Loading photos…</p>;
  if (!photos.length) return <p className="text-gray-400 text-sm">No photos found</p>;

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p, i) => (
        <div key={i} className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
          <Image src={p.url} alt={p.place || 'bird photo'} fill style={{ objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
}
