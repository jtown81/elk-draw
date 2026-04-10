/**
 * GFP Draw Statistics — Main Scraper
 *
 * Scrapes Black Hills elk draw statistics from South Dakota GFP for years 2023–2025.
 * Produces JSON output compatible with the Elk Draw Analyzer app's DrawRecord format.
 *
 * API Structure (discovered via gfp-explore.mjs):
 *   - FilterDropdowns → cascading dropdowns (year → category → phase → event)
 *   - GetDrawResults  → HTML table with pool data (tags, applicants, issued, remaining)
 *   - GetDrawPreferences → HTML table per-point breakdown (used to find lowest point drawn)
 *
 * Pool Labels from GFP:
 *   "Resident 10+ Preference Pool"  → poolKey: '10plus'
 *   "Resident 2+ Preference Pool"   → poolKey: '2plus'  (note: not in original app model)
 *   "Resident 0+ Preference Pool"   → poolKey: '0plus'
 *   Landowner pools                 → excluded (not relevant for preference point hunters)
 *
 * Usage:
 *   node scripts/gfp-scrape.mjs                    # scrape 2023-2025
 *   node scripts/gfp-scrape.mjs --years=2024,2025  # specific years
 *   node scripts/gfp-scrape.mjs --dry-run          # preview without requests
 *
 * Output: scripts/output/gfp-draw-data-YYYY-MM-DD.json
 *
 * Requirements: Node.js 18+ (built-in fetch)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ════════════════════════════════════════════════════════════
// CONFIG — discovered via gfp-explore.mjs (verified 2026-04-10)
// ════════════════════════════════════════════════════════════

const CONFIG = {
  baseUrl: 'https://license.gooutdoorssouthdakota.com',
  delayMs: 400,           // delay between requests (be kind to GFP servers)
  retries: 3,
  retryDelayMs: 1200,

  // Year → "Black Hills Elk" PhaseCategoryID + First Application PhaseID
  // To refresh: node scripts/gfp-explore.mjs
  yearPhases: {
    2023: { phaseCategoryId: '879',  phaseId: '1551' },
    2024: { phaseCategoryId: '1074', phaseId: '1858' },
    2025: { phaseCategoryId: '1147', phaseId: '1963' },
  },

  // Years to scrape (override with --years=2024,2025)
  years: [2023, 2024, 2025],
};

// ════════════════════════════════════════════════════════════
// Unit & tag type config
// ════════════════════════════════════════════════════════════

// GFP hunt code suffix → app tagType
// 21 = "ONE ANY ELK", 23 = "ONE ANTLERLESS ELK"
const TAG_SUFFIX_MAP = {
  '21': 'any_elk',
  '23': 'antlerless',
};

/**
 * Parse a GFP hunt event text into { unitCode, tagType } or null.
 * Examples:
 *   "H1A21 - ONE ANY ELK"       → { unitCode: "H1A", tagType: "any_elk" }
 *   "H1B23 - ONE ANTLERLESS ELK" → { unitCode: "H1B", tagType: "antlerless" }
 *   "H2C23 - ONE ANTLERLESS ELK" → { unitCode: "H2C", tagType: "antlerless" }
 */
function parseHuntCode(text) {
  const m = text.trim().match(/^([A-Z0-9]+)(21|23)\s*-/i);
  if (!m) return null;
  const unitCode = m[1].toUpperCase();
  const tagType = TAG_SUFFIX_MAP[m[2]];
  return tagType ? { unitCode, tagType } : null;
}

// GFP pool label (lowercase, partial match) → app PoolKey
// Note: "2+ Preference Pool" is a real GFP pool that wasn't in the original app model
const POOL_LABEL_MAP = [
  { match: 'resident 10+', pool: '10plus' },
  { match: '10+ preference', pool: '10plus' },
  { match: 'resident 2+',  pool: '2plus'  },
  { match: '2+ preference', pool: '2plus'  },
  { match: 'resident 0+',  pool: '0plus'  },
  { match: '0+ preference', pool: '0plus'  },
  { match: 'general',      pool: '0plus'  },
];

