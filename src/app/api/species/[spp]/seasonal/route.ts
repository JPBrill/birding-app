import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { spp: string } }) {
  try {
    const res = await fetch(
      `https://api.adu.org.za/sabap2/v2/summary/species/monthly/${params.spp}`,
      { next: { revalidate: 86400 } }
    );
    const json = await res.json();
    // Aggregate into monthly reporting rates for South Africa
    const monthly: Record<string, { total: number; count: number }> = {};
    for (const r of json?.data ?? []) {
      if (r.country !== 'South Africa') continue;
      const m = String(r.mn).padStart(2, '0');
      if (!monthly[m]) monthly[m] = { total: 0, count: 0 };
      monthly[m].total += parseFloat(r.reprate ?? '0');
      monthly[m].count += 1;
    }
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const rates = months.map((m, i) => ({
      month: labels[i],
      rate: monthly[m] ? +(monthly[m].total / monthly[m].count).toFixed(2) : 0,
    }));
    return NextResponse.json({ rates });
  } catch (err) {
    console.error('SABAP2 seasonal error', err);
    return NextResponse.json({ error: 'upstream error' }, { status: 502 });
  }
}
