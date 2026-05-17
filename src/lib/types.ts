export interface SABAPSpecies {
  Spp: string;
  Common_group: string;
  Common_species: string;
  Genus: string;
  Species: string;
  Family: string;
  Order: string;
}

export interface Sighting {
  id: string;
  user_id: string;
  species_spp: string;
  species_name: string;
  sighted_at: string;
  latitude: string | null;
  longitude: string | null;
  location_name: string | null;
  count: number;
  notes: string | null;
  created_at: string;
}
