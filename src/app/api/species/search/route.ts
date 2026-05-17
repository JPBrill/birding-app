import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q || q.length < 2) return NextResponse.json({ species: [] });

  try {
    const res = await fetch(
      `https://api.birdmap.africa/sabap2/v2/search/species/${encodeURIComponent(q)}`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json() as { data?: unknown[] };
    return NextResponse.json({ species: json?.data ?? [] });
  } catch (err) {
    console.error('SABAP2 search error', err);
    return NextResponse.json({ species: [], error: 'upstream error' }, { status: 502 });
  }
}
