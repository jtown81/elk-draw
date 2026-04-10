/**
 * GFP Draw Statistics — API Explorer
 *
 * Run this script first to discover the parameter IDs needed by the main scraper.
 * These IDs can change year-to-year, so re-run each spring before scraping.
 *
 * Usage:
 *   node scripts/gfp-explore.mjs
 *
 * Output: Logs API structure to console. Update gfp-scrape.mjs with any changed IDs.
 *
 * Requirements: Node.js 18+ (uses built-in fetch)
 */

const BASE_URL = 'https://license.gooutdoorssouthdakota.com';
const STATS_URL = `${BASE_URL}/License/DrawStatistics`;

// ============================================================
// Helpers
// ============================================================

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SD-Elk-Scraper/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  return res.text();
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; SD-Elk-Scraper/1.0)',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} → ${res.status} ${res.statusText}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// Step 1: Fetch main page — extract form options
// ============================================================

async function exploreMainPage() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log(' STEP 1: Fetching main page HTML');
  console.log('═══════════════════════════════════════════════════');

  const html = await fetchPage(STATS_URL);

  // Extract year options from select dropdown
  const yearMatches = [...html.matchAll(/<option[^>]+value="(\d+)"[^>]*>(\d{4})<\/option>/g)];
  if (yearMatches.length) {
    console.log('\n📅 Year options:');
    yearMatches.forEach(m => console.log(`  value="${m[1]}"  label="${m[2]}"`));
  } else {
    console.log('\n⚠️  No year options found in HTML — page may load years via AJAX');
  }

  // Extract all select elements and their options
  const selectMatches = [...html.matchAll(/<select[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)];
  console.log(`\n📋 Found ${selectMatches.length} select elements:`);
  selectMatches.forEach(m => {
    const id = m[1];
    const innerHtml = m[2];
    const options = [...innerHtml.matchAll(/<option[^>]+value="([^"]*)"[^>]*>([^<]*)<\/option>/g)];
    console.log(`\n  Select#${id} (${options.length} options):`);
    options.slice(0, 5).forEach(o => console.log(`    value="${o[1]}"  label="${o[2].trim()}"`));
    if (options.length > 5) console.log(`    ... and ${options.length - 5} more`);
  });

  // Find JavaScript for API calls
  const apiUrlMatches = [...html.matchAll(/\/License\/DrawStatistics\/(\w+)/g)];
  const uniqueEndpoints = [...new Set(apiUrlMatches.map(m => m[0]))];
  console.log('\n🔗 API endpoints found in page JS:');
  uniqueEndpoints.forEach(e => console.log(`  ${e}`));

  return html;
}

// ============================================================
// Step 2: Try FilterDropdowns endpoint
// ============================================================

async function exploreFilterDropdowns() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log(' STEP 2: Fetching FilterDropdowns endpoint');
  console.log('═══════════════════════════════════════════════════');

  const url = `${BASE_URL}/License/DrawStatistics/FilterDropdowns`;

  try {
    const data = await postJson(url, {});
    console.log('\n✅ FilterDropdowns response:');
    console.log(JSON.stringify(data, null, 2).slice(0, 3000));
    return data;
  } catch (err) {
    console.log(`\n❌ FilterDropdowns failed: ${err.message}`);
    return null;
  }
}

// ============================================================
// Step 3: Probe GetDrawResults with known year
// ============================================================

async function probeGetDrawResults(year = 2024) {
  console.log('\n═══════════════════════════════════════════════════');
  console.log(` STEP 3: Probing GetDrawResults for year ${year}`);
  console.log('═══════════════════════════════════════════════════');

  const url = `${BASE_URL}/License/DrawStatistics/GetDrawResults`;

  // Try with minimal/empty params to see error response structure
  const testBodies = [
    { Year: year },
    { Year: year, PhaseCategoryID: 0 },
    { Year: year, PhaseCategoryID: 1 },
    { Year: year, PhaseCategoryID: 2 },
  ];

  for (const body of testBodies) {
    try {
      console.log(`\n  → POST body: ${JSON.stringify(body)}`);
      const data = await postJson(url, body);
      console.log('  ✅ Response:');
      console.log(JSON.stringify(data, null, 2).slice(0, 2000));
      await sleep(300);
      return data;
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message.slice(0, 200)}`);
    }
    await sleep(300);
  }
}

// ============================================================
// Step 4: Try fetching page with different year params
// ============================================================

async function tryYearParam(year) {
  console.log(`\n  → Trying year ${year} via GET param`);
  try {
    const url = `${STATS_URL}?year=${year}`;
    const html = await fetchPage(url);
    const hasTable = html.includes('<table');
    const hasElk = html.toLowerCase().includes('elk');
    console.log(`    Has <table>: ${hasTable}, mentions elk: ${hasElk}`);
    if (hasTable) {
      // Log first table content
      const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
      if (tableMatch) console.log('    First table:', tableMatch[0].slice(0, 500));
    }
  } catch (err) {
    console.log(`    ❌ ${err.message.slice(0, 100)}`);
  }
}

// ============================================================
// Step 5: Check response headers for session info
// ============================================================

async function checkHeaders() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log(' STEP 5: Checking response headers');
  console.log('═══════════════════════════════════════════════════');

  const res = await fetch(STATS_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SD-Elk-Scraper/1.0)' },
  });

  console.log('\n  Response headers:');
  res.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  const cookies = res.headers.get('set-cookie');
  if (cookies) {
    console.log('\n  🍪 Cookies set:');
    console.log(' ', cookies.slice(0, 500));
  } else {
    console.log('\n  No cookies set on initial request');
  }

  return res;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log(' GFP Draw Statistics — API Explorer');
  console.log(' Target: https://license.gooutdoorssouthdakota.com');
  console.log('═══════════════════════════════════════════════════');

  try {
    // Step 1: Parse main page HTML
    await exploreMainPage();
    await sleep(500);

    // Step 2: Try FilterDropdowns
    await exploreFilterDropdowns();
    await sleep(500);

    // Step 3: Probe GetDrawResults
    await probeGetDrawResults(2024);
    await sleep(500);

    // Step 4: Try year GET params
    console.log('\n═══════════════════════════════════════════════════');
    console.log(' STEP 4: Probing year URL params');
    console.log('═══════════════════════════════════════════════════');
    await tryYearParam(2024);
    await sleep(300);
    await tryYearParam(2023);

    // Step 5: Check headers
    await checkHeaders();

  } catch (err) {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log(' DONE — Review output above, then update gfp-scrape.mjs');
  console.log('   with the correct PhaseCategoryID, PhaseID values');
  console.log('═══════════════════════════════════════════════════\n');
}

main();
