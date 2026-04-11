/**
 * South Dakota Elk Draw Pools Configuration
 *
 * Pool eligibility, tag allocation, and metadata.
 * Source: GFP Draw Statistics and OPM documentation
 */
/**
 * Draw pool configurations.
 *
 * **Pools:**
 * - 15+ Pool: 34% of tags (requires 15+ preference points)
 * - 10+ Pool: 33% of tags (requires 10+ preference points)
 * - 0+ Pool:  33% of tags (all residents, regardless of points)
 *
 * Note: Pool eligibility is hierarchical. A user with 15 points qualifies for
 * the 15+ pool (not 10+ or 0+). Pool membership is determined at draw time by GFP.
 */
export const DRAW_POOLS = {
    '15plus': {
        label: '15+ Pool',
        minPoints: 15,
        tagPct: 0.34,
    },
    '10plus': {
        label: '10+ Pool',
        minPoints: 10,
        tagPct: 0.33,
    },
    '2plus': {
        label: '2+ Pool',
        minPoints: 2,
        tagPct: 0.0, // tag pct varies by unit; 0 is a safe placeholder
    },
    '0plus': {
        label: '0+ Pool',
        minPoints: 0,
        tagPct: 0.33,
    },
};
/**
 * Get the pool config for a given pool key.
 */
export function getPoolConfig(pool) {
    return DRAW_POOLS[pool];
}
/**
 * Get all pools in priority order (highest min points first).
 */
export function getAllPoolsOrdered() {
    return ['15plus', '10plus', '2plus', '0plus'];
}
