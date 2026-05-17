'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bird, BookOpen, MapPin, List, Map } from 'lucide-react';

const NAV = [
  { href: '/species',  label: 'Field Guide', icon: BookOpen },
  { href: '/log',      label: 'Log',         icon: MapPin   },
  { href: '/lifelist', label: 'Life List',   icon: List     },
  { href: '/map',      label: 'Map',         icon: Map      },
  { href: '/hotspots', label: 'Hotspots',    icon: Bird     },
];

export function Navbar() {
  const path = usePathname();
  return (
    <header className="bg-aira-950 border-b border-aira-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <span className="font-bold text-white tracking-tight">Bird<span className="text-gold-400">Book</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(href)
                  ? 'bg-gold-400 text-aira-950'
                  : 'text-aira-200 hover:text-white hover:bg-aira-800'
              }`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-aira-950 border-t border-aira-800 flex z-50">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
              path.startsWith(href) ? 'text-gold-400' : 'text-aira-400 hover:text-aira-100'
            }`}>
            <Icon size={20} />
            <span className="mt-0.5">{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
