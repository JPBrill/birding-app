'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const links = [
  { href: '/',         label: '🏠 Home' },
  { href: '/species',  label: '🦅 Guide' },
  { href: '/log',      label: '➕ Log' },
  { href: '/lifelist', label: '📋 List' },
  { href: '/map',      label: '🗺️ Map' },
  { href: '/hotspots', label: '📍 Spots' },
];

export function Navbar() {
  const path = usePathname();
  return (
    <nav className="bg-forest-800 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2">
        <span className="font-bold text-lg mr-4 whitespace-nowrap text-earth-400">BirdBook 🦜</span>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              path === href ? 'bg-forest-600 text-white' : 'hover:bg-forest-700 text-forest-100'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
