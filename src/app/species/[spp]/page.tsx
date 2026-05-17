import { notFound } from 'next/navigation';
import { MediaTabs } from '@/components/species/MediaTabs';
import { DistributionMap } from '@/components/species/DistributionMap';
import { SeasonalChart } from '@/components/species/SeasonalChart';
import { LogButton } from '@/components/species/LogButton';

async function getSpecies(spp: string) {
  try {
    const res = await fetch(`https://api.adu.org.za/sabap2/v2/search/species/${spp}`, {
      next: { revalidate: 86400 },
    });
    const json = await res.json();
    return json?.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ spp: string }>;
}) {
  const { spp } = await params;
  const sp = await getSpecies(spp);
  if (!sp) notFound();

  return (
    <div className="space-y-6">
      <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-forest-800">
            {sp.Common_group} {sp.Common_species}
          </h1>
          <p className="text-gray-500 italic">{sp.Genus} {sp.Species}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="badge bg-forest-100 text-forest-800">{sp.Family}</span>
            <span className="badge bg-earth-100 text-earth-800">{sp.Order}</span>
          </div>
        </div>
        <LogButton spp={spp} commonName={`${sp.Common_group} ${sp.Common_species}`} />
      </div>

      <MediaTabs spp={spp} scientificName={`${sp.Genus} ${sp.Species}`} commonName={`${sp.Common_group} ${sp.Common_species}`} />

      <div className="card">
        <h2 className="font-bold text-forest-700 mb-3">Distribution (SABAP2)</h2>
        <DistributionMap spp={spp} />
      </div>

      <div className="card">
        <h2 className="font-bold text-forest-700 mb-3">Monthly Reporting Rate</h2>
        <SeasonalChart spp={spp} />
      </div>
    </div>
  );
}