// ════════════════════════════════════════════════════════════
// HTTP helpers
// ════════════════════════════════════════════════════════════

let sessionCookies = '';

async function initSession() {
  const res = await fetch(`${CONFIG.baseUrl}/License/DrawStatistics`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SD-Elk-Scraper/1.0)' },
  });
  // Extract session cookies from set-cookie header
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    sessionCookies = setCookie.split(',')
      .map(c => c.split(';')[0].trim())
      .join('; ');
  }
  if (!res.ok) throw new Error(`Session init failed: ${res.status}`);
  console.log(`  Session initialized ${sessionCookies ? '(cookies set)' : '(no cookies)'}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function postWithRetry(endpoint, body) {
  const url = `${CONFIG.baseUrl}${endpoint}`;

  for (let attempt = 1; attempt <= CONFIG.retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/html, */*',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': `${CONFIG.baseUrl}/License/DrawStatistics`,
          'User-Agent': 'Mozilla/5.0 (compatible; SD-Elk-Scraper/1.0)',
          ...(sessionCookies ? { 'Cookie': sessionCookies } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
      }

      return res.text(); // both endpoints return HTML or JSON strings
    } catch (err) {
      if (attempt === CONFIG.retries) throw err;
      console.warn(`    ⚠️  Retry ${attempt}/${CONFIG.retries}: ${err.message.slice(0, 60)}`);
      await sleep(CONFIG.retryDelayMs * attempt);
    }
  }
}

// ════════════════════════════════════════════════════════════
// HTML parsing (zero-dependency regex-based)
// ════════════════════════════════════════════════════════════

/**
 * Extract text content from HTML, stripping tags.
 */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

/**
 * Extract all <tr> row text content from an HTML table.
 * Returns array of arrays: [[cell1, cell2, ...], ...]
 */
function parseTableRows(html) {
  const rows = [];
  const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const tr of trMatches) {
    const cells = [...tr[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map(td => stripTags(td[1]).replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

/**
 * Parse GetDrawResults HTML into pool data.
 * Returns array of { poolLabel, tagsAvailable, applicants, issued, remaining }
 */
function parseDrawResults(html) {
  const rows = parseTableRows(html);
  const pools = [];

  for (const cells of rows) {
    // Skip header rows, bold/summary rows
    if (cells.length < 4) continue;
    const label = cells[0].toLowerCase();
    if (label.includes('black hills') || label === '' || label.includes('total')) continue;

    const tagsAvailable = parseInt(cells[1], 10);
    const applicants = parseInt(cells[2], 10);
    const issued = parseInt(cells[3], 10);
    const remaining = cells[4] ? parseInt(cells[4], 10) : 0;

    if (!isNaN(tagsAvailable) && !isNaN(applicants)) {
      pools.push({
        poolLabel: cells[0].trim(),
        tagsAvailable,
        applicants,
        issued: isNaN(issued) ? 0 : issued,
        remaining: isNaN(remaining) ? 0 : remaining,
      });
    }
  }

  return pools;
}

/**
 * Parse GetDrawPreferences HTML into per-point breakdown.
 * Returns lowest preference point where successful > 0 in each group.
 */
function parseDrawPreferences(html) {
  const rows = parseTableRows(html);
  let currentGroup = null;
  const result = {
    nonLandownerLowestPoint: null,
    landownerLowestPoint: null,
  };

  for (const cells of rows) {
    if (cells.length === 1) {
      // Section header
      const h = cells[0].toLowerCase();
      if (h.includes('landowner')) {
        currentGroup = 'landowner';
      } else if (h.includes('resident non') || h.includes('non landowner') || h.includes('nonlandowner')) {
        currentGroup = 'nonLandowner';
      }
      continue;
    }

    if (cells.length < 3 || !currentGroup) continue;

    const points = parseInt(cells[0], 10);
    const successful = parseInt(cells[2], 10);

    if (isNaN(points) || isNaN(successful)) continue;
    if (cells[0].toLowerCase() === 'total') continue;

    if (successful > 0) {
      if (currentGroup === 'nonLandowner') {
        // Track lowest (minimum) point that had successful draws
        if (result.nonLandownerLowestPoint === null || points < result.nonLandownerLowestPoint) {
          result.nonLandownerLowestPoint = points;
        }
      } else if (currentGroup === 'landowner') {
        if (result.landownerLowestPoint === null || points < result.landownerLowestPoint) {
          result.landownerLowestPoint = points;
        }
      }
    }
  }

  return result;
}

/**
 * Map GFP pool label to app PoolKey. Returns null if not a preference pool.
 */
function mapPoolLabel(label) {
  const lower = label.toLowerCase();
  for (const { match, pool } of POOL_LABEL_MAP) {
    if (lower.includes(match)) return pool;
  }
  return null; // landowner pools and others → skip
}

// ════════════════════════════════════════════════════════════
// GFP API calls
// ════════════════════════════════════════════════════════════

async function getHuntEvents(year, phaseCategoryId, phaseId) {
  const rawText = await postWithRetry('/License/DrawStatistics/FilterDropdowns', {
    Year: String(year),
    PhaseCategoryID: String(phaseCategoryId),
    PhaseID: String(phaseId),
    EventID: '',
  });

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`FilterDropdowns returned non-JSON: ${rawText.slice(0, 200)}`);
  }

  const events = data?.Events?.Options || [];
  return events.map(e => ({
    text: e.Text || '',
    value: e.Value || '',
  }));
}

async function getDrawResults(year, phaseCategoryId, phaseId, eventId) {
  const html = await postWithRetry('/License/DrawStatistics/GetDrawResults', {
    Year: String(year),
    PhaseCategoryID: String(phaseCategoryId),
    PhaseID: String(phaseId),
    EventID: String(eventId),
  });
  return parseDrawResults(html);
}

async function getDrawPreferences(year, phaseCategoryId, phaseId, eventId) {
  const html = await postWithRetry('/License/DrawStatistics/GetDrawPreferences', {
    Year: String(year),
    PhaseCategoryID: String(phaseCategoryId),
    PhaseID: String(phaseId),
    EventID: String(eventId),
  });
  return parseDrawPreferences(html);
}

// ════════════════════════════════════════════════════════════
// Core scraping logic
// ════════════════════════════════════════════════════════════

function todayIso() {
  return new Date().toISOString();
}
function todayDate() {
  return new Date().toISOString().split('T')[0];
}

async function scrapeYear(year) {
  console.log(`\n  ── Year ${year} ───────────────────────────────────`);

  const { phaseCategoryId, phaseId } = CONFIG.yearPhases[year] || {};
  if (!phaseCategoryId) {
    console.log(`  ⚠️  No phase config for ${year} — skipping`);
    return [];
  }

  // Load all hunt events for this year
  let huntEvents;
  try {
    huntEvents = await getHuntEvents(year, phaseCategoryId, phaseId);
    console.log(`  ${huntEvents.length} hunt events loaded`);
    await sleep(CONFIG.delayMs);
  } catch (err) {
    console.error(`  ❌ Failed to load hunt events: ${err.message}`);
    return [];
  }

  // Parse ALL events — use actual GFP unit codes (not our predefined list)
  const records = [];
  const counts = { ok: 0, no_pools: 0, error: 0 };

  for (const event of huntEvents) {
    const parsed = parseHuntCode(event.text);
    if (!parsed) continue; // skip non-elk or unrecognized codes

    const { unitCode, tagType } = parsed;
    const label = tagType === 'any_elk' ? 'Any Elk  ' : 'Antlerless';
    process.stdout.write(`    ${unitCode.padEnd(5)} ${label} `);

    try {
      // Fetch draw results
      const rawPools = await getDrawResults(year, phaseCategoryId, phaseId, event.value);
      await sleep(CONFIG.delayMs);
      const prefs = await getDrawPreferences(year, phaseCategoryId, phaseId, event.value);
      await sleep(CONFIG.delayMs);

      // Map pools
      const pools = rawPools
        .map(raw => ({ pool: mapPoolLabel(raw.poolLabel), ...raw }))
        .filter(p => p.pool !== null)
        .map(p => ({
          pool: p.pool,
          tagsAvailable: p.tagsAvailable,
          applicants: p.applicants,
          lowestPointDrawn: prefs.nonLandownerLowestPoint,
        }));

      const poolOrder = { '10plus': 0, '2plus': 1, '0plus': 2 };
      pools.sort((a, b) => (poolOrder[a.pool] ?? 9) - (poolOrder[b.pool] ?? 9));

      if (pools.length === 0) {
        console.log('⚠️   no preference pools');
        counts.no_pools++;
        continue;
      }

      records.push({
        id: `scraped-${unitCode}-${year}-${tagType}`,
        unitName: unitCode,
        year,
        tagType,
        pools,
        notes: `Scraped from GFP ${todayDate()}`,
        addedDate: todayIso(),
        updatedDate: todayIso(),
      });

      const pDesc = pools.map(p => `${p.pool}:${p.tagsAvailable}t/${p.applicants}a`).join(', ');
      console.log(`✅  ${pDesc}`);
      counts.ok++;
    } catch (err) {
      console.log(`❌  ${err.message.slice(0, 70)}`);
      counts.error++;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`\n  Year ${year}: ✅ ${counts.ok}/${total} | ⚠️ ${counts.no_pools} no pools | ❌ ${counts.error} errors`);
  return records;
}

// ════════════════════════════════════════════════════════════
// CLI & main
// ════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const yearsArg = args.find(a => a.startsWith('--years='));
  const years = yearsArg
    ? yearsArg.replace('--years=', '').split(',').map(Number)
    : CONFIG.years;

  console.log('══════════════════════════════════════════════════════════');
  console.log(' GFP Draw Statistics Scraper — Black Hills Elk');
  console.log('══════════════════════════════════════════════════════════');
  console.log(` Years:   ${years.join(', ')}`);
  console.log(` Units:   All Black Hills Elk units (discovered from GFP)`);
  console.log(` Tags:    any_elk + antlerless`);
  console.log(` Target:  varies by year (GFP controls what units are offered`);
  console.log(` Delay:   ${CONFIG.delayMs}ms between requests`);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN — no requests will be made\n');
    return;
  }

  // Initialize session (get cookies)
  console.log('\n  Initializing session...');
  try {
    await initSession();
  } catch (err) {
    console.warn(`  ⚠️  Session init warning: ${err.message}`);
  }

  // Scrape each year
  const allRecords = [];
  for (const year of years) {
    if (!CONFIG.yearPhases[year]) {
      console.log(`\n  ⚠️  Year ${year}: no phase config — run gfp-explore.mjs to find IDs`);
      continue;
    }
    const records = await scrapeYear(year);
    allRecords.push(...records);
  }

  // Write output
  const outputDir = join(__dirname, 'output');
  mkdirSync(outputDir, { recursive: true });
  const outputFile = join(outputDir, `gfp-draw-data-${todayDate()}.json`);
  writeFileSync(outputFile, JSON.stringify(allRecords, null, 2), 'utf-8');

  // Summary
  const byYear = {};
  for (const r of allRecords) byYear[r.year] = (byYear[r.year] || 0) + 1;
  const coveredUnits = [...new Set(allRecords.map(r => r.unitName))].sort();
  console.log('\n══════════════════════════════════════════════════════════');
  console.log(' COMPLETE');
  console.log('══════════════════════════════════════════════════════════');
  console.log(` Total records: ${allRecords.length}`);
  console.log(' By year:', byYear);
  console.log(' Units with data:', coveredUnits.join(', ') || 'none');
  console.log(`\n Output: ${outputFile}`);
  console.log('\n Next steps:');
  console.log(`   1. node scripts/gfp-validate.mjs ${outputFile}`);
  console.log('   2. Spot-check 3–5 records against GFP website');
  console.log('   3. Import into app → Enter Data → Import JSON\n');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
