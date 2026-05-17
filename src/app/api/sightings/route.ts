import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('sightings')
    .select('*, species:species_spp(common_group, common_species, genus, species)')
    .eq('user_id', user.id)
    .order('sighted_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sightings: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { species_spp, species_name, sighted_at, latitude, longitude, location_name, count, notes } = body;

  const { data, error } = await supabase.from('sightings').insert({
    user_id: user.id,
    species_spp,
    species_name,
    sighted_at,
    latitude,
    longitude,
    location_name,
    count: count ?? 1,
    notes,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sighting: data }, { status: 201 });
}
