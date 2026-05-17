# 🦜 BirdBook — SA Birding Field Guide & Life List

A personal Southern African birding companion app for your wife's birding hobby. Browse ~1,000 species, listen to calls, explore distribution maps, and log every sighting.

## Features

- 🦅 **Field Guide** — Search ~1,000 SA species via SABAP2/ADU BirdMap API
- 🖼️ **Illustrations** — Wikipedia Commons images per species
- 📷 **Photos** — iNaturalist research-grade photos (South Africa)
- 🔊 **Bird Calls** — Xeno-canto recordings with inline audio player
- 🗺️ **Distribution Maps** — SABAP2 pentad heatmaps via GeoJSON on Leaflet
- 📊 **Seasonal Charts** — Monthly reporting rates from SABAP2
- 📋 **Life List** — Personal sighting log with GPS, count, notes
- 📍 **Hotspots** — Nearby eBird birding locations
- 🗺️ **Sightings Map** — All your sightings on an interactive map

## Data Sources (all free, no licensing fees)

| Data | Source | Auth |
|---|---|---|
| Species search & taxonomy | [SABAP2 ADU BirdMap API](https://api.adu.org.za/sabap2/v2/) | None |
| Distribution maps | SABAP2 GeoJSON | None |
| Monthly reporting rates | SABAP2 | None |
| Illustrations | Wikipedia Commons API | None |
| Photos | iNaturalist API | None |
| Bird calls | Xeno-canto API | None |
| Hotspots | eBird API | Free key |
| Map tiles | OpenStreetMap | None |

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet + react-leaflet
- **Auth + DB:** Supabase
- **Deployment:** Vercel

## Setup

1. Clone and install:
   ```bash
   git clone https://github.com/JPBrill/birding-app
   cd birding-app
   npm install
   ```

2. Copy `.env.example` → `.env.local` and fill in:
   - `EBIRD_API_KEY` — get free at https://ebird.org/api/keygen
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project

3. Set up Supabase:
   - Run `supabase/migrations/001_sightings.sql` in your Supabase SQL editor

4. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

Connect the GitHub repo to Vercel and add the environment variables in the Vercel dashboard. Zero config needed — it deploys automatically on every push to `main`.
