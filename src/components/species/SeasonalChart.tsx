'use client';
import { useEffect, useState } from 'react';

interface Rate { month: string; rate: number; }

export function SeasonalChart({ spp }: { spp: string }) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/species/${spp}/seasonal`)
      .then(r => r.json())
      .then(d => setRates(d.rates ?? []))
      .finally(() => setLoading(false));
  }, [spp]);

  if (loading) return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  if (!rates.length) return <p className="text-gray-400 text-sm">No seasonal data</p>;

  const max = Math.max(...rates.map(r => r.rate), 1);

  return (
    <div className="flex items-end gap-1 h-24">
      {rates.map(r => (
        <div key={r.month} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full bg-forest-400 rounded-t transition-all"
            style={{ height: `${(r.rate / max) * 72}px`, minHeight: r.rate > 0 ? 3 : 0 }}
            title={`${r.month}: ${r.rate.toFixed(1)}%`}
          />
          <span className="text-[9px] text-gray-400">{r.month}</span>
        </div>
      ))}
    </div>
  );
}
