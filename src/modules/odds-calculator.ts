/**
 * South Dakota Elk Draw Odds Calculator
 *
 * Core pure functions for calculating hunting odds based on preference points,
 * pool data, and applicant counts.
 *
 * Formula Reference:
 * - Entries: (points + 1)³ (confirmed by GFP since 2018)
 * - Odds: (user_entries / total_pool_entries) × 100
 * - Pool average: Use midpoint of point range as approximation
 */

import type { PoolKey } from '@models/draw';

/**
 * Pool allocation percentages per GFP regulations.
 *
 * Black Hills & Prairie elk (H-units, 9A, 11A, 15A, 27A):
 *   Landowner: 50% (not visible in draw stats — pre-allocated)
 *   10+ Pool:  30% of remaining tags
 *   2+  Pool:  15% of remaining tags
 *   0+  Pool:   5% of remaining tags
 *
 * Custer State Park (CSP):
 *   15+ Pool:  34%
 *   10+ Pool:  33%
 *   0+  Pool:  33%
 *
 * Source: https://gfp.sd.gov/preference-points/
 */
export const POOL_ALLOCATIONS: Record<string, Record<PoolKey, number>> = {
  blackhills: {
    '15plus': 0,   // not offered for Black Hills units
    '10plus': 30,
    '2plus':  15,
    '0plus':   5,
  },
  csp: {
    '15plus': 34,
    '10plus': 33,
    '2plus':   0,  // CSP uses 15+/10+/0+, no separate 2+ pool
    '0plus':  33,
  },
};

/**
 * Derive unit type from unit name for allocation lookup.
 * Returns 'csp' for Custer State Park, 'blackhills' for all others.
 */
export function getUnitType(unitName: string): 'blackhills' | 'csp' {
  return unitName.toUpperCase() === 'CSP' ? 'csp' : 'blackhills';
}

/**
 * Get the tag allocation percentage for the user's qualifying pool.
 *
 * @param pool User's qualifying pool key
 * @param unitType 'blackhills' | 'csp'
 * @returns Percentage of tags allocated to that pool (0–100)
 */
export function getPoolAllocationPct(pool: PoolKey, unitType: 'blackhills' | 'csp'): number {
  return POOL_ALLOCATIONS[unitType][pool] ?? 0;
}

/**
 * Calculate the number of lottery entries for a given preference point count.
 *
 * **Formula:** (points + 1)³
 *
 * Example:
 * - 0 points → (0+1)³ = 1 entry
 * - 11 points → (11+1)³ = 1,728 entries
 * - 25 points → (25+1)³ = 17,576 entries
 *
 * Source: GFP implemented this cubed formula in 2018.
 */
export function calcEntries(points: number): number {
  if (points < 0 || points > 25) {
    throw new Error(`Invalid preference points: ${points}. Must be 0–25.`);
  }
  return Math.pow(points + 1, 3);
}

/**
 * Determine which pool a user with given preference points qualifies for.
 *
 * **Pool Hierarchy (Black Hills & Prairie elk, per GFP regulations):**
 * - 15+ Pool: 15+ preference points (CSP only — 34% allocation)
 * - 10+ Pool: 10–14 preference points (30% of tags in Black Hills; 33% in CSP)
 * - 2+ Pool:  2–9 preference points  (15% of tags in Black Hills)
 * - 0+ Pool:  0–1 preference points  (5% of tags in Black Hills)
 *
 * Source: https://gfp.sd.gov/preference-points/
 *
 * @param points User's preference points (0–25)
 * @returns The pool key the user qualifies for
 */
export function getQualifyingPool(points: number): PoolKey {
  if (points >= 15) return '15plus';
  if (points >= 10) return '10plus';
  if (points >= 2) return '2plus';
  return '0plus';
}

/**
 * Calculate average entries per applicant for a given pool.
 *
 * Since GFP only publishes total applicant counts (not point distributions),
 * we approximate total pool entries by using the midpoint of each pool's
 * point range and calculating entries for that midpoint.
 *
 * **Midpoint Estimates (based on actual GFP pool ranges):**
 * - 15+ Pool: 15–25 pts, midpoint ≈ 17 → (18)³ = 5,832 avg entries
 * - 10+ Pool: 10–14 pts, midpoint ≈ 12 → (13)³ = 2,197 avg entries
 * - 2+  Pool: 2–9 pts,   midpoint ≈ 5  → (6)³  =   216 avg entries
 * - 0+  Pool: 0–1 pts,   midpoint ≈ 0  → (1)³  =     1 avg entry
 *
 * Note: 0+ pool applicants have 0 or 1 points (1–8 entries each).
 * Using midpoint=0 (1 entry) is conservative; actual odds may be slightly
 * higher for applicants with 1 point in this pool.
 *
 * Source: GFP pool ranges per https://gfp.sd.gov/preference-points/
 *
 * @param pool Pool key
 * @returns Estimated average entries per applicant in that pool
 */
export function calcAvgEntriesForPool(pool: PoolKey): number {
  // Midpoint of each pool's actual point range (per GFP pool definitions)
  const midpoints: Record<PoolKey, number> = {
    '15plus': 17, // range: 15–25 pts
    '10plus': 12, // range: 10–14 pts
    '2plus':  5,  // range: 2–9 pts
    '0plus':  0,  // range: 0–1 pts
  };
  return calcEntries(midpoints[pool]);
}

/**
 * Calculate odds of drawing a tag for the given parameters.
 *
 * **Formula:**
 * ```
 * odds% = (user_entries × tags_available / total_pool_entries) × 100
 * ```
 *
 * This approximation assumes the user qualifies for `pool` and competes only
 * with applicants in that same pool.
 *
 * **Important Notes:**
 * - Odds are approximate (~) because point distribution within pools is unknown
 * - Lowest point drawn allows filtering (if drawn point > user points, user didn't draw)
 * - Result is capped at 100% to avoid displaying >100% odds
 * - If pool has zero applicants, returns 100% (guaranteed draw)
 *
 * @param userPoints User's preference points (0–25)
 * @param pool Pool the user qualifies for
 * @param poolApplicants Number of applicants in that pool
 * @param tagsAvailable Number of tags available in that pool
 * @returns Approximate odds percentage (0–100)
 */
export function calcOdds(
  userPoints: number,
  pool: PoolKey,
  poolApplicants: number,
  tagsAvailable: number
): number {
  if (poolApplicants <= 0) {
    return 100; // guaranteed draw if no applicants
  }

  const userEntries = calcEntries(userPoints);
  const avgEntriesPerApplicant = calcAvgEntriesForPool(pool);
  const totalPoolEntries = poolApplicants * avgEntriesPerApplicant;

  if (totalPoolEntries === 0) {
    return 100; // guaranteed draw if no entries
  }

  const odds = (userEntries * tagsAvailable / totalPoolEntries) * 100;
  return Math.min(odds, 100); // cap at 100%
}

/**
 * Determine if a user can possibly draw based on lowest point drawn.
 *
 * If the lowest point drawn is greater than the user's points, the user
 * did not participate in that draw (insufficient points for the pool).
 *
 * @param userPoints User's preference points
 * @param lowestPointDrawn Lowest point drawn by GFP (null if unknown)
 * @returns true if user could have drawn, false if definitely didn't draw
 */
export function couldUserDraw(
  userPoints: number,
  lowestPointDrawn: number | null
): boolean {
  if (lowestPointDrawn === null) {
    return true; // unknown, assume possible
  }
  return userPoints >= lowestPointDrawn;
}
