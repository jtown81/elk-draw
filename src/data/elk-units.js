/**
 * South Dakota Elk Units
 *
 * Static list of all 28 SD elk units grouped by region.
 * Source: https://gfp.sd.gov/elk/
 */
export const ELK_UNITS = {
    blackHills: [
        'H1A', 'H1B',
        'H2A', 'H2B', 'H2C', 'H2D', 'H2E', 'H2F', 'H2G', 'H2H', 'H2I', 'H2J',
        'H3A', 'H3B', 'H3C', 'H3D', 'H3E', 'H3F', 'H3G',
        'H4A', 'H4B',
        'H5A',
        'H6A', 'H6B',
        'H7A', 'H7B',
        'H9A', 'H9B',
        'H11A', 'H11B', 'H11C', 'H11D', 'H11E',
    ],
    prairie: [
        '9A',
        '11A', '11B',
        '15A', '15B',
        '27A', '27B',
    ],
    csp: [
        'CSP',
    ],
};
/**
 * Get all elk units as a flat array.
 */
export function getAllUnits() {
    return [...ELK_UNITS.blackHills, ...ELK_UNITS.prairie, ...ELK_UNITS.csp];
}
/**
 * Get all units sorted alphabetically.
 */
export function getAllUnitsSorted() {
    return getAllUnits().sort();
}
/**
 * Get the region for a given unit name.
 */
export function getUnitRegion(unitName) {
    if (ELK_UNITS.blackHills.includes(unitName))
        return 'blackHills';
    if (ELK_UNITS.prairie.includes(unitName))
        return 'prairie';
    return 'csp';
}
/**
 * Check if a string is a valid unit name.
 */
export function isValidUnit(name) {
    const allUnits = getAllUnits();
    return allUnits.includes(name.toUpperCase());
}
