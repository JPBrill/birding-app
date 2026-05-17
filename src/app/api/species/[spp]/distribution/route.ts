import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { spp: string } }) {
  try {
    const res = await fetch(
      `https://api.adu.org.za/sabap2/v2/summary/species/${params.spp}?format=geoJSON`,
      { next: { revalidate: 86400 } }
    );
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error('SABAP2 distribution error', err);
    return NextResponse.json({ error: 'upstream error' }, { status: 502 });
  }
}
