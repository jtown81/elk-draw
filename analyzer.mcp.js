#!/usr/bin/env node

/**
 * South Dakota Elk Draw Analyzer
 * Interactive CLI tool for analyzing elk draw odds with preference points
 * 11 Preference Points Edition
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Data file location
const DATA_FILE = path.join(process.cwd(), 'elk-draw-data.json');

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Preference points configuration
const PREFERENCE_POINTS = 11;
const CUBED_ENTRIES = Math.pow(PREFERENCE_POINTS + 1, 3); // (11+1)^3 = 1728

/**
 * Prompt user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Load data from JSON file
 */
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`${colors.red}Error loading data:${colors.reset}`, error.message);
  }
  return [];
}

/**
 * Save data to JSON file
 */
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`${colors.green}✓ Data saved${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error saving data:${colors.reset}`, error.message);
  }
}

/**
 * Calculate odds based on preference points and applicants
 */
function calculateOdds(cubedEntries, totalApplicants) {
  if (totalApplicants === 0) return 0;
  return ((cubedEntries / totalApplicants) * 100).toFixed(2);
}

/**
 * Calculate cubed entries from preference points
 */
function calculateCubedEntries(points) {
  return Math.pow(points + 1, 3);
}

/**
 * Display main menu
 */
function showMenu() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}  South Dakota Elk Draw Analyzer${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}  Preference Points: ${PREFERENCE_POINTS}  |  Entries: ${CUBED_ENTRIES}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.yellow}[1]${colors.reset} Add Unit Data`);
  console.log(`${colors.yellow}[2]${colors.reset} View All Data`);
  console.log(`${colors.yellow}[3]${colors.reset} Calculate & Results`);
  console.log(`${colors.yellow}[4]${colors.reset} Show Recommendations`);
  console.log(`${colors.yellow}[5]${colors.reset} Delete Unit`);
  console.log(`${colors.yellow}[6]${colors.reset} Export Data`);
  console.log(`${colors.yellow}[7]${colors.reset} Import Data`);
  console.log(`${colors.yellow}[8]${colors.reset} Clear All Data`);
  console.log(`${colors.yellow}[9]${colors.reset} Help`);
  console.log(`${colors.yellow}[0]${colors.reset} Exit\n`);
}

/**
 * Add unit data
 */
async function addUnitData() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Add Unit Data${colors.reset}\n`);

  const data = loadData();

  const unitName = await prompt(`Unit Name (e.g., H1A): `);
  const year = await prompt(`Year (e.g., 2026): `);
  const tags = await prompt(`Number of Tags: `);
  const apps10Plus = await prompt(`Applicants in 10+ Pool: `);
  const lowestPoint = await prompt(`Lowest Point Drawn: `);

  const odds = calculateOdds(CUBED_ENTRIES, parseInt(apps10Plus));

  const entry = {
    id: Date.now(),
    unitName: unitName.toUpperCase(),
    year: parseInt(year),
    tags: parseInt(tags),
    apps10Plus: parseInt(apps10Plus),
    lowestPoint: parseInt(lowestPoint),
    odds: parseFloat(odds),
    addedDate: new Date().toISOString(),
  };

  data.push(entry);
  saveData(data);
  console.log(`\n${colors.green}✓ Unit data added successfully${colors.reset}`);
  await prompt(`\nPress Enter to continue...`);
}

/**
 * View all data
 */
