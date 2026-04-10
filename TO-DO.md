# SD Elk Draw Analyzer — Comprehensive Plan

---

## 📊 Implementation Status (2026-04-10)

### ✅ Phase 1: Data Model & Core Engine
- `src/models/draw.ts` — All types including UserAccount
- `src/data/elk-units.ts` — 28 units + helpers
- `src/data/draw-pools.ts` — Pool configs + helpers
- `src/modules/odds-calculator.ts` — Core calculation engine
- **Tests**: 14/14 passing ✓

### ✅ Phase 2: Data Storage with Multi-User Support
- `src/hooks/useUserAccount.ts` — Account creation, deletion, switching
- `src/hooks/useDrawData.ts` — User-scoped draw record CRUD
- `src/hooks/useUserConfig.ts` — User-scoped preferences
- **Storage**: All data scoped per user under `sd-elk:*:{userId}` keys
- **Tests**: 10/10 passing ✓
- **Total**: 24 tests, 0 TypeScript errors

### ✅ Phase 3: App Layout & Navigation
- `src/App.tsx` — Main app with tab state, account init, onboarding
- `src/components/AppHeader.tsx` — Title, tab nav, account management UI
- `src/components/OddsTab.tsx` — My Odds tab shell with hooks integration
- `src/components/DataEntryTab.tsx` — Enter Data tab shell with CRUD UI
- **Build**: Production build passes ✓

