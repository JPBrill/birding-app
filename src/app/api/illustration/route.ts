import { NextRequest, NextResponse } from 'next/server';

interface WikiPage {
  thumbnail?: { source?: string };
}

interface WikiResponse {
  query?: { pages?: Record<string, WikiPage> };
}

interface GBIFSpecies {
  usageKey?: number;
}

interface GBIFMediaItem {
  type?: string;
  format?: string;
  identifier?: string;
  references?: string;
  publisher?: string;
  license?: string;
}

interface GBIFOccurrence {
  media?: GBIFMediaItem[];
}

interface GBIFOccurrenceResponse {
  results?: GBIFOccurrence[];
}

async function getWikipediaImage(scientificName: string): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&titles=${encodeURIComponent(scientificName)}&pithumbsize=800&format=json&origin=*`;
    const res  = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json() as WikiResponse;
    const pages = data?.query?.pages ?? {};
    const page  = Object.values(pages)[0];
    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function getGBIFImage(scientificName: string): Promise<string | null> {
  try {
    // Step 1: resolve species key
    const speciesRes  = await fetch(
      `https://api.gbif.org/v1/species?name=${encodeURIComponent(scientificName)}&limit=1`,
      { next: { revalidate: 86400 } }
    );
    const speciesData = await speciesRes.json() as { results?: GBIFSpecies[] };
    const key = speciesData?.results?.[0]?.usageKey;
    if (!key) return null;

    // Step 2: find a StillImage occurrence
    const occRes  = await fetch(
      `https://api.gbif.org/v1/occurrence/search?taxonKey=${key}&mediaType=StillImage&limit=20`,
      { next: { revalidate: 86400 } }
    );
    const occData = await occRes.json() as GBIFOccurrenceResponse;
    for (const occ of occData?.results ?? []) {
      for (const m of occ.media ?? []) {
        if (m.type === 'StillImage' && m.identifier) {
          return m.identifier;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ url: null, source: null });

  const wiki = await getWikipediaImage(name);
  if (wiki) return NextResponse.json({ url: wiki, source: 'wikipedia' });

  const gbif = await getGBIFImage(name);
  if (gbif) return NextResponse.json({ url: gbif, source: 'gbif' });

  return NextResponse.json({ url: null, source: null });
}
