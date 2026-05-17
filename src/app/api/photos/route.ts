import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ photos: [] });

  try {
    const url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(name)}&quality_grade=research&photos=true&place_id=113055&per_page=10&order_by=votes`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json();
    const photos = (json?.results ?? []).flatMap((obs: Record<string, unknown>) => {
      const photos = obs.photos as Array<{ url: string; attribution: string }> ?? [];
      return photos.slice(0, 1).map((p) => ({
        url: p.url?.replace('square', 'medium'),
        attribution: p.attribution,
        observed_on: obs.observed_on,
        place: (obs.place_guess as string) ?? '',
      }));
    }).slice(0, 9);
    return NextResponse.json({ photos });
  } catch (err) {
    console.error('iNaturalist error', err);
    return NextResponse.json({ photos: [], error: 'upstream error' }, { status: 502 });
  }
}
