'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SpeciesTile } from '@/components/species/SpeciesTile';

interface SABAPSpecies {
  Spp: string;
  Common_group: string;
  Common_species: string;
  Genus: string;
  Species: string;
  Family: string;
  Order: string;
}

interface FamilyGroup {
  family: string;
  members: SABAPSpecies[];
}

interface OrderGroup {
  order: string;
  label: string;
  families: FamilyGroup[];
  total: number;
}

export default function SpeciesPage() {
  const [query, setQuery]               = useState('');
  const [results, setResults]           = useState<SABAPSpecies[]>([]);
  const [loading, setLoading]           = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [groups, setGroups]             = useState<OrderGroup[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [openOrders, setOpenOrders]     = useState<Record<string, boolean>>({});
  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/species/browse')
      .then(r => r.json())
      .then((d: { groups?: OrderGroup[] }) => setGroups(d.groups ?? []))
      .finally(() => setBrowseLoading(false));
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/species/search?q=${encodeURIComponent(query)}`);
        const data = await res.json() as { species?: SABAPSpecies[] };
        setResults(data.species ?? []);
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">🦅 Field Guide</h1>

      {/* Search */}
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-aira-400 z-10" size={18} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => results.length > 0 && setShowSuggestions(true)}
          placeholder="Search by common or scientific name…"
          className="w-full pl-10 pr-4 py-3 border border-aira-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 bg-aira-900 text-white placeholder-aira-400"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {showSuggestions && results.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-aira-900 border border-aira-700 rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
            {results.slice(0, 10).map(sp => (
              <Link
                key={sp.Spp}
                href={`/species/${sp.Spp}`}
                onClick={() => { setShowSuggestions(false); setQuery(''); }}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-aira-800 transition-colors border-b border-aira-800 last:border-0"
              >
                <div>
                  <p className="font-semibold text-white text-sm">{sp.Common_group} {sp.Common_species}</p>
                  <p className="text-xs text-aira-400 italic">{sp.Genus} {sp.Species}</p>
                </div>
                <span className="text-xs text-aira-500">{sp.Family}</span>
              </Link>
            ))}
            {results.length > 10 && (
              <p className="text-center text-xs text-aira-500 py-2">+{results.length - 10} more — refine your search</p>
            )}
          </div>
        )}
      </div>

      {/* Browse accordion */}
      {browseLoading ? (
        <div className="text-center py-16 text-aira-400 animate-pulse">Loading species…</div>
      ) : (
        <div className="space-y-2">
          {groups.map(group => (
            <div key={group.order} className="bg-aira-900 rounded-2xl border border-aira-800 overflow-hidden">
              <button
                onClick={() => setOpenOrders(p => ({ ...p, [group.order]: !p[group.order] }))}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-aira-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {openOrders[group.order]
                    ? <ChevronDown size={18} className="text-gold-400" />
                    : <ChevronRight size={18} className="text-gold-400" />}
                  <span className="font-bold text-white">{group.label}</span>
                  <span className="text-xs text-aira-500">({group.total} species)</span>
                </div>
              </button>

              {openOrders[group.order] && (
                <div className="border-t border-aira-800 divide-y divide-aira-800">
                  {group.families.map(fam => {
                    const famKey = `${group.order}-${fam.family}`;
                    return (
                      <div key={fam.family}>
                        <button
                          onClick={() => setOpenFamilies(p => ({ ...p, [famKey]: !p[famKey] }))}
                          className="w-full flex items-center gap-2 px-6 py-3 hover:bg-aira-800 transition-colors"
                        >
                          {openFamilies[famKey]
                            ? <ChevronDown size={15} className="text-aira-400" />
                            : <ChevronRight size={15} className="text-aira-400" />}
                          <span className="font-semibold text-aira-200 text-sm">{fam.family}</span>
                          <span className="text-xs text-aira-500">({fam.members.length})</span>
                        </button>
                        {openFamilies[famKey] && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-5 pb-5">
                            {fam.members.map(sp => (
                              <SpeciesTile
                                key={sp.Spp}
                                spp={sp.Spp}
                                commonName={`${sp.Common_group} ${sp.Common_species}`}
                                scientificName={`${sp.Genus} ${sp.Species}`}
                                family={sp.Family}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
