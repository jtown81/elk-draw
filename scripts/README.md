# GFP Draw Statistics Scraper

Scripts to collect South Dakota Game, Fish & Parks elk draw statistics for bulk import into the Elk Draw Analyzer app.

## Overview

The GFP draw statistics page (`https://license.gooutdoorssouthdakota.com/License/DrawStatistics`) uses a dynamic POST-based API with cascading dropdowns. These scripts interact with that API directly using Node.js built-in `fetch` (no external dependencies).

## Scripts

| Script | Purpose |
|--------|---------|
| `gfp-explore.mjs` | Discover API parameter IDs (run first) |
| `gfp-scrape.mjs` | Main scraper — produces `output/gfp-draw-data-YYYY-MM-DD.json` |
| `gfp-validate.mjs` | Validates scraped JSON before app import |

## Usage

### Step 1: Explore API Structure

Run this first each year to verify parameter IDs are still valid:

```bash
node scripts/gfp-explore.mjs
```

This logs:
- Available year IDs
- Elk season PhaseCategoryID
- Drawing phase IDs
- Hunt event IDs for Black Hills units
- Raw response shape from GetDrawResults

Update `gfp-scrape.mjs` with any changed IDs before scraping.

### Step 2: Run Main Scraper

```bash
node scripts/gfp-scrape.mjs
```

Output: `scripts/output/gfp-draw-data-YYYY-MM-DD.json`

Target coverage: 20 Black Hills units × 3 years (2023–2025) × 2 tag types = up to 120 records.

### Step 3: Validate Output

```bash
node scripts/gfp-validate.mjs scripts/output/gfp-draw-data-2026-04-10.json
```

Checks for:
- Valid unit names
- Valid years and tag types
- At least one pool per record
- No duplicate records
- Numeric field ranges

### Step 4: Import into App

1. Copy output JSON
2. Open app at `http://localhost:3456`
3. Go to "Enter Data" tab
4. Click "Import JSON"
5. Select the output file
6. Choose "Replace all" or "Merge"

## GFP API Reference

**Base URL**: `https://license.gooutdoorssouthdakota.com`

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/License/DrawStatistics` | GET | Main page (HTML with filter options) |
| `/License/DrawStatistics/FilterDropdowns` | GET | Returns all dropdown options as JSON |
| `/License/DrawStatistics/GetDrawResults` | POST | Returns pool data for a specific hunt |
| `/License/DrawStatistics/GetDrawPreferences` | POST | Returns preference point distribution |

### POST Body Structure

```json
{
  "Year": 2024,
  "PhaseCategoryID": <number>,
  "PhaseID": <number>,
  "EventID": <number>
}
```

### Hunt Code Format

Hunt codes follow the pattern `[UnitCode][TypeSuffix]`:
- Suffix `21` = "ONE ANY ELK"
- Suffix `23` = "ONE ANTLERLESS ELK"

Examples:
- `H1A21` = H1A Any Elk
- `H1A23` = H1A Antlerless Elk
- `H3A21` = H3A Any Elk

### Pool Labels → PoolKey Mapping

| GFP Label | App PoolKey |
|-----------|-------------|
| "15 Points or More" | `15plus` |
| "10 Through 14 Points" | `10plus` |
| "0 Through 9 Points" | `0plus` |

*(Exact label strings TBD — run gfp-explore.mjs to confirm)*

## Output Format

JSON array of DrawRecord objects compatible with app import:

```json
[
  {
    "id": "scraped-H1A-2024-any_elk",
    "unitName": "H1A",
    "year": 2024,
    "tagType": "any_elk",
    "pools": [
      { "pool": "15plus", "tagsAvailable": 10, "applicants": 450, "lowestPointDrawn": 15 },
      { "pool": "10plus", "tagsAvailable": 10, "applicants": 820, "lowestPointDrawn": 11 },
      { "pool": "0plus",  "tagsAvailable": 10, "applicants": 3200, "lowestPointDrawn": 9 }
    ],
    "notes": "Scraped from GFP 2026-04-10",
    "addedDate": "2026-04-10T00:00:00.000Z",
    "updatedDate": "2026-04-10T00:00:00.000Z"
  }
]
```

## Black Hills Elk Units

```
H1A H1B
H2A H2B H2E
H3A H3B H3C H3D H3E
H4A H4B
H5
H6A H6B
H11A H11B H11C H11D H11E
```

Total: 20 units

## Annual Update Process

1. Run `gfp-explore.mjs` to verify parameter IDs are still valid
2. Update IDs in `gfp-scrape.mjs` if changed
3. Run `gfp-scrape.mjs` — new output file created
4. Run `gfp-validate.mjs` on output
5. Spot-check 3–5 records against GFP website manually
6. Import into app or update `src/data/seed-draw-data.ts`

## Troubleshooting

**403/401 errors**: GFP may require session cookies. Try:
1. Open GFP page in browser, inspect Network tab
2. Copy `Cookie` header from a successful request
3. Add `Cookie` header to fetch calls in scraper

**Empty results**: Parameter IDs may have changed. Re-run `gfp-explore.mjs`.

**Missing units**: Not all units are offered every year (some closed to hunting). This is expected.

**Rate limiting**: If requests fail after many calls, increase `DELAY_MS` in scraper (default: 300ms).
