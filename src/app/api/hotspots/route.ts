import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat  = req.nextUrl.searchParams.get('lat')  ?? '-29.85';
  const lng  = req.nextUrl.searchParams.get('lng')  ?? '31.02';
  const dist = req.nextUrl.searchParams.get('dist') ?? '25';
  const key  = process.env.EBIRD_API_KEY;
  if (!key) return NextResponse.json({ error: 'EBIRD_API_KEY not set' }, { status: 500 });

  try {
    const res = await fetch(
      `https://api.ebird.org/v2/ref/hotspot/geo?lat=${lat}&lng=${lng}&dist=${dist}&fmt=json`,
      { headers: { 'X-eBirdApiToken': key }, next: { revalidate: 3600 } }
    );
    const hotspots: unknown = await res.json();
    return NextResponse.json({ hotspots });
  } catch (err) {
    console.error('eBird hotspots error', err);
    return NextResponse.json({ hotspots: [], error: 'upstream error' }, { status: 502 });
  }
}
