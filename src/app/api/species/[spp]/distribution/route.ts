import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ spp: string }> }
) {
  const { spp } = await params;
  try {
    const res = await fetch(
      `https://api.birdmap.africa/sabap2/v2/summary/species/${spp}?format=geoJSON`,
      { next: { revalidate: 86400 } }
    );
    const json: unknown = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error('SABAP2 distribution error', err);
    return NextResponse.json({ error: 'upstream error' }, { status: 502 });
  }
}