async function viewAllData() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}All Unit Data${colors.reset}\n`);

  const data = loadData();

  if (data.length === 0) {
    console.log(`${colors.yellow}No data entered yet${colors.reset}`);
  } else {
    data.forEach((unit, index) => {
      console.log(
        `${colors.bright}${index + 1}. ${unit.unitName}${colors.reset} (${unit.year})`
      );
      console.log(
        `   Tags: ${unit.tags} | Apps (10+): ${unit.apps10Plus} | Lowest: ${unit.lowestPoint}`
      );
      console.log(`   ${colors.green}Your Odds: ${unit.odds}%${colors.reset}`);
      console.log(`   Added: ${new Date(unit.addedDate).toLocaleDateString()}\n`);
    });
  }

  await prompt(`Press Enter to continue...`);
}

/**
 * Calculate and show results
 */
async function calculateResults() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Calculate & Results${colors.reset}\n`);

  const data = loadData();

  if (data.length === 0) {
    console.log(`${colors.yellow}No data to analyze${colors.reset}`);
    await prompt(`\nPress Enter to continue...`);
    return;
  }

  // Sort by odds (highest first)
  const sorted = [...data].sort((a, b) => b.odds - a.odds);

  console.log(
    `${colors.bright}Your Preference Points: ${PREFERENCE_POINTS}  |  Entries: ${CUBED_ENTRIES}${colors.reset}\n`
  );
  console.log(`${colors.bright}Unit${colors.reset}  | ${colors.bright}Year${colors.reset} | ${colors.bright}Tags${colors.reset} | ${colors.bright}Apps (10+)${colors.reset} | ${colors.bright}Your Odds${colors.reset}`);
  console.log(`─────────────────────────────────────────────────────────`);

  sorted.forEach((unit) => {
    const odds = unit.odds > 5 ? colors.green : unit.odds > 2 ? colors.yellow : colors.red;
    console.log(
      `${unit.unitName.padEnd(6)} | ${unit.year} | ${String(unit.tags).padStart(4)} | ${String(unit.apps10Plus).padStart(9)} | ${odds}${unit.odds.toFixed(2)}%${colors.reset}`
    );
  });

  console.log(`\n${colors.dim}Green: >5% | Yellow: 2-5% | Red: <2%${colors.reset}`);
  await prompt(`\nPress Enter to continue...`);
}

/**
 * Show recommendations
 */
async function showRecommendations() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Top 5 Recommendations${colors.reset}\n`);

  const data = loadData();

  if (data.length === 0) {
    console.log(`${colors.yellow}No data to analyze${colors.reset}`);
    await prompt(`\nPress Enter to continue...`);
    return;
  }

  const sorted = [...data].sort((a, b) => b.odds - a.odds);
  const top5 = sorted.slice(0, 5);

  console.log(`${colors.bright}Best Units for You (based on odds):${colors.reset}\n`);

  top5.forEach((unit, index) => {
    console.log(
      `${colors.green}${index + 1}. ${unit.unitName}${colors.reset} - ${colors.bright}${unit.odds}%${colors.reset} odds`
    );
    console.log(
      `   ${unit.tags} tags | ${unit.apps10Plus} applicants in 10+ pool`
    );
    console.log(`   Lowest point drawn: ${unit.lowestPoint}\n`);
  });

  await prompt(`Press Enter to continue...`);
}

/**
 * Delete unit data
 */
async function deleteUnit() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Delete Unit${colors.reset}\n`);

  const data = loadData();

  if (data.length === 0) {
    console.log(`${colors.yellow}No data to delete${colors.reset}`);
    await prompt(`\nPress Enter to continue...`);
    return;
  }

  data.forEach((unit, index) => {
    console.log(`${colors.yellow}[${index + 1}]${colors.reset} ${unit.unitName} (${unit.year})`);
  });

  const choice = await prompt(`\nEnter unit number to delete (0 to cancel): `);
  const index = parseInt(choice) - 1;

  if (choice === '0') {
    console.log(`${colors.yellow}Cancelled${colors.reset}`);
  } else if (index >= 0 && index < data.length) {
    const removed = data.splice(index, 1);
    saveData(data);
    console.log(`${colors.green}✓ Deleted ${removed[0].unitName}${colors.reset}`);
  } else {
    console.log(`${colors.red}Invalid selection${colors.reset}`);
  }

  await prompt(`\nPress Enter to continue...`);
}

/**
 * Export data
 */
