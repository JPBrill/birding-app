'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  spp: string;
  commonName: string;
  scientificName: string;
  family?: string;
}

interface IllustrationResult {
  url: string | null;
}

export function SpeciesTile({ spp, commonName, scientificName, family }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/illustration?name=${encodeURIComponent(scientificName)}`)
      .then(r => r.json())
      .then((d: IllustrationResult) => setImgUrl(d.url ?? null))
      .catch(() => {});
  }, [scientificName]);

  return (
    <Link href={`/species/${spp}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-aira-800 bg-aira-900 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/10 transition-all">
      <div className="relative h-36 bg-aira-800">
        {imgUrl
          ? <Image src={imgUrl} alt={commonName} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">🐦</div>
        }
      </div>
      <div className="p-3">
        <p className="font-semibold text-white text-sm leading-tight">{commonName}</p>
        <p className="text-xs text-aira-400 italic mt-0.5 truncate">{scientificName}</p>
        {family && <span className="mt-1.5 inline-block text-xs bg-aira-800 text-gold-400 px-2 py-0.5 rounded-full">{family}</span>}
      </div>
    </Link>
  );
}
