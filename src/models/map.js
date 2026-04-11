/**
 * Map Data Models
 *
 * Interfaces for unit polygons, odds tiers, and map rendering.
 */
/**
 * Calculate odds tier based on percentage.
 */
export function getOddsTier(oddsPercent) {
    if (oddsPercent === 100)
        return 'guaranteed';
    if (oddsPercent >= 5)
        return 'good';
    if (oddsPercent >= 2)
        return 'fair';
    if (oddsPercent > 0)
        return 'low';
    return 'none';
}
/**
 * Get color for an odds tier.
 */
export function getTierColor(tier) {
    switch (tier) {
        case 'guaranteed':
            return '#7dbf94'; // meadow
        case 'good':
            return '#e8a542'; // gold
        case 'fair':
            return '#c97d28'; // amber-dark
        case 'low':
            return '#c0392b'; // danger
        case 'none':
            return '#7a5230'; // bark
    }
}
