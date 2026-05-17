'use client';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export function LogButton({ spp, commonName }: { spp: string; commonName: string }) {
  return (
    <Link
      href={`/log?spp=${spp}&name=${encodeURIComponent(commonName)}`}
      className="btn-primary flex items-center gap-2 shrink-0"
    >
      <PlusCircle size={16} /> Log Sighting
    </Link>
  );
}
