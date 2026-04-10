/**
 * GFP Draw Statistics — Output Validator
 *
 * Validates scraped JSON before importing into the Elk Draw Analyzer app.
 *
 * Usage:
 *   node scripts/gfp-validate.mjs scripts/output/gfp-draw-data-2026-04-10.json
 *
 * Exit codes:
 *   0 = All checks passed
 *   1 = Validation errors found
 */

import { readFileSync } from 'fs';

// Valid values
const VALID_UNITS_BLACK_HILLS = new Set([
  'H1A', 'H1B',
  'H2A', 'H2B', 'H2C', 'H2D', 'H2E', 'H2F', 'H2G', 'H2H', 'H2I', 'H2J',
  'H3A', 'H3B', 'H3C', 'H3D', 'H3E', 'H3F', 'H3G',
  'H4A', 'H4B',
  'H5A',
  'H6A', 'H6B',
  'H7A', 'H7B',
  'H9A', 'H9B',
  'H11A', 'H11B', 'H11C', 'H11D', 'H11E',
]);
const VALID_TAG_TYPES = new Set(['any_elk', 'antlerless']);
const VALID_POOL_KEYS = new Set(['15plus', '10plus', '2plus', '0plus']);
const VALID_YEARS = new Set([2023, 2024, 2025]);

// ============================================================
// Main validation
// ============================================================

function validate(records) {
  const errors = [];
  const warnings = [];
  const seen = new Set(); // for duplicate detection

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const ctx = `Record[${i}] (${r.unitName}/${r.year}/${r.tagType})`;

    // Required fields present
    if (!r.id) errors.push(`${ctx}: missing id`);
    if (!r.unitName) errors.push(`${ctx}: missing unitName`);
    if (r.year == null) errors.push(`${ctx}: missing year`);
    if (!r.tagType) errors.push(`${ctx}: missing tagType`);
    if (!Array.isArray(r.pools)) errors.push(`${ctx}: pools must be an array`);

    // Valid values
    if (r.unitName && !VALID_UNITS_BLACK_HILLS.has(r.unitName)) {
      errors.push(`${ctx}: unknown unitName "${r.unitName}"`);
    }
    if (r.tagType && !VALID_TAG_TYPES.has(r.tagType)) {
      errors.push(`${ctx}: invalid tagType "${r.tagType}"`);
    }
    if (r.year && !VALID_YEARS.has(r.year)) {
      warnings.push(`${ctx}: year ${r.year} is outside expected range [2023-2025]`);
    }

    // Pool validation
    if (Array.isArray(r.pools)) {
      if (r.pools.length === 0) {
        errors.push(`${ctx}: pools array is empty`);
      }

      for (let j = 0; j < r.pools.length; j++) {
        const p = r.pools[j];
        const pCtx = `${ctx} pools[${j}]`;

        if (!VALID_POOL_KEYS.has(p.pool)) {
          errors.push(`${pCtx}: invalid pool key "${p.pool}"`);
        }
        if (typeof p.tagsAvailable !== 'number' || p.tagsAvailable < 0) {
          errors.push(`${pCtx}: tagsAvailable must be a non-negative number (got ${p.tagsAvailable})`);
        }
        if (typeof p.applicants !== 'number' || p.applicants < 0) {
          errors.push(`${pCtx}: applicants must be a non-negative number (got ${p.applicants})`);
        }
        if (p.lowestPointDrawn !== null && (typeof p.lowestPointDrawn !== 'number' || p.lowestPointDrawn < 0 || p.lowestPointDrawn > 25)) {
          errors.push(`${pCtx}: lowestPointDrawn must be null or 0-25 (got ${p.lowestPointDrawn})`);
        }
      }

      // Warn if pool keys duplicated
      const poolKeys = r.pools.map(p => p.pool);
      const uniqueKeys = new Set(poolKeys);
      if (uniqueKeys.size !== poolKeys.length) {
        warnings.push(`${ctx}: duplicate pool keys: ${poolKeys}`);
      }
    }

    // Duplicate detection
    const dupKey = `${r.unitName}|${r.year}|${r.tagType}`;
    if (seen.has(dupKey)) {
      errors.push(`${ctx}: duplicate record (same unit+year+tagType)`);
    }
    seen.add(dupKey);
  }

  return { errors, warnings };
}

