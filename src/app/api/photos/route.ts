import { NextRequest, NextResponse } from 'next/server';

interface InatPhoto {
  url: string;
  attribution: string;
}

interface InatObservation {
  photos: InatPhoto[];
  observed_on: string;
  place_guess: string;
}

interface InatResponse {
  results?: InatObservation[];
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ photos: [] });

  try {
    const url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(name)}&quality_grade=research&photos=true&place_id=113055&per_page=10&order_by=votes`;
    const res  = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json() as InatResponse;
    const photos = (json?.results ?? []).flatMap((obs) =>
      (obs.photos ?? []).slice(0, 1).map((p) => ({
        url:         p.url?.replace('square', 'medium'),
        attribution: p.attribution,
        observed_on: obs.observed_on,
        place:       obs.place_guess ?? '',
      }))
    ).slice(0, 9);
    return NextResponse.json({ photos });
  } catch (err) {
    console.error('iNaturalist error', err);
    return NextResponse.json({ photos: [], error: 'upstream error' }, { status: 502 });
  }
}