async function exportData() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Export Data${colors.reset}\n`);

  const data = loadData();

  if (data.length === 0) {
    console.log(`${colors.yellow}No data to export${colors.reset}`);
    await prompt(`\nPress Enter to continue...`);
    return;
  }

  const filename = `elk-draw-export-${new Date().toISOString().split('T')[0]}.json`;
  const exportPath = path.join(process.cwd(), filename);

  try {
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    console.log(`${colors.green}✓ Data exported to: ${filename}${colors.reset}`);
    console.log(`${colors.dim}Location: ${exportPath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error exporting data:${colors.reset}`, error.message);
  }

  await prompt(`\nPress Enter to continue...`);
}

/**
 * Import data
 */
async function importData() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Import Data${colors.reset}\n`);

  const filename = await prompt(`Enter filename to import: `);
  const importPath = path.join(process.cwd(), filename);

  try {
    if (!fs.existsSync(importPath)) {
      throw new Error(`File not found: ${filename}`);
    }

    const data = JSON.parse(fs.readFileSync(importPath, 'utf8'));

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format (must be an array)');
    }

    saveData(data);
    console.log(`${colors.green}✓ Data imported successfully (${data.length} entries)${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error importing data:${colors.reset}`, error.message);
  }

  await prompt(`\nPress Enter to continue...`);
}

/**
 * Clear all data
 */
async function clearAllData() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Clear All Data${colors.reset}\n`);
  console.log(`${colors.red}${colors.bright}WARNING: This will delete all stored data${colors.reset}\n`);

  const confirm = await prompt(`Type "yes" to confirm: `);

  if (confirm.toLowerCase() === 'yes') {
    saveData([]);
    console.log(`${colors.green}✓ All data cleared${colors.reset}`);
  } else {
    console.log(`${colors.yellow}Cancelled${colors.reset}`);
  }

  await prompt(`\nPress Enter to continue...`);
}

/**
 * Show help
 */
async function showHelp() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}Help & Information${colors.reset}\n`);
  console.log(`${colors.bright}About Your Preference Points:${colors.reset}`);
  console.log(`- You have ${PREFERENCE_POINTS} preference points`);
  console.log(`- This equals ${CUBED_ENTRIES} entries in the 10+ point pool`);
  console.log(`- Calculation: (${PREFERENCE_POINTS} + 1)³ = ${CUBED_ENTRIES}\n`);
  console.log(`${colors.bright}How to Use:${colors.reset}`);
  console.log(`1. Visit: https://license.gooutdoorssouthdakota.com/License/DrawStatistics`);
  console.log(`2. Find your desired elk units`);
  console.log(`3. Note the statistics for each unit`);
  console.log(`4. Use Menu [1] to add each unit's data`);
  console.log(`5. Use Menu [3] to see your odds\n`);
  console.log(`${colors.bright}Data Storage:${colors.reset}`);
  console.log(`- Data is saved to: elk-draw-data.json`);
  console.log(`- Located in: ${process.cwd()}\n`);
  console.log(`${colors.bright}Export/Import:${colors.reset}`);
  console.log(`- Use [6] to export your data`);
  console.log(`- Use [7] to import from another file\n`);
  console.log(`${colors.bright}Need Help?${colors.reset}`);
  console.log(`- Check the documentation files`);
  console.log(`- GFP Website: https://gfp.sd.gov/elk/`);
  console.log(`- Support: 605-223-7660\n`);

  await prompt(`Press Enter to continue...`);
}

/**
 * Main application loop
 */
async function main() {
  let running = true;

  while (running) {
    showMenu();
    const choice = await prompt(`${colors.cyan}Select option:${colors.reset} `);

    switch (choice) {
      case '1':
        await addUnitData();
        break;
      case '2':
        await viewAllData();
        break;
      case '3':
        await calculateResults();
        break;
      case '4':
        await showRecommendations();
        break;
      case '5':
        await deleteUnit();
        break;
      case '6':
        await exportData();
        break;
      case '7':
        await importData();
        break;
      case '8':
        await clearAllData();
        break;
      case '9':
        await showHelp();
        break;
      case '0':
        console.log(`\n${colors.cyan}Thank you for using the SD Elk Draw Analyzer${colors.reset}\n`);
        running = false;
        break;
      default:
        console.log(`${colors.red}Invalid option${colors.reset}`);
        await prompt(`Press Enter to continue...`);
    }
  }

  rl.close();
}

// Start application
main();
