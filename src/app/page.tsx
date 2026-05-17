import { Bird, Map, List, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-10 space-y-4">
        <div className="flex justify-center">
          <span className="text-6xl">🦜</span>
        </div>
        <h1 className="text-4xl font-bold text-forest-800">BirdBook</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Your personal Southern African field guide. Discover species, listen to calls, explore maps, and log every sighting.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/species" className="btn-primary flex items-center gap-2">
            <Bird size={18} /> Browse Species
          </Link>
          <Link href="/log" className="btn-secondary flex items-center gap-2">
            <PlusCircle size={18} /> Log a Sighting
          </Link>
        </div>
      </section>

      {/* Quick nav cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/species',  icon: '🦅', label: 'Field Guide',   desc: 'Browse ~1,000 SA species' },
          { href: '/lifelist', icon: '📋', label: 'Life List',     desc: 'Your logged sightings' },
          { href: '/map',      icon: '🗺️', label: 'Sightings Map', desc: 'See where you\'ve birded' },
          { href: '/hotspots', icon: '📍', label: 'Hotspots',      desc: 'Top birding spots near you' },
        ].map(({ href, icon, label, desc }) => (
          <Link key={href} href={href} className="card hover:shadow-md transition-shadow text-center space-y-1">
            <span className="text-3xl">{icon}</span>
            <p className="font-semibold text-forest-800">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </section>

      {/* Data attribution */}
      <footer className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
        Data: <a href="https://sabap2.birdmap.africa" className="underline" target="_blank" rel="noreferrer">SABAP2 / ADU BirdMap</a>
        {' · '}<a href="https://www.xeno-canto.org" className="underline" target="_blank" rel="noreferrer">Xeno-canto</a>
        {' · '}<a href="https://www.inaturalist.org" className="underline" target="_blank" rel="noreferrer">iNaturalist</a>
        {' · '}<a href="https://ebird.org" className="underline" target="_blank" rel="noreferrer">eBird</a>
      </footer>
    </div>
  );
}