### ✅ Phase 4: Odds Display & Calculation
- `src/components/UserInputPanel.tsx` — Preference points slider/input + tag type toggle
- `src/components/PoolIndicator.tsx` — Pool info, entries, tag allocation
- `src/components/OddsTable.tsx` — Odds calculation & display, sorted by best odds, historical columns, color coding
- Updated `OddsTab.tsx` to integrate all components
- **Features**:
  - Odds calculation for each unit based on user points
  - Color-coded odds (green ≥5%, yellow 2-5%, red <2%)
  - Historical year columns (2023, 2024, 2025)
  - "Lowest point drawn" indicator (red if user didn't draw)
  - Empty state with link to GFP data
- **Build**: Production build passes ✓

### ✅ Phase 5: Data Entry Form
- `src/components/AddRecordForm.tsx` — Full form with validation
  - Unit selector (all 28 units)
  - Year input (2020–current year)
  - Tag type toggle (Any Elk | Antlerless)
  - Dynamic pool management (1–3 pools)
  - Field-level validation with error display
  - Notes field for metadata
  - Add/Update/Cancel flow
- `src/components/RecordsList.tsx` — Record display & management
  - Grouped by unit name
  - Pool summary per record
  - Notes display
  - Edit/Delete buttons with confirmation
  - Add/update date tracking
- Updated `DataEntryTab.tsx` with full CRUD
  - Form show/hide toggle
  - Edit mode with pre-filled values
  - Import JSON files (replace or merge)
  - Export JSON with account name + date
  - Stats sidebar (record count, unique units, year range)
  - Data tips and guidance
- **Features**:
  - Full validation (required fields, numeric ranges)
  - Multi-pool support (add/remove pools)
  - File import with format validation
  - Clear all with confirmation
- **Build**: Production build passes ✓

### ✅ Phase 6: Live Odds Integration
- **Updated `OddsTab.tsx`** with dual hook integration:
  - `useDrawData(userId)` — reads all records for user
  - `useUserConfig(userId)` — reads/writes preference points + tag type
  - Both hooks load independently with loading states
- **Real-time Integration**:
  - UserInputPanel updates → localStorage → config hook updates
  - Config updates → PoolIndicator recalculates pool + entries
  - Config updates → OddsTable recalculates odds for all units
  - Tag type filter applies automatically to OddsTable
- **Filter Display**:
  - Results header shows active tag type filter
  - Only units matching user's tag type appear in OddsTable
- **Summary Stats**:
  - Your Points (from config)
  - Tag Type (from config)
  - Units Tracked (count from records)
- **Data Flow**:
  ```
  User adjusts slider/input (UserInputPanel)
    ↓
  setPreferencePoints(newValue) updates localStorage
    ↓
  useUserConfig hook detects change
    ↓
  OddsTab re-renders with new config
    ↓
  PoolIndicator recalculates with new points
    ↓
  OddsTable recalculates odds for all units
  ```
- **Build**: Production build passes ✓

### ✅ Phase 7: Testing & Refinement
- **Integration Tests** (`tests/integration/workflow.test.ts`) — 6 new tests
  - Account creation → data entry → odds calculation workflow
  - Multiple units with filtering by tag type
  - User preference updates with odds recalculation
  - Historical comparison across years
  - Graceful handling of empty data
  - Validation against known odds values
- **Performance Optimization**:
  - Memoized `OddsTable` — skips re-renders when props stable
  - Memoized `PoolIndicator` — skips recalculation when points unchanged
  - Memoized `RecordsList` — skips re-renders when records/callbacks stable
  - Result: Significant reduction in unnecessary calculations
- **Demo Data Fixture** (`src/data/demo-fixture.ts`):
  - 6 sample draw records (H1A, H3A, H11E, CSP, 9A)
  - 2023–2024 data with 3-pool pools
  - Realistic GFP statistics
  - Loadable on first user creation
  - Functions: `loadDemoData()`, `getDemoRecordCount()`, `getDemoUnitCount()`
- **Mobile Responsiveness**:
  - Tailwind CSS responsive classes throughout
  - Grid layouts use `grid-cols-1 sm:grid-cols-N` for mobile→desktop
  - Forms stack on mobile, multi-column on desktop
  - Buttons and inputs full-width on mobile
  - Font sizes responsive (text-sm → text-base at breakpoints)
- **Test Results**:
  - 30 tests passing (10 unit + 14 calculator + 6 integration)
  - 0 TypeScript errors
  - Production build: 229 kB (69 kB gzip)

### 🎯 MVP Complete! ✨
All core features working end-to-end:
- ✅ Multi-user accounts with data isolation
- ✅ Draw data entry with validation
- ✅ Real-time odds calculation
- ✅ Import/export functionality
- ✅ Historical trend analysis
- ✅ Responsive UI (mobile → desktop)
- ✅ Comprehensive test coverage
- ✅ Demo data for exploration

### 📋 Optional Enhancements (Phase 8+)
- [ ] Unit search/filter UI in OddsTable
- [ ] Scenario comparison (what-if analysis)
- [ ] Charts/visualization of odds trends
- [ ] Dark mode toggle
- [ ] PWA offline support
- [ ] Social sharing (odds links)
- [ ] State income tax modeling
- [ ] Advanced filtering (min/max odds, tag count)

---

## Context

The current app is a blank Vite + React + TypeScript scaffold with two working reference implementations (CLI and standalone HTML). The goal is to build a full web app that lets SD elk hunters calculate drawing odds based on their preference points, desired tag type, and historical data from 2023 onward.

**Key research findings:**
- SD elk is **resident-only** — non-residents cannot apply. Residency input is not needed and would be misleading.
- Cubed preference points formula confirmed: **(points + 1)³** — e.g., 11 pts = (11+1)³ = 1,728 entries. Implemented in 2018.
- GFP publishes draw stats at `license.gooutdoorssouthdakota.com/License/DrawStatistics` by year (2022–2026 available).
- Tag types published separately: **ONE ANY ELK** and **ONE ANTLERLESS ELK** per unit.
- Draw pools for elk (CSP reference): **15+ pool** (34% of tags), **10+ pool** (33%), **0+ pool** (33%).
- Data entry must be manual — no GFP API exists.

---

## Phase 1: Data Model & Core Engine

### 1.1 — TypeScript Models (`src/models/draw.ts`)

```typescript
type TagType = 'any_elk' | 'antlerless';
type PoolKey = '15plus' | '10plus' | '0plus';

interface PoolData {
  pool: PoolKey;           // which preference pool
  tagsAvailable: number;   // tags allocated to this pool
  applicants: number;      // applicants in this pool
  lowestPointDrawn: number | null; // null if not yet drawn
}

interface DrawRecord {
  id: string;              // crypto.randomUUID()
  unitName: string;        // e.g. "H1A" (always uppercased)
  year: number;            // e.g. 2023
  tagType: TagType;        // 'any_elk' | 'antlerless'
  pools: PoolData[];       // 1-3 pool entries (not all units have all 3 pools)
  notes?: string;          // optional free-text note
  addedDate: string;       // ISO timestamp
  updatedDate: string;     // ISO timestamp
}

interface UserConfig {
  preferencePoints: number; // 0–25
  tagType: TagType;
}

interface OddsResult {
  unitName: string;
  year: number;
  tagType: TagType;
  qualifyingPool: PoolKey;   // which pool the user falls into
  userEntries: number;       // (points+1)³
  tagsAvailable: number;
  applicants: number;
  lowestPointDrawn: number | null;
  oddsPercent: number;       // (userEntries / (applicants × avgEntries)) × 100 — see formula note
  historicalOdds: HistoricalOdds[];
}

interface HistoricalOdds {
  year: number;
  oddsPercent: number;
  applicants: number;
  tagsAvailable: number;
  lowestPointDrawn: number | null;
}
```

### 1.2 — Static Data (`src/data/elk-units.ts`)

Static list of all 28 SD elk units grouped by region:

```typescript
export const ELK_UNITS = {
  blackHills: ['H1A','H1B','H2A','H2B','H2E','H3A','H3B','H3C','H3D','H3E',
                'H4A','H4B','H5','H6A','H6B','H11A','H11B','H11C','H11D','H11E'],
  prairie: ['9A','11A','11B','15A','15B','27A','27B'],
  csp: ['CSP'],
} as const;

export type UnitName = typeof ELK_UNITS.blackHills[number] | ...;
```

### 1.3 — Pool Config (`src/data/draw-pools.ts`)

```typescript
export const DRAW_POOLS: Record<PoolKey, { label: string; minPoints: number; tagPct: number }> = {
  '15plus': { label: '15+ Pool', minPoints: 15, tagPct: 0.34 },
  '10plus': { label: '10+ Pool', minPoints: 10, tagPct: 0.33 },
  '0plus':  { label: '0+ Pool',  minPoints: 0,  tagPct: 0.33 },
};
```

### 1.4 — Calculation Engine (`src/modules/odds-calculator.ts`)

Core pure functions:

```typescript
// (points + 1)³ — confirmed GFP formula since 2018
export function calcEntries(points: number): number {
  return Math.pow(points + 1, 3);
}

// Which pool does this user qualify for?
export function getQualifyingPool(points: number): PoolKey {
  if (points >= 15) return '15plus';
  if (points >= 10) return '10plus';
  return '0plus';
}

// Odds approximation: user_entries / (applicants × avg_entries_in_pool) × 100
// Since GFP only publishes applicant count (not points distribution), we can't
// compute exact total entries. Best approximation uses pool midpoint avg entries.
// For 10+ pool: avg ≈ (10+14)/2 = 12 pts → (13)³ = 2197 avg entries per applicant
export function calcOdds(
  userPoints: number,
  pool: PoolKey,
  applicants: number
): number {
  const userEntries = calcEntries(userPoints);
  const avgEntries = calcAvgEntriesForPool(pool);
  const totalEntries = applicants * avgEntries;
  return totalEntries > 0 ? (userEntries / totalEntries) * 100 : 0;
}

// Pool midpoint average entries (approximation since GFP doesn't publish points distribution)
function calcAvgEntriesForPool(pool: PoolKey): number {
  const midpoints = { '15plus': 17, '10plus': 12, '0plus': 5 }; // tunable
  return calcEntries(midpoints[pool]);
}
```

**Important note:** This is an approximation. The existing CLI/HTML apps use `(userEntries / applicants) × 100` which implicitly assumes all other applicants have 1 entry — an overestimate of odds. The new formula uses pool midpoint entries which is more accurate. Display a "~" prefix to indicate approximate odds.

---

## Phase 2: Data Storage

### 2.1 — Persistence Hook (`src/hooks/useDrawData.ts`)

Custom hook wrapping localStorage under `sd-elk:draw-records` key.

```typescript
function useDrawData(): {
  records: DrawRecord[];
  addRecord: (r: Omit<DrawRecord, 'id' | 'addedDate' | 'updatedDate'>) => void;
  updateRecord: (id: string, updates: Partial<DrawRecord>) => void;
  deleteRecord: (id: string) => void;
  importRecords: (data: DrawRecord[]) => void;
  exportRecords: () => string; // JSON string
}
```

No Zod dependency needed — validate with a simple type guard on import.

### 2.2 — User Config Hook (`src/hooks/useUserConfig.ts`)

```typescript
function useUserConfig(): {
  config: UserConfig;
  setConfig: (c: UserConfig) => void;
}
```

Persists under `sd-elk:user-config`. Defaults to `{ preferencePoints: 11, tagType: 'any_elk' }`.

---

## Phase 3: App Layout & Navigation

Two-tab layout (no router needed — simple state-based tabs):

```
┌─────────────────────────────────────────┐
│  🦌  SD Elk Draw Analyzer              │
│  [My Odds]  [Enter Data]               │ ← tab nav
├─────────────────────────────────────────┤
│  Tab content here                       │
└─────────────────────────────────────────┘
```

**Tab 1: My Odds** — User inputs + results table
**Tab 2: Enter Data** — Data entry form for GFP stats

### Component Tree

```
App
├── AppHeader (title, tab nav)
├── OddsTab (active when tab=odds)
│   ├── UserInputPanel (preference points slider/input + tag type toggle)
│   ├── PoolIndicator (shows which pool user qualifies for + % of tags)
│   ├── OddsTable (results sorted by odds %, with historical columns)
│   │   └── UnitRow (per unit: name, odds, tags, applicants, lowest pt, trend)
│   └── EmptyState (when no data entered yet)
└── DataEntryTab (active when tab=data)
    ├── AddRecordForm
    │   ├── unit name (searchable select from ELK_UNITS)
    │   ├── year (2023–current year select)
    │   ├── tag type (any elk / antlerless toggle)
    │   └── PoolInputGroup (repeated per pool: tags, applicants, lowest pt)
    ├── RecordsList (existing entries, grouped by unit+year+tagType)
    │   └── RecordRow (edit/delete per row)
    └── ImportExportBar (import JSON / export JSON buttons)
```

---

## Phase 4: Odds Tab — Display Logic

### UserInputPanel (`src/components/UserInputPanel.tsx`)
- Preference points: number input (0–25) + optional slider
- Tag type: toggle button (Any Elk | Antlerless)
- Shows: "Your entries: X,XXX | Pool: 10+ (33% of tags)"

### OddsTable (`src/components/OddsTable.tsx`)

Columns:
| Unit | Year | Tags | Applicants | Lowest Pt | Your Odds | 2023 | 2024 | 2025 |
|------|------|------|------------|-----------|-----------|------|------|------|

- Sorted by odds descending (best odds first)
- Color coding: >5% green, 2–5% yellow, <2% red
- "~" prefix on all odds to indicate approximation
- If multiple years exist: show each year's odds + latest year highlighted
- Filter: only show units matching selected tag type + that have qualifying pool data

### PoolIndicator (`src/components/PoolIndicator.tsx`)

```
┌───────────────────────────────────────┐
│  11 pts → 10+ Pool  (33% of tags)    │
│  Your entries: 1,728                  │
└───────────────────────────────────────┘
```

---

## Phase 5: Data Entry Tab

### AddRecordForm (`src/components/AddRecordForm.tsx`)

Step 1 — Select unit, year, tag type
Step 2 — Enter pool data for each applicable pool:

```
Pool: [ 15+ Pool ▼ ]  Tags: [___]  Applicants: [___]  Lowest Pt: [___]
Pool: [ 10+ Pool ▼ ]  Tags: [___]  Applicants: [___]  Lowest Pt: [___]
Pool: [  0+ Pool ▼ ]  Tags: [___]  Applicants: [___]  Lowest Pt: [___]

[ + Add Another Pool ]   [ Save Record ]
```

- Validates: no duplicate unit+year+tagType combo
- Allows 1-3 pools per record
- Units that only have one pool (many prairie units) only need one row

### RecordsList (`src/components/RecordsList.tsx`)
- Grouped by unit name
- Shows year, tag type, pool count
- Edit (loads into form) and Delete buttons

### ImportExportBar (`src/components/ImportExportBar.tsx`)
- Export: downloads `sd-elk-draw-data-[date].json`
- Import: file picker, validates structure, merges or replaces

---

## Phase 6: File Structure to Create

```
src/
  models/
    draw.ts              — DrawRecord, PoolData, UserConfig, OddsResult types
  data/
    elk-units.ts         — ELK_UNITS constant, UnitName type
    draw-pools.ts        — DRAW_POOLS config (label, minPoints, tagPct)
  modules/
    odds-calculator.ts   — calcEntries, getQualifyingPool, calcOdds
  hooks/
    useDrawData.ts       — localStorage CRUD for DrawRecord[]
    useUserConfig.ts     — localStorage for UserConfig
  components/
    AppHeader.tsx        — title bar + tab navigation
    UserInputPanel.tsx   — preference points input + tag type toggle
    PoolIndicator.tsx    — shows qualifying pool + entries
    OddsTable.tsx        — main results table with historical columns
    UnitRow.tsx          — single row in odds table
    AddRecordForm.tsx    — data entry form
    RecordsList.tsx      — list of entered records
    ImportExportBar.tsx  — import/export buttons
  App.tsx                (replace placeholder with tab routing)
```

---

## Phase 7: Implementation Order

1. **Models & data** — `draw.ts`, `elk-units.ts`, `draw-pools.ts`
2. **Calculator** — `odds-calculator.ts` + unit tests
3. **Hooks** — `useDrawData.ts`, `useUserConfig.ts`
4. **App shell** — `App.tsx` tab layout, `AppHeader.tsx`
5. **Data Entry tab** — `AddRecordForm.tsx`, `RecordsList.tsx`, `ImportExportBar.tsx`
6. **Odds tab** — `UserInputPanel.tsx`, `PoolIndicator.tsx`, `OddsTable.tsx`, `UnitRow.tsx`
7. **Install missing deps** — Tailwind CSS + PostCSS (likely already in node_modules but not in package.json)

---

## Key Decisions & Notes

1. **No residency input** — SD elk is resident-only (confirmed by GFP). Adding this input would be misleading. Note this in the UI.

2. **Odds are approximate** — Since GFP only publishes applicant counts (not per-point distribution), true odds require knowing total entries in the pool. The app uses pool midpoint averages to estimate total competing entries. Display "~" to indicate approximation.

3. **Pool eligibility per unit** — Not all units have all 3 pools. The data entry form allows flexible pool selection per unit. The odds calculation only shows the pool the user qualifies for.

4. **Historical columns** — The OddsTable shows a column per year (2023, 2024, 2025, etc.) so trends are visible at a glance without needing a separate chart.

5. **No charting library needed** — Historical comparison via table columns is sufficient and simpler. Can add a chart later if needed.

6. **localStorage key namespace** — Use `sd-elk:` prefix (not `elkDrawData` from the standalone HTML app) to avoid conflicts.

---

## Verification

After implementation:
```bash
pnpm typecheck    # 0 TypeScript errors
pnpm test         # unit tests for odds-calculator pass
pnpm dev          # app loads at http://localhost:3333
```

Manual test flow:
1. Open app → "My Odds" tab shows empty state
2. Switch to "Enter Data" → add H1A / 2024 / Any Elk with 10+ pool data
3. Switch to "My Odds" → enter 11 preference points, Any Elk → H1A appears with odds
4. Add 2023 data for H1A → historical 2023 column appears in table
5. Export JSON → re-import → data restored correctly