// ============================================================
// Coverage report
// ============================================================

function printCoverageReport(records) {
  const YEARS = [2023, 2024, 2025];
  const UNITS = [
    'H1A', 'H1B',
    'H2A', 'H2B', 'H2C', 'H2D', 'H2E', 'H2F', 'H2G', 'H2H', 'H2I', 'H2J',
    'H3A', 'H3B', 'H3C', 'H3D', 'H3E', 'H3F', 'H3G',
    'H4A', 'H4B', 'H5A',
    'H6A', 'H6B',
    'H7A', 'H7B',
    'H9A', 'H9B',
    'H11A', 'H11B', 'H11C', 'H11D', 'H11E',
  ];
  const TAG_TYPES = ['any_elk', 'antlerless'];

  // Build lookup set
  const found = new Set(records.map(r => `${r.unitName}|${r.year}|${r.tagType}`));

  console.log('\n📊 Coverage Report:');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`Unit         ${'Any Elk'.padEnd(10)} ${'Antlerless'.padEnd(12)} (✅ = data, ⬜ = missing)`);
  console.log('─────────────────────────────────────────────────────────────────');

  for (const year of YEARS) {
    console.log(`\n  Year ${year}:`);
    for (const unit of UNITS) {
      const anyElk = TAG_TYPES.map(t => found.has(`${unit}|${year}|${t}`) ? '✅' : '⬜');
      console.log(`    ${unit.padEnd(6)} ${anyElk[0]}  ${anyElk[1]}`);
    }
  }

  // Summary counts
  const total = records.length;
  const maxPossible = YEARS.length * UNITS.length * TAG_TYPES.length;
  const pct = Math.round((total / maxPossible) * 100);

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log(` Total: ${total} / ${maxPossible} possible records (${pct}% coverage)`);

  // Missing units
  const missingKeys = [];
  for (const year of YEARS) {
    for (const unit of UNITS) {
      for (const tagType of TAG_TYPES) {
        if (!found.has(`${unit}|${year}|${tagType}`)) {
          missingKeys.push(`${unit}/${year}/${tagType}`);
        }
      }
    }
  }
  if (missingKeys.length) {
    console.log(` Missing (${missingKeys.length}): ${missingKeys.slice(0, 10).join(', ')}${missingKeys.length > 10 ? ' ...' : ''}`);
  } else {
    console.log(' Missing: none — full coverage!');
  }
}

// ============================================================
// Entry point
// ============================================================

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/gfp-validate.mjs <path-to-json>');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log(' GFP Draw Statistics Validator');
  console.log('═══════════════════════════════════════════════════════');
  console.log(` File: ${file}`);

  let records;
  try {
    const raw = readFileSync(file, 'utf-8');
    records = JSON.parse(raw);
  } catch (err) {
    console.error(`\n❌ Failed to read/parse file: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(records)) {
    console.error('\n❌ File must contain a JSON array of records');
    process.exit(1);
  }

  console.log(` Records: ${records.length}`);

  const { errors, warnings } = validate(records);

  if (warnings.length) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }

  if (errors.length) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
    printCoverageReport(records);
    console.log('\n❌ VALIDATION FAILED — fix errors before importing into app\n');
    process.exit(1);
  }

  printCoverageReport(records);
  console.log('\n✅ VALIDATION PASSED — file is ready to import into app\n');
  console.log(' Import steps:');
  console.log('   1. Open app: http://localhost:3456');
  console.log('   2. Go to "Enter Data" tab');
  console.log('   3. Click "Import JSON"');
  console.log('   4. Select this file\n');
}

main();
