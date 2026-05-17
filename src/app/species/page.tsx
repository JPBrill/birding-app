'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  description: string;
  image: string;
  families: FamilyGroup[];
  total: number;
}

// Representative images & descriptions per order
const ORDER_META: Record<string, { image: string; description: string }> = {
  Passeriformes:       { image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', description: 'The largest bird order — weavers, sunbirds, starlings, robins and more.' },
  Accipitriformes:     { image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=600&q=80', description: 'Eagles, hawks, kites and vultures — masters of soaring flight.' },
  Falconiformes:       { image: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=600&q=80', description: 'Swift, agile falcons and kestrels built for speed.' },
  Charadriiformes:     { image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', description: 'Waders, sandpipers, gulls and terns of shore and wetland.' },
  Anseriformes:        { image: 'https://images.unsplash.com/photo-1562155618-e1a8e4e2b58a?w=600&q=80', description: 'Ducks, geese and other waterfowl of lakes and rivers.' },
  Ciconiiformes:       { image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80', description: 'Storks, herons and egrets — tall wading birds of wetlands.' },
  Pelecaniformes:      { image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&q=80', description: 'Pelicans, ibises and spoonbills of open water.' },
  Columbiformes:       { image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=600&q=80', description: 'Doves and pigeons found across every habitat.' },
  Psittaciformes:      { image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80', description: 'Colourful parrots and lovebirds of forest and savanna.' },
  Cuculiformes:        { image: 'https://images.unsplash.com/photo-1444465693019-aa0b6392460d?w=600&q=80', description: 'Cuckoos — many are brood parasites of remarkable cunning.' },
  Strigiformes:        { image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80', description: 'Silent nocturnal owls, from the tiny Scops to the massive Eagle Owl.' },
  Coraciiformes:       { image: 'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=600&q=80', description: 'Kingfishers, bee-eaters and rollers — jewels of the bird world.' },
  Piciformes:          { image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&q=80', description: 'Woodpeckers, barbets and honeyguides that work tree bark.' },
  Bucerotiformes:      { image: 'https://images.unsplash.com/photo-1591608971362-f8b8f5bf3f9b?w=600&q=80', description: 'Hornbills and hoopoes — iconic birds of the African bush.' },
  Galliformes:         { image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80', description: 'Francolins, spurfowl and guinea fowl of grassland and bush.' },
  Gruiformes:          { image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80', description: 'Cranes, rails and coots — elegant birds of marsh and open country.' },
  Suliformes:          { image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80', description: 'Cormorants, darters and gannets of coastal and inland waters.' },
  Procellariiformes:   { image: 'https://images.unsplash.com/photo-1591608971362-f8b8f5bf3f9b?w=600&q=80', description: 'Albatrosses, petrels and shearwaters — long-distance ocean wanderers.' },
  Sphenisciformes:     { image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=600&q=80', description: 'The African Penguin — SA\'s only penguin species.' },
  Musophagiformes:     { image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', description: 'Turacos — stunning, fruit-eating birds unique to Africa.' },
  Apodiformes:         { image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', description: 'Swifts — spend almost their entire lives on the wing.' },
  Caprimulgiformes:    { image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80', description: 'Nightjars — cryptic, crepuscular insect hunters.' },
  Otidiformes:         { image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80', description: 'Bustards — large, stately birds of open plains and Karoo.' },
  Phoenicopteriformes: { image: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=600&q=80', description: 'Flamingos — iconic pink wading birds of saline lakes.' },
  Podicipediformes:    { image: 'https://images.unsplash.com/photo-1562155618-e1a8e4e2b58a?w=600&q=80', description: 'Grebes — expert divers of lakes and dams.' },
  Struthioniformes:    { image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&q=80', description: 'The Ostrich — the world\'s largest bird, native to Africa.' },
  Coliiformes:         { image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', description: 'Mousebirds — small, sociable African birds that creep through foliage.' },
  Casuariiformes:      { image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&q=80', description: 'Ratites recorded in the SABAP2 database.' },
  Trogoniformes:       { image: 'https://images.unsplash.com/photo-1548366086-7f1b76106622?w=600&q=80', description: 'Narina Trogon — a stunning forest gem of South Africa.' },
};

const FALLBACK = { image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', description: 'A diverse group of Southern African birds.' };

export default function SpeciesPage() {
  const [query, setQuery]               = useState('');
  const [results, setResults]           = useState<SABAPSpecies[]>([]);
  const [loading, setLoading]           = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [groups, setGroups]             = useState<OrderGroup[]>([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [activeOrder, setActiveOrder]   = useState<OrderGroup | null>(null);
  const [openFamilies, setOpenFamilies] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/species/browse')
      .then(r => r.json())
      .then((d: { groups?: OrderGroup[] }) => {
        const enriched = (d.groups ?? []).map(g => ({
          ...g,
          ...(ORDER_META[g.order] ?? FALLBACK),
        }));
        setGroups(enriched);
      })
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
      } finally { setLoading(false); }
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

  // ---- Order detail panel ----
  if (activeOrder) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => { setActiveOrder(null); setOpenFamilies({}); }}
          className="inline-flex items-center gap-2 text-aira-300 hover:text-white text-sm font-medium transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          All Groups
        </button>

        {/* Order hero */}
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <Image src={activeOrder.image} alt={activeOrder.label} fill style={{ objectFit: 'cover' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-aira-950/90 via-aira-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h1 className="text-2xl font-bold text-white">{activeOrder.label}</h1>
            <p className="text-aira-200 text-sm mt-1">{activeOrder.description}</p>
            <p className="text-gold-400 text-xs mt-1">{activeOrder.total} species</p>
          </div>
        </div>

        {/* Families */}
        <div className="space-y-3">
          {activeOrder.families.map(fam => {
            const isOpen = openFamilies[fam.family];
            return (
              <div key={fam.family} className="bg-aira-900 rounded-2xl border border-aira-800 overflow-hidden">
                <button
                  onClick={() => setOpenFamilies(p => ({ ...p, [fam.family]: !p[fam.family] }))}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-aira-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight size={16} className={`text-gold-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    <span className="font-semibold text-white">{fam.family}</span>
                    <span className="text-xs text-aira-500">({fam.members.length})</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4 pb-4">
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
      </div>
    );
  }

  // ---- Main grid ----
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
        {query.length > 0 && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-aira-400 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Order tile grid */}
      {browseLoading ? (
        <div className="text-center py-16 text-aira-400 animate-pulse">Loading groups…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {groups.map(group => (
            <button
              key={group.order}
              onClick={() => setActiveOrder(group)}
              className="group relative h-44 rounded-2xl overflow-hidden border border-aira-800 hover:border-gold-400 hover:shadow-lg hover:shadow-gold-400/10 transition-all text-left"
            >
              <Image
                src={group.image}
                alt={group.label}
                fill
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aira-950/95 via-aira-950/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-bold text-white text-sm leading-tight">{group.label}</p>
                <p className="text-aira-300 text-xs mt-0.5 line-clamp-2">{group.description}</p>
                <p className="text-gold-400 text-xs mt-1">{group.total} species</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
