'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { SABAPSpecies } from '@/lib/types';

export default function SpeciesPage() {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState<SABAPSpecies[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/species/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.species ?? []);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-forest-800">🦅 Field Guide</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by common or scientific name…"
          className="w-full pl-10 pr-4 py-3 border border-forest-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
        />
      </div>

      {loading && <p className="text-sm text-gray-400 animate-pulse">Searching SABAP2…</p>}

      {results.length > 0 && (
        <ul className="divide-y divide-forest-100 bg-white rounded-2xl shadow-sm border border-forest-100 overflow-hidden">
          {results.map(sp => (
            <li key={sp.Spp}>
              <Link
                href={`/species/${sp.Spp}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-forest-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-forest-800">
                    {sp.Common_group} {sp.Common_species}
                  </p>
                  <p className="text-sm text-gray-500 italic">{sp.Genus} {sp.Species}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{sp.Family}</p>
                  <p>{sp.Order}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length < 2 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">🔍</span>
          <p className="mt-3">Type at least 2 characters to search species</p>
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">🐦</span>
          <p className="mt-3">No species found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
