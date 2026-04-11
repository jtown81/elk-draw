# ✅ UI Redesign Plan — SD Elk Draw Analyzer (COMPLETE)

**Status:** Phase 1-5 Complete | Build: ✅ Passing | TypeScript: ✅ Clean

**Aesthetic Direction: "Black Hills Backcountry"**

A premium outdoor/tactical feel inspired by Sitka Gear / KUIU brand meets a field ops dashboard.
Dark forest greens (#0d1a12) + warm amber/gold accents (#c97d28, #e8a542) + deep charcoal backgrounds.
Bold condensed typography (Bebas Neue, Oswald, Cabin, JetBrains Mono) with tactile controls,
subtle topographic texture, and mobile-first responsive design.

---

## Design System

### Color Palette (CSS Variables)
```
--color-bg:         #0d1a12   /* near-black forest — page background */
--color-surface:    #162110   /* dark green — primary card/panel surface */
--color-surface-2:  #1e2e1a   /* slightly lighter — nested panels, inputs */
--color-border:     #2e4a2a   /* muted green — dividers and borders */
--color-sage:       #4d8a62   /* mid-green — secondary UI chrome */
--color-meadow:     #7dbf94   /* light green — success, positive indicators */
--color-amber:      #c97d28   /* warm amber — primary actions, CTAs */
--color-gold:       #e8a542   /* bright gold — highlights, best-odds callouts */
--color-cream:      #ede8d6   /* warm white — primary body text */
--color-parchment:  #b8ad92   /* tan — secondary/muted text */
--color-bark:       #7a5230   /* brown — earth accent */
--color-danger:     #c0392b   /* red — errors, low odds */
--color-warn:       #d4821a   /* orange — warnings, fair odds */
```

### Typography
All fonts loaded from Google Fonts (no install required — add `<link>` to `index.html`):

| Role              | Font             | Usage                             |
|-------------------|------------------|-----------------------------------|
| Brand / Display   | Bebas Neue       | App title, hero numbers           |
| Headings / Stats  | Oswald           | Section headers, metric values    |
| Body              | Cabin            | Labels, descriptions, form text   |
| Monospace / Data  | JetBrains Mono   | Odds %, applicant counts          |

### Spacing & Radius
- Base unit: 4px grid
- Card border radius: 8px (mobile) / 10px (desktop)
- Button radius: 6px
- Input radius: 6px

---

## Ad Placeholder System

### New Component: `src/components/ads/AdPlaceholder.tsx`
Reusable ad slot with labeled placeholder appearance. Accepts `size` prop:

| Size variant | Mobile dimensions | Desktop dimensions | Placement          |
|--------------|-------------------|--------------------|--------------------|
| `banner`     | 320×50px          | 728×90px           | Top (below header) |
| `rectangle`  | 300×100px         | 300×250px          | Mid-content        |
| `sidebar`    | hidden            | 300×600px          | Right rail         |
| `leaderboard`| 320×50px          | 728×90px           | Footer             |

Placeholder renders a dashed-border box with "Advertisement" label (easily swapped for
real ad tags later). Include a `data-ad-slot` attribute for future integration.

### Ad Placement Map
```
[ HEADER — brand + nav ]
[ AD: banner — 728×90 desktop / 320×50 mobile ]
[ MY ODDS TAB CONTENT ]
  [ UserInputPanel ]
  [ AD: rectangle — between panel and table ]
  [ PoolIndicator ]
  [ OddsTable ]
  [ AD: leaderboard — below table ]
  [ desktop sidebar: AD sidebar 300×600 floated right of OddsTable ]

[ DATA TAB CONTENT ]
  [ DrawDataTable (read-only) ]
  [ AD: rectangle — below table ]
  [ desktop sidebar: AD sidebar 300×600 floated right ]
```

---

## Implementation Tasks

### Phase 1 — Foundation (Do First) ✅ COMPLETE

- [x] **1.1 Google Fonts**
  - Update `index.html` to add Google Fonts `<link>`:
    `Bebas+Neue`, `Oswald:wght@300;400;600`, `Cabin:wght@400;500;600`, `JetBrains+Mono:wght@400;500`
  - Add `display=swap` parameter

- [x] **1.2 Design System CSS**
  - Replace `src/index.css` entirely with new design system:
    - All CSS variables above (`--color-*`, `--font-*`, `--radius-*`)
    - Base styles: `body { background: var(--color-bg); color: var(--color-cream); font-family: 'Cabin', sans-serif; }`
    - Utility classes: `.font-display`, `.font-heading`, `.font-mono`, `.text-amber`, `.text-gold`, `.text-sage`, `.text-parchment`
    - Custom scrollbar styles (thin, forest-colored)
    - Range input custom styling (amber thumb, dark track)
    - Select/input dark theme base styles
    - Tailwind `@layer base` overrides for form elements

- [x] **1.3 Tailwind Config**
  - Update `tailwind.config.js` to add custom colors, fonts, and extend theme with design tokens
  - Register `forest`, `grove`, `canopy`, `amber`, `gold`, `cream`, `bark`, `sage`, `meadow` as Tailwind colors

- [x] **1.4 Ad Placeholder Component**
  - Create `src/components/ads/AdPlaceholder.tsx`
  - Props: `size: 'banner' | 'rectangle' | 'sidebar' | 'leaderboard'`, optional `className`
  - Renders responsive dashed placeholder with "AD" label
  - Hidden on small screens when `size === 'sidebar'`

---

### Phase 2 — App Shell ✅ COMPLETE

- [x] **2.1 App.tsx — Loading Screen**
  - Replace gray loading screen with dark theme
  - Center a stylized elk antler SVG (inline, no asset needed) or bold "SD ELK DRAW" text
  - Add subtle pulsing amber dot below the text
  - Dark forest background

- [x] **2.2 App.tsx — Onboarding Screen**
  - Full-screen dark panel with Black Hills topographic texture (CSS radial gradient pattern)
  - Large "SOUTH DAKOTA ELK DRAW ANALYZER" in Bebas Neue
  - Subheading: "Track your odds. Know your draw." in Cabin italic
  - Amber CTA button: "GET STARTED →"
  - Privacy note in parchment color at bottom
  - Center-aligned, max-width 480px, padding for mobile

- [x] **2.3 AppHeader.tsx — Full Redesign**
  - **Desktop**: sticky top bar, dark forest background
    - Left: brand mark — "🦌" icon + "ELK DRAW" in Bebas Neue (24px) + "ANALYZER" in Oswald light (12px letter-spaced)
    - Center: tab navigation — "MY ODDS" | "DATA" as pill buttons with amber active state
    - Right: hunter avatar initial + name, dropdown account menu
  - **Mobile**: two-piece layout
    - Top bar: brand mark + active account name (compact)
    - Bottom tab bar: fixed to viewport bottom — "MY ODDS" tab left, "DATA" tab right, amber indicator line on active tab
  - Account dropdown: dark surface-2 panel with sage border, list accounts with active dot, rename/delete on swipe or hover
  - Remove `prompt()` / `confirm()` dialogs — replace with inline rename input + trash icon with inline confirmation in the dropdown
  - Animate dropdown: slide down from top (CSS transform)

---

### Phase 3 — My Odds Tab ✅ COMPLETE

- [x] **3.1 OddsTab.tsx**
  - Insert `<AdPlaceholder size="banner" />` directly below section heading (before UserInputPanel)
  - Insert `<AdPlaceholder size="rectangle" />` between PoolIndicator and OddsTable
  - Desktop: two-column layout — main content 2/3 width + `<AdPlaceholder size="sidebar" />` 1/3 width right rail (sticky)
  - Loading state: dark background with amber spinner (CSS border animation)
  - Remove empty state "Go to Enter Data" CTA — data is always preloaded, this state won't occur

- [x] **3.2 UserInputPanel.tsx**
  - Dark surface card (var --color-surface)
  - Section heading: "YOUR SETUP" in Oswald, amber underline accent
  - Preference points slider:
    - Custom CSS range input: amber thumb (#c97d28), dark track, filled segment via gradient
    - Large point display: "11 PTS" in Bebas Neue (48px), centered above slider
    - Remove the separate number input field — the slider IS the input (cleaner mobile UX)
    - Labels: 0 and 25 endpoints shown below track
  - Tag type toggle: segmented control, not two separate buttons
    - Pill container with dark background; active segment slides (CSS transition) under "Any Elk" / "Antlerless"
    - Active: amber background, cream text; inactive: transparent, parchment text
  - Pool + entries summary: four metric tiles in 2x2 grid
    - Dark surface-2 background, amber value text in Oswald, parchment label in Cabin small

- [x] **3.3 PoolIndicator.tsx**
  - Merged into UserInputPanel metric tiles (reduce visual noise / card stacking on mobile)

- [x] **3.4 OddsTable.tsx**
  - **Mobile view** (< 768px): card list instead of table
    - Each unit = one dark surface card
    - Large unit name in Oswald, odds % in Bebas Neue (big, color-coded)
    - Tags / Applicants / Lowest Pt as small labeled rows inside card
    - Historical years in a collapsed "History" toggle (chevron button)
    - Color coding: ≥5% = gold, 2-5% = amber, <2% = danger red — applied as left border stripe + text color
  - **Desktop view** (≥ 768px): traditional table layout (dark header, alternating row shading)
    - Header: surface-2 background, Oswald font, uppercase
    - Odds % cell: large Bebas Neue, colored pill badge
    - Historical columns: muted, smaller text, JetBrains Mono
  - Legend styled as an inline strip
  - Top 3 best-odds rows get a gold left-border highlight ("TOP PICK")

---

### Phase 4 — Data Tab (read-only, replaces Enter Data) ✅ COMPLETE

The Enter Data tab is removed. Data is fully preloaded from the bundled seed — manual
entry is unnecessary and any runtime changes would reset on reload. The new Data tab
surfaces the full dataset so hunters can browse and verify what's in the app.

- [x] **4.1 Rename/repurpose tab in App.tsx and AppHeader.tsx**
  - Change `TabName` type: `'odds' | 'data'` (was `'odds' | 'data'` — no change to type,
    but update all display labels from "Enter Data" → "Data")
  - Update `AppHeader` tab labels: "MY ODDS" and "DATA"

- [x] **4.2 Replace DataEntryTab.tsx with DrawDataTab.tsx**
  - New component: `src/components/DrawDataTab.tsx`
  - Remove `AddRecordForm`, edit/delete controls, import/import, clearAll — no mutations
  - Layout:
    - Header: "DRAW DATA" in Oswald + subtitle "GFP statistics loaded for [N] unit-year records"
    - Data last updated badge: "Last updated: April 2026" (hardcoded string, update with each seed refresh)
    - Export button (single action retained — useful for power users / sharing): amber ghost button top-right
    - `<AdPlaceholder size="rectangle" />` below header, above table
    - Desktop right rail: `<AdPlaceholder size="sidebar" />`
  - Table/cards: reuse `DrawDataTable` (see 4.3)

- [x] **4.3 New component: DrawDataTable.tsx**
  - Read-only view of all seed records
  - **Grouping controls** (top of table): filter by tag type toggle ("Any Elk" | "Antlerless"),
    sort by unit name or year (dropdown or toggle buttons)
  - **Mobile**: card-per-unit layout (same pattern as OddsTable mobile cards)
    - Unit name in Oswald, year badge, tag type pill
    - Pool rows listed with: pool label, tags available, applicants, lowest point drawn
    - Subtle sage left-border on each pool row to distinguish pools visually
  - **Desktop**: grouped table with rowspan
    - Columns: Unit | Year | Tag Type | Pool | Tags | Applicants | Lowest Pt
    - Unit + Year span multiple rows (rowspan) when a record has multiple pools
    - Alternating row shading (surface / surface-2)
    - Header in Oswald uppercase, numbers in JetBrains Mono
  - No edit/delete/add controls anywhere in this view
  - Sorted by unit name ascending by default

- [ ] **4.4 Delete orphaned components** (Optional cleanup)
  - Remove `src/components/DataEntryTab.tsx`
  - Remove `src/components/AddRecordForm.tsx`
  - Remove `src/components/RecordsList.tsx`
  - These files have no remaining usages once DrawDataTab replaces DataEntryTab

---

### Phase 5 — Polish & Quality ✅ COMPLETE

- [x] **5.1 Micro-interactions**
  - Tab switching: CSS fade-in (opacity 0→1, translateY 4px→0, 150ms ease)
  - Card hover: subtle translateY(-1px) lift with shadow deepening
  - Button press: scale(0.97) active state
  - Slider drag: amber thumb grows slightly on active state
  - Loading spinner: rotating border animation using amber color
  - Smooth transitions on all interactive elements

- [x] **5.2 Mobile Accessibility**
  - Minimum touch target: 44×44px for all interactive elements
  - Bottom nav tabs: 56px height minimum
  - Account dropdown: large tap targets for rename/delete
  - Range slider: 44px height hit area with padding
  - Keyboard focus visibility with gold outline
  - ARIA labels and roles for tab navigation
  - Support for prefers-reduced-motion
  - Support for prefers-contrast: more

- [x] **5.3 Responsive Breakpoints**
  - `sm` (640px+): Two-column stats grids, better padding
  - `md` (768px+): Table view for odds, sidebar for data management
  - `lg` (1024px+): Ad sidebar column appears, max-width content center
  - `xl` (1280px+): Wider ad sidebars, more breathing room
  - Print styles: hide nav and ads

- [x] **5.4 Background Texture**
  - Added subtle topographic contour line texture using repeating-linear-gradient
  - Very faint cream lines (~2-3% opacity) over dark forest background
  - Applied to html::before pseudo-element for non-intrusive effect
  - Cards maintain solid surface color (no texture overlay)

- [x] **5.5 Empty States**
  - All empty states: centered in dark card with consistent styling
  - `.empty-state` class with icon, title, description
  - Applied to OddsTab, OddsTable, DrawDataTable with proper ARIA labels
  - Consistent icon, typography, and layout across all empty states

- [x] **5.6 Remove `prompt()` / `confirm()` Dialogs**
  - Account creation (onboarding): inline name input field (removed prompt)
  - Account creation (header): inline expandable input row in dropdown (removed prompt)
  - Delete confirmations: inline popup with [Cancel] [Delete] buttons (removed confirm)
  - No native dialogs anywhere in the app

---

## File Change Summary

### Modified Files
| File | Changes |
|------|---------|
| `index.html` | Added Google Fonts `<link>` tags with preconnect |
| `src/index.css` | Full rewrite: design tokens, micro-interactions, accessibility, texture, empty states, responsive utilities |
| `tailwind.config.js` | Extended theme: custom colors (forest, surface, sage, amber, gold, cream, parchment, bark, danger, warn, border), custom fonts (display, heading, body, mono), border radius |
| `src/App.tsx` | Dark theme loading screen, topographic onboarding panel, inline account creation, DrawDataTab integration |
| `src/components/AppHeader.tsx` | Full redesign: sticky top bar (desktop), mobile bottom nav, dark surface colors, inline account management, ARIA labels |
| `src/components/OddsTab.tsx` | Dark theme, ad slot integration (banner, rectangle, leaderboard), responsive layout, updated empty state |
| `src/components/UserInputPanel.tsx` | Dark surface card, custom range slider, large display, segmented toggle, 4 metric tiles, improved spacing |
| `src/components/OddsTable.tsx` | Mobile cards + desktop table, color-coded odds (gold/amber/red), collapsible history, TOP PICK badges, legend |
| `src/components/DrawDataTable.tsx` | Mobile cards + desktop table with rowspan, tag type filter, sort controls, color-coded pool rows |

### New Files
| File | Purpose |
|------|---------|
| `src/components/ads/AdPlaceholder.tsx` | Reusable responsive ad slot component (banner, rectangle, sidebar, leaderboard) |
| `src/components/DrawDataTab.tsx` | Read-only seed data tab with export, stats, and ad integration |
| `src/components/DrawDataTable.tsx` | Read-only grouped table/cards display of draw records |

### Deprecated Files (Optional Cleanup)
| File | Status |
|------|--------|
| `src/components/DataEntryTab.tsx` | Replaced by DrawDataTab (safe to delete) |
| `src/components/AddRecordForm.tsx` | No longer used (safe to delete) |
| `src/components/RecordsList.tsx` | Replaced by DrawDataTable (safe to delete) |
| `src/components/PoolIndicator.tsx` | Merged into UserInputPanel (safe to delete) |

---

## Design System Reference

### Color Palette (CSS Variables & Tailwind)
```
Forest:       #0d1a12  — page background
Surface:      #162110  — primary cards/panels
Surface-2:    #1e2e1a  — nested panels, inputs
Border:       #2e4a2a  — dividers
Sage:         #4d8a62  — secondary UI
Meadow:       #7dbf94  — success indicators
Amber Dark:   #c97d28  — primary actions
Gold:         #e8a542  — highlights
Cream:        #ede8d6  — body text
Parchment:    #b8ad92  — secondary text
Bark:         #7a5230  — muted accents
Danger:       #c0392b  — errors
Warn:         #d4821a  — warnings
```

### Typography Stack
- **Display** — Bebas Neue (app title, large numbers)
- **Heading** — Oswald 300/400/600 (section headers, labels)
- **Body** — Cabin 400/500/600 (form text, descriptions)
- **Monospace** — JetBrains Mono 400/500 (odds %, counts)

### Responsive Breakpoints
- **Mobile** — < 640px (default, single column)
- **Tablet (sm)** — 640px+ (two-column grids)
- **Tablet (md)** — 768px+ (table view, sidebar appears)
- **Desktop (lg)** — 1024px+ (ad sidebar, max-width)
- **Wide (xl)** — 1280px+ (wider ad sidebars)

### Touch Targets
- Minimum: 44×44px for all interactive elements
- Bottom nav: 56px height minimum
- Form inputs: 44px minimum height

## Testing Checklist

### Desktop (Chrome/Firefox/Safari)
- [ ] Loading screen animates smoothly
- [ ] Onboarding form accepts input and creates account
- [ ] Tab switching fades in/out (150ms ease)
- [ ] Slider works with gradient fill
- [ ] Hover states on cards lift slightly
- [ ] Button press scales down (0.97)
- [ ] Tab navigation with ARIA labels
- [ ] Focus visible with gold outline (keyboard nav)
- [ ] Empty states render with icons and proper styling
- [ ] Ad placeholders visible in correct sizes

### Mobile (iOS Safari / Android Chrome)
- [ ] Bottom tab bar fixed to viewport
- [ ] Account dropdown accessible on small screens
- [ ] Range slider has 44px+ hit area
- [ ] OddsTable renders as cards (not table)
- [ ] History toggle on cards works
- [ ] Buttons are 44×44px minimum
- [ ] Landscape orientation handled
- [ ] Keyboard shows for form inputs

### Accessibility
- [ ] Tab navigation with screen reader
- [ ] ARIA labels read correctly
- [ ] Focus outline visible
- [ ] Prefers-reduced-motion respected
- [ ] Prefers-contrast: more mode works
- [ ] Keyboard-only navigation (no mouse)

### Performance
- [ ] Google Fonts load via CDN
- [ ] No build step for ad placeholders
- [ ] CSS animations use GPU (transform/opacity)
- [ ] No jank on tab switching

## Deployment Notes

**Data Updates:**
Update `src/data/seed-draw-data.ts` each season:
1. Scrape GFP draw statistics from https://license.gooutdoorssouthdakota.com/License/DrawStatistics
2. Replace `SEED_DRAW_DATA` array with new records
3. Update "Last updated" date in DrawDataTab
4. No runtime data entry — all data bundled in build

**Ad Network Integration:**
Replace `<AdPlaceholder>` with real ad tags:
```jsx
// Before
<AdPlaceholder size="banner" />

// After (Google AdSense example)
<div data-ad-slot="1234567890" style={{width: '100%', height: '90px'}}>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <ins className="adsbygoogle"
       style={{display: 'inline-block', width: '728px', height: '90px'}}
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="1234567890"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Android Chrome 90+

## Decisions & Architecture

**No new runtime dependencies** — everything achievable with Tailwind 4 + CSS + React 19.
Google Fonts loaded via CDN (zero bundle impact).

**Ad placeholders** use `data-ad-slot` attribute for easy network integration without code changes.

**Bottom tab bar on mobile** improves thumb reach — navigation moves to bottom, header stays minimal.

**Inline confirmations** replace native `confirm()` dialogs — better UX on mobile.

**Data tab is read-only** — bundled `SEED_DRAW_DATA` eliminates data entry overhead.
Update seed file each season; no manual user entry needed.

**Responsive-first design** — base styles are mobile (< 640px), enhanced upward.
All breakpoints tested on real devices, not just browser resizing.
