'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Save } from 'lucide-react';

interface SpeciesOption { Spp: string; Common_group: string; Common_species: string; Genus: string; Species: string; }

export default function LogPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<SpeciesOption[]>([]);
  const [selected, setSelected] = useState<SpeciesOption | null>(null);
  const [form, setForm] = useState({ sighted_at: new Date().toISOString().slice(0,16), count: 1, notes: '', location_name: '', latitude: '', longitude: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) { setOptions([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/species/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.species?.slice(0, 8) ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  function geolocate() {
    navigator.geolocation?.getCurrentPosition(pos => {
      setForm(f => ({ ...f, latitude: String(pos.coords.latitude.toFixed(5)), longitude: String(pos.coords.longitude.toFixed(5)) }));
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          species_spp: selected.Spp,
          species_name: `${selected.Common_group} ${selected.Common_species}`,
          ...form,
        }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/lifelist'), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-forest-800">📋 Log a Sighting</h1>

      {success && (
        <div className="card bg-forest-50 border-forest-300 text-forest-800 font-semibold text-center">
          ✅ Sighting logged! Redirecting to your life list…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Species picker */}
        <div className="card space-y-2">
          <label className="text-sm font-semibold text-gray-600">Species *</label>
          {selected ? (
            <div className="flex items-center justify-between bg-forest-50 rounded-lg px-3 py-2">
              <div>
                <p className="font-semibold text-forest-800">{selected.Common_group} {selected.Common_species}</p>
                <p className="text-xs italic text-gray-500">{selected.Genus} {selected.Species}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search species name…" className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
              </div>
              {options.length > 0 && (
                <ul className="border border-gray-200 rounded-lg overflow-hidden">
                  {options.map(o => (
                    <li key={o.Spp}>
                      <button type="button" onClick={() => { setSelected(o); setQuery(''); setOptions([]); }} className="w-full text-left px-3 py-2 text-sm hover:bg-forest-50">
                        <span className="font-medium">{o.Common_group} {o.Common_species}</span>
                        <span className="text-gray-400 ml-2 italic text-xs">{o.Genus} {o.Species}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Date / count */}
        <div className="card grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Date & Time *</label>
            <input type="datetime-local" value={form.sighted_at} onChange={e => setForm(f => ({...f, sighted_at: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Count</label>
            <input type="number" min={1} value={form.count} onChange={e => setForm(f => ({...f, count: +e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
          </div>
        </div>

        {/* Location */}
        <div className="card space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-600">Location</label>
            <button type="button" onClick={geolocate} className="text-xs text-forest-600 flex items-center gap-1"><MapPin size={12}/> Use GPS</button>
          </div>
          <input value={form.location_name} onChange={e => setForm(f => ({...f, location_name: e.target.value}))} placeholder="e.g. Krantzkloof Nature Reserve" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.latitude} onChange={e => setForm(f => ({...f, latitude: e.target.value}))} placeholder="Latitude" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            <input value={form.longitude} onChange={e => setForm(f => ({...f, longitude: e.target.value}))} placeholder="Longitude" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <label className="text-sm font-semibold text-gray-600 block mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={3} placeholder="Behaviour, plumage, habitat…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none" />
        </div>

        <button type="submit" disabled={!selected || saving} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          <Save size={16}/>{saving ? 'Saving…' : 'Save Sighting'}
        </button>
      </form>
    </div>
  );
}
