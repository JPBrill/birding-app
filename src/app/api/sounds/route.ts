import { NextRequest, NextResponse } from 'next/server';

interface XenoRecording {
  id: string;
  rec: string;
  date: string;
  loc: string;
  q: string;
  file: string;
  sono?: { small?: string };
  length: string;
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') ?? '';
  if (!name) return NextResponse.json({ recordings: [] });

  try {
    const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(name)}+cnt:south+africa+q:A`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const json = await res.json() as { recordings?: XenoRecording[] };
    const recordings = (json?.recordings ?? []).slice(0, 8).map((r) => ({
      id:         r.id,
      recordist:  r.rec,
      date:       r.date,
      location:   r.loc,
      quality:    r.q,
      file:       `https:${r.file}`,
      sonogram:   r.sono?.small ?? null,
      duration:   r.length,
    }));
    return NextResponse.json({ recordings });
  } catch (err) {
    console.error('Xeno-canto error', err);
    return NextResponse.json({ recordings: [], error: 'upstream error' }, { status: 502 });
  }
}
