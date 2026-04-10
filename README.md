# South Dakota Elk Draw Analyzer

An interactive tool for analyzing South Dakota elk draw odds with 11 preference points.

## Features

- **CLI Tool** (`analyzer.mcp.js`) - Interactive terminal application
- **Web App** (`sd-elk-draw-analyzer.html`) - Browser-based interface
- **Data Persistence** - Auto-save to JSON
- **Odds Calculation** - Cubed preference points formula: (11+1)³ = 1,728 entries
- **Export/Import** - Share and load data files
- **Recommendations** - Top 5 units ranked by odds
- **Cross-Platform** - Works on Mac, Linux, Windows

## Quick Start

### Terminal Version

```bash
node analyzer.mcp.js
```

Follow the interactive menu to:
1. Add unit data from GFP statistics
2. View all entries
3. Calculate your odds
4. See top recommendations
5. Export/import data

### Web Version

Open `sd-elk-draw-analyzer.html` in your browser.

## Data Format

Data is stored in `elk-draw-data.json` as a JSON array:

```json
[
  {
    "id": 1234567890,
    "unitName": "H1A",
    "year": 2026,
    "tags": 30,
    "apps10Plus": 4320,
    "lowestPoint": 11,
    "odds": 40.00,
    "addedDate": "2026-01-15T10:20:00.000Z"
  }
]
```

## Draw System

- **Your Points**: 11
- **Your Pool**: 10+ (33% of tags)
- **Your Entries**: 1,728
- **Odds Formula**: (1,728 ÷ Total 10+ Applicants) × 100

## Resources

- [GFP Draw Statistics](https://license.gooutdoorssouthdakota.com/License/DrawStatistics)
- [Preference Points Info](https://gfp.sd.gov/preference-points/)
- [Elk Information](https://gfp.sd.gov/elk/)
- GFP Support: 605-223-7660

## Menu Options (CLI)

- `[1]` Add Unit Data
- `[2]` View All Data
- `[3]` Calculate & Results
- `[4]` Show Recommendations
- `[5]` Delete Unit
- `[6]` Export Data
- `[7]` Import Data
- `[8]` Clear All Data
- `[9]` Help
- `[0]` Exit
