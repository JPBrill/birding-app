import { NextResponse } from 'next/server';

// SABAP2 Order → friendly group name mapping
const ORDER_GROUPS: Record<string, string> = {
  Passeriformes:       'Perching Birds',
  Accipitriformes:     'Raptors',
  Falconiformes:       'Falcons',
  Charadriiformes:     'Waders & Shorebirds',
  Anseriformes:        'Waterfowl',
  Ciconiiformes:       'Storks & Herons',
  Pelecaniformes:      'Pelicans & Allies',
  Columbiformes:       'Doves & Pigeons',
  Psittaciformes:      'Parrots',
  Cuculiformes:        'Cuckoos',
  Strigiformes:        'Owls',
  Coraciiformes:       'Kingfishers & Rollers',
  Piciformes:          'Woodpeckers & Barbets',
  Bucerotiformes:      'Hornbills & Hoopoes',
  Galliformes:         'Gamebirds',
  Gruiformes:          'Cranes & Rails',
  Suliformes:          'Cormorants & Gannets',
  Procellariiformes:   'Seabirds',
  Sphenisciformes:     'Penguins',
  Musophagiformes:     'Turacos',
  Apodiformes:         'Swifts',
  Caprimulgiformes:    'Nightjars',
  Otidiformes:         'Bustards',
  Phoenicopteriformes: 'Flamingos',
  Podicipediformes:    'Grebes',
  Rheiformes:          'Ostriches',
  Struthioniformes:    'Ostriches',
  Trogoniformes:       'Trogons',
};

interface SABAPSpecies {
  Spp: string;
  Common_group: string;
  Common_species: string;
  Genus: string;
  Species: string;
  Family: string;
  Order: string;
}

interface FamilyGroup {
  family: string;
  members: SABAPSpecies[];
}

interface OrderGroup {
  order: string;
  label: string;
  families: FamilyGroup[];
  total: number;
}

export async function GET() {
  try {
    // Fetch all SA species — SABAP2 returns full list with no query
    const res  = await fetch(
      'https://api.birdmap.africa/sabap2/v2/search/species/a',
      { next: { revalidate: 86400 } }
    );
    const json = await res.json() as { data?: SABAPSpecies[] };
    const all  = json?.data ?? [];

    // Group by Order → Family
    const map: Record<string, Record<string, SABAPSpecies[]>> = {};
    for (const sp of all) {
      const order  = sp.Order  || 'Unknown';
      const family = sp.Family || 'Unknown';
      if (!map[order])          map[order] = {};
      if (!map[order][family])  map[order][family] = [];
      map[order][family].push(sp);
    }

    const groups: OrderGroup[] = Object.entries(map)
      .map(([order, families]) => ({
        order,
        label: ORDER_GROUPS[order] ?? order,
        families: Object.entries(families)
          .map(([family, members]) => ({ family, members }))
          .sort((a, b) => a.family.localeCompare(b.family)),
        total: Object.values(families).reduce((s, m) => s + m.length, 0),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return NextResponse.json({ groups });
  } catch (err) {
    console.error('SABAP2 browse error', err);
    return NextResponse.json({ groups: [], error: 'upstream error' }, { status: 502 });
  }
}
