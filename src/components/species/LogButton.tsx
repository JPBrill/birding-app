'use client';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

interface Props { spp: string; commonName: string; }

export function LogButton({ spp, commonName }: Props) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/log?spp=${spp}&name=${encodeURIComponent(commonName)}`)}
      className="btn-gold flex items-center gap-2 whitespace-nowrap"
    >
      <PlusCircle size={16} /> Log Sighting
    </button>
  );
}
