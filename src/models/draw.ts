/**
 * South Dakota Elk Draw Data Models
 *
 * Core types for managing elk hunting draw records, pool data, and odds calculations.
 */

export type TagType = 'any_elk' | 'antlerless';
export type PoolKey = '15plus' | '10plus' | '2plus' | '0plus';

/**
 * A user account for managing elk draw data.
 * All draw records and preferences are scoped to a user.
 */
export interface UserAccount {
  id: string;              // crypto.randomUUID()
  name: string;            // user-defined account name
  createdDate: string;     // ISO timestamp
  updatedDate: string;     // ISO timestamp
}

/**
 * Data for a single preference point pool within a draw record.
 */
export interface PoolData {
  pool: PoolKey;                    // which preference pool (15+, 10+, 0+)
  tagsAvailable: number;            // tags allocated to this pool
  applicants: number;               // applicants in this pool
  lowestPointDrawn: number | null;  // lowest point drawn (null if not yet drawn)
}

/**
 * A single elk hunting draw record for a specific unit, year, and tag type.
 * May contain 1-3 pool entries (not all units have all pools).
 */
export interface DrawRecord {
  id: string;              // crypto.randomUUID()
  unitName: string;        // e.g. "H1A" (always uppercased)
  year: number;            // e.g. 2023
  tagType: TagType;        // 'any_elk' | 'antlerless'
  pools: PoolData[];       // 1-3 pool entries
  notes?: string;          // optional free-text note
  addedDate: string;       // ISO timestamp
  updatedDate: string;     // ISO timestamp
}

/**
 * User's hunting preferences and point configuration.
 */
export interface UserConfig {
  preferencePoints: number;  // 0–25
  tagType: TagType;          // 'any_elk' | 'antlerless'
}

/**
 * Historical odds for a single year.
 */
export interface HistoricalOdds {
  year: number;
  oddsPercent: number;
  applicants: number;
  tagsAvailable: number;
  lowestPointDrawn: number | null;
}

/**
 * Calculated odds result for a user querying a specific unit.
 * Includes current year odds and historical trend.
 */
export interface OddsResult {
  unitName: string;
  year: number;
  tagType: TagType;
  qualifyingPool: PoolKey;          // which pool the user falls into
  userEntries: number;              // (points+1)³
  tagsAvailable: number;
  applicants: number;
  lowestPointDrawn: number | null;
  oddsPercent: number;              // approximation using pool avg entries
  historicalOdds: HistoricalOdds[]; // trends for past years
}
