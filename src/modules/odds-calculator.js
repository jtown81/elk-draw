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
export function calcEntries(points) {
    if (points < 0 || points > 25) {
        throw new Error(`Invalid preference points: ${points}. Must be 0–25.`);
    }
    return Math.pow(points + 1, 3);
}
/**
 * Determine which pool a user with given preference points qualifies for.
 *
 * **Pool Hierarchy (descending priority):**
 * - 15+ Pool: 15+ preference points
 * - 10+ Pool: 10–14 preference points
 * - 0+ Pool: 0–9 preference points
 *
 * @param points User's preference points (0–25)
 * @returns The pool key the user qualifies for ('15plus', '10plus', or '0plus')
 */
export function getQualifyingPool(points) {
    if (points >= 15)
        return '15plus';
    if (points >= 10)
        return '10plus';
    return '0plus';
}
/**
 * Calculate average entries per applicant for a given pool.
 *
 * Since GFP only publishes total applicant counts (not point distribution),
 * we approximate total pool entries by using the midpoint of each pool's
 * point range and calculating entries for that midpoint.
 *
 * **Midpoint Estimates:**
 * - 15+ Pool: midpoint ≈ 17 points → (18)³ = 5,832 avg entries
 * - 10+ Pool: midpoint ≈ 12 points → (13)³ = 2,197 avg entries
 * - 0+ Pool: midpoint ≈ 5 points → (6)³ = 216 avg entries
 *
 * These are approximations and can be adjusted based on observed data patterns.
 *
 * @param pool Pool key
 * @returns Estimated average entries per applicant in that pool
 */
export function calcAvgEntriesForPool(pool) {
    // Midpoint estimates for each pool (tunable based on observed distributions)
    const midpoints = {
        '15plus': 17,
        '10plus': 12,
        '2plus': 3,
        '0plus': 5,
    };
    return calcEntries(midpoints[pool]);
}
/**
 * Calculate odds of drawing a tag for the given parameters.
 *
 * **Formula:**
 * ```
 * odds% = (user_entries / (pool_applicants × avg_entries_per_applicant)) × 100
 * ```
 *
 * This approximation assumes the user qualifies for `pool` and competes only
 * with applicants in that same pool.
 *
 * **Important Notes:**
 * - Odds are approximate (~) because point distribution within pools is unknown
 * - Lowest point drawn allows filtering (if drawn point > user points, user didn't draw)
 * - Result is capped at 100% to avoid displaying >100% odds (shouldn't happen)
 *
 * @param userPoints User's preference points (0–25)
 * @param pool Pool the user qualifies for
 * @param poolApplicants Number of applicants in that pool
 * @returns Approximate odds percentage (0–100)
 */
export function calcOdds(userPoints, pool, poolApplicants) {
    if (poolApplicants <= 0) {
        return 0;
    }
    const userEntries = calcEntries(userPoints);
    const avgEntriesPerApplicant = calcAvgEntriesForPool(pool);
    const totalPoolEntries = poolApplicants * avgEntriesPerApplicant;
    if (totalPoolEntries === 0) {
        return 0;
    }
    const odds = (userEntries / totalPoolEntries) * 100;
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
export function couldUserDraw(userPoints, lowestPointDrawn) {
    if (lowestPointDrawn === null) {
        return true; // unknown, assume possible
    }
    return userPoints >= lowestPointDrawn;
}
