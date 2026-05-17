import { notFound } from 'next/navigation';
import { DistributionMap } from '@/components/species/DistributionMap';
import { SeasonalChart } from '@/components/species/SeasonalChart';
import { LogButton } from '@/components/species/LogButton';
import { PhotosTab } from '@/components/species/PhotosTab';
import { SoundsTab } from '@/components/species/SoundsTab';
import { BackButton } from '@/components/BackButton';

interface SABAPSpeciesDetail {
  Common_group: string;
  Common_species: string;
  Genus: string;
  Species: string;
  Family: string;
  Order: string;
}

async function getSpecies(spp: string): Promise<SABAPSpeciesDetail | null> {
  try {
    const res = await fetch(
      `https://api.birdmap.africa/sabap2/v2/search/species/${spp}`,
      { next: { revalidate: 86400 } }
    );
    const json = await res.json() as { data?: SABAPSpeciesDetail[] };
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

  const commonName     = `${sp.Common_group} ${sp.Common_species}`;
  const scientificName = `${sp.Genus} ${sp.Species}`;

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Header */}
      <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-aira-900">{commonName}</h1>
          <p className="text-gray-500 italic">{scientificName}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="badge bg-aira-100 text-aira-800">{sp.Family}</span>
            <span className="badge bg-gold-100 text-gold-800">{sp.Order}</span>
          </div>
        </div>
        <LogButton spp={spp} commonName={commonName} />
      </div>

      {/* Photos */}
      <div className="card">
        <h2 className="font-bold text-aira-700 mb-3">📷 Photos</h2>
        <PhotosTab scientificName={scientificName} />
      </div>

      {/* Sounds */}
      <div className="card">
        <h2 className="font-bold text-aira-700 mb-3">🔊 Sounds</h2>
        <SoundsTab commonName={commonName} />
      </div>

      {/* Distribution */}
      <div className="card">
        <h2 className="font-bold text-aira-700 mb-3">Distribution (SABAP2)</h2>
        <DistributionMap spp={spp} />
      </div>

      {/* Seasonal */}
      <div className="card">
        <h2 className="font-bold text-aira-700 mb-3">Monthly Reporting Rate</h2>
        <SeasonalChart spp={spp} />
      </div>
    </div>
  );
}
