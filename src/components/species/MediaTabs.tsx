'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Tab = 'illustration' | 'photos' | 'sounds';

interface Props { spp: string; scientificName: string; commonName: string; }

export function MediaTabs({ scientificName, commonName }: Props) {
  const [tab, setTab] = useState<Tab>('illustration');
  const [photos, setPhotos]     = useState<Array<{url:string; place:string; observed_on:string}>>([]);
  const [sounds, setSounds]     = useState<Array<{id:string; recordist:string; file:string; quality:string; duration:string; location:string}>>([]);
  const [wikiImg, setWikiImg]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch Wikipedia illustration
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&titles=${encodeURIComponent(scientificName)}&pithumbsize=600&format=json&origin=*`)
      .then(r => r.json())
      .then(d => {
        const pages = d?.query?.pages ?? {};
        const page  = Object.values(pages)[0] as Record<string, unknown>;
        const thumb = page?.thumbnail as { source?: string } | undefined;
        if (thumb?.source) setWikiImg(thumb.source);
      }).catch(() => {});
  }, [scientificName]);

  useEffect(() => {
    if (tab === 'photos' && photos.length === 0) {
      setLoading(true);
      fetch(`/api/photos?name=${encodeURIComponent(scientificName)}`)
        .then(r => r.json()).then(d => setPhotos(d.photos ?? [])).finally(() => setLoading(false));
    }
    if (tab === 'sounds' && sounds.length === 0) {
      setLoading(true);
      fetch(`/api/sounds?name=${encodeURIComponent(commonName)}`)
        .then(r => r.json()).then(d => setSounds(d.recordings ?? [])).finally(() => setLoading(false));
    }
  }, [tab, scientificName, commonName, photos.length, sounds.length]);

  return (
    <div className="card space-y-3">
      <div className="flex gap-2">
        {(['illustration','photos','sounds'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
            tab === t ? 'bg-forest-600 text-white' : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
          }`}>{t === 'illustration' ? '🖼️ Illustration' : t === 'photos' ? '📷 Photos' : '🔊 Sounds'}</button>
        ))}
      </div>

      {tab === 'illustration' && (
        wikiImg
          ? <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100">
              <Image src={wikiImg} alt={scientificName} fill style={{objectFit:'contain'}} />
            </div>
          : <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">No illustration available</div>
      )}

      {tab === 'photos' && (
        loading
          ? <p className="text-sm text-gray-400 animate-pulse">Loading photos…</p>
          : photos.length > 0
            ? <div className="grid grid-cols-3 gap-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={p.url} alt={p.place || 'bird photo'} fill style={{objectFit:'cover'}} />
                  </div>
                ))}
              </div>
            : <p className="text-gray-400 text-sm">No photos found</p>
      )}

      {tab === 'sounds' && (
        loading
          ? <p className="text-sm text-gray-400 animate-pulse">Loading recordings…</p>
          : sounds.length > 0
            ? <ul className="space-y-2">
                {sounds.map(s => (
                  <li key={s.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                    <button
                      onClick={() => {
                        if (audioRef.current) { audioRef.current.pause(); }
                        audioRef.current = new Audio(s.file);
                        audioRef.current.play();
                      }}
                      className="shrink-0 w-9 h-9 bg-forest-600 text-white rounded-full flex items-center justify-center hover:bg-forest-700"
                    >▶</button>
                    <div className="text-sm">
                      <p className="font-medium">{s.recordist}</p>
                      <p className="text-gray-400 text-xs">{s.location} · {s.duration}s · Q:{s.quality}</p>
                    </div>
                  </li>
                ))}
              </ul>
            : <p className="text-gray-400 text-sm">No recordings found</p>
      )}
    </div>
  );
}
